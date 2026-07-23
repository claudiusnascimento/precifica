<?php

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;

test('user can create recipe with ingredients', function () {
    $user = User::factory()->create();
    $farinha = Ingredient::factory()->for($user)->create([
        'name' => 'Farinha',
        'unit' => IngredientUnit::Gram,
    ]);
    $ovo = Ingredient::factory()->for($user)->create([
        'name' => 'Ovo',
        'unit' => IngredientUnit::Unit,
    ]);

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo de Cenoura',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
        'ingredients' => [
            ['id' => $farinha->id, 'quantity' => 500],
            ['id' => $ovo->id, 'quantity' => 3],
        ],
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('data.name', 'Bolo de Cenoura')
        ->assertJsonPath('data.yield_unit', 'unit')
        ->assertJsonPath('data.yield_unit_label', 'Unidade')
        ->assertJsonCount(2, 'data.ingredients');

    $this->assertDatabaseHas('recipes', [
        'user_id' => $user->id,
        'name' => 'Bolo de Cenoura',
    ]);

    $this->assertDatabaseHas('ingredient_recipe', [
        'ingredient_id' => $farinha->id,
        'quantity' => '500.0000',
    ]);
});

test('user can list own recipes', function () {
    $user = User::factory()->create();
    Recipe::factory()->count(3)->for($user)->create();
    Recipe::factory()->count(2)->create();

    $response = $this->actingAs($user)->getJson('/api/recipes');

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
});

test('user can view own recipe with ingredients', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->withIngredients(2)->create([
        'name' => 'Brigadeiro',
    ]);

    $response = $this->actingAs($user)->getJson("/api/recipes/{$recipe->id}");

    $response
        ->assertOk()
        ->assertJsonPath('data.name', 'Brigadeiro')
        ->assertJsonCount(2, 'data.ingredients');
});

test('user can update own recipe and sync ingredients', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->withIngredients(1)->create([
        'name' => 'Bolo',
    ]);
    $novo = Ingredient::factory()->for($user)->create(['name' => 'Leite']);

    $response = $this->actingAs($user)->putJson("/api/recipes/{$recipe->id}", [
        'name' => 'Bolo atualizado',
        'yield_quantity' => 2,
        'yield_unit' => IngredientUnit::Kilogram->value,
        'ingredients' => [
            ['id' => $novo->id, 'quantity' => 250],
        ],
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.name', 'Bolo atualizado')
        ->assertJsonPath('data.yield_unit', 'kilogram')
        ->assertJsonCount(1, 'data.ingredients')
        ->assertJsonPath('data.ingredients.0.id', $novo->id);
});

test('user can delete own recipe (soft delete) preserving pivot', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->withIngredients(1)->create();
    $pivotCount = $recipe->ingredients()->count();

    $response = $this->actingAs($user)->deleteJson("/api/recipes/{$recipe->id}");

    $response->assertOk();

    $this->assertSoftDeleted('recipes', [
        'id' => $recipe->id,
    ]);

    expect($pivotCount)->toBe(1);
    $this->assertDatabaseCount('ingredient_recipe', 1);

    $this->actingAs($user)
        ->getJson('/api/recipes')
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

test('user can filter recipes by name', function () {
    $user = User::factory()->create();
    Recipe::factory()->for($user)->create(['name' => 'Bolo de Cenoura']);
    Recipe::factory()->for($user)->create(['name' => 'Brigadeiro']);

    $response = $this->actingAs($user)->getJson('/api/recipes?name=Bolo');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Bolo de Cenoura');
});

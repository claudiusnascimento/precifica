<?php

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

test('user can create ingredient', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/ingredients', [
        'name' => 'Farinha',
        'unit' => IngredientUnit::Gram->value,
        'price' => 0.008,
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('data.name', 'Farinha')
        ->assertJsonPath('data.unit', 'gram')
        ->assertJsonPath('data.unit_label', 'Grama');

    $this->assertDatabaseHas('ingredients', [
        'user_id' => $user->id,
        'name' => 'Farinha',
    ]);
});

test('user can list own ingredients', function () {
    $user = User::factory()->create();
    Ingredient::factory()->count(3)->for($user)->create();
    Ingredient::factory()->count(2)->create();

    $response = $this->actingAs($user)->getJson('/api/ingredients');

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
});

test('user can view own ingredient', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create(['name' => 'Ovo']);

    $response = $this->actingAs($user)->getJson("/api/ingredients/{$ingredient->id}");

    $response
        ->assertOk()
        ->assertJsonPath('data.name', 'Ovo');
});

test('user can update own ingredient', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create([
        'name' => 'Ovo',
        'price' => 0.1,
    ]);

    $response = $this->actingAs($user)->putJson("/api/ingredients/{$ingredient->id}", [
        'name' => 'Ovo caipira',
        'unit' => IngredientUnit::Unit->value,
        'price' => 0.25,
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.name', 'Ovo caipira')
        ->assertJsonPath('data.price', '0.2500');
});

test('user can delete own ingredient (soft delete)', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create();

    $response = $this->actingAs($user)->deleteJson("/api/ingredients/{$ingredient->id}");

    $response->assertOk();

    $this->assertSoftDeleted('ingredients', [
        'id' => $ingredient->id,
    ]);

    $this->actingAs($user)
        ->getJson('/api/ingredients')
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

test('user can list ingredient units', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/ingredient-units');

    $response
        ->assertOk()
        ->assertJsonFragment(['value' => 'gram', 'label' => 'Grama'])
        ->assertJsonFragment(['value' => 'unit', 'label' => 'Unidade']);
});

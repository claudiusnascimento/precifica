<?php

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;

test('user cannot create recipe with duplicate name', function () {
    $user = User::factory()->create();
    Recipe::factory()->for($user)->create(['name' => 'Bolo']);

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['name']);
});

test('user can reuse name of soft deleted recipe', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->create(['name' => 'Bolo']);
    $recipe->delete();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
    ]);

    $response->assertCreated();
});

test('user cannot create recipe with invalid yield unit', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => 'invalid-unit',
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['yield_unit']);
});

test('user cannot create recipe with zero yield quantity', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 0,
        'yield_unit' => IngredientUnit::Unit->value,
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['yield_quantity']);
});

test('user cannot attach ingredient from another user', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $foreign = Ingredient::factory()->for($other)->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
        'ingredients' => [
            ['id' => $foreign->id, 'quantity' => 100],
        ],
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['ingredients.0.id']);
});

test('ingredient quantity is required when ingredient id is present', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
        'ingredients' => [
            ['id' => $ingredient->id],
        ],
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['ingredients.0.quantity']);
});

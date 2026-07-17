<?php

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

test('user cannot create ingredient with duplicate name', function () {
    $user = User::factory()->create();
    Ingredient::factory()->for($user)->create(['name' => 'Farinha']);

    $response = $this->actingAs($user)->postJson('/api/ingredients', [
        'name' => 'Farinha',
        'unit' => IngredientUnit::Gram->value,
        'price' => 0.01,
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['name']);
});

test('user can reuse name of soft deleted ingredient', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create(['name' => 'Farinha']);
    $ingredient->delete();

    $response = $this->actingAs($user)->postJson('/api/ingredients', [
        'name' => 'Farinha',
        'unit' => IngredientUnit::Gram->value,
        'price' => 0.01,
    ]);

    $response->assertCreated();
});

test('user cannot create ingredient with invalid unit', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/ingredients', [
        'name' => 'Farinha',
        'unit' => 'invalid-unit',
        'price' => 0.01,
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['unit']);
});

test('user cannot create ingredient with negative price', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/ingredients', [
        'name' => 'Farinha',
        'unit' => IngredientUnit::Gram->value,
        'price' => -1,
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors(['price']);
});

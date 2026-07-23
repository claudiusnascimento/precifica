<?php

use App\Enums\IngredientUnit;
use App\Models\User;

test('user can create recipe without ingredients', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Rascunho',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('data.name', 'Rascunho')
        ->assertJsonCount(0, 'data.ingredients');

    $this->assertDatabaseHas('recipes', [
        'user_id' => $user->id,
        'name' => 'Rascunho',
    ]);
});

test('user can create recipe with empty ingredients array', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/recipes', [
        'name' => 'Sem insumos',
        'yield_quantity' => 2,
        'yield_unit' => IngredientUnit::Kilogram->value,
        'ingredients' => [],
    ]);

    $response
        ->assertCreated()
        ->assertJsonCount(0, 'data.ingredients');
});

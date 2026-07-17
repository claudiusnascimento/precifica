<?php

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

test('guest cannot access ingredients', function () {
    $this->getJson('/api/ingredients')->assertUnauthorized();
    $this->postJson('/api/ingredients', [])->assertUnauthorized();
});

test('user cannot view ingredient of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $ingredient = Ingredient::factory()->for($owner)->create();

    $this->actingAs($other)
        ->getJson("/api/ingredients/{$ingredient->id}")
        ->assertForbidden();
});

test('user cannot update ingredient of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $ingredient = Ingredient::factory()->for($owner)->create();

    $this->actingAs($other)
        ->putJson("/api/ingredients/{$ingredient->id}", [
            'name' => 'Hack',
            'unit' => IngredientUnit::Unit->value,
            'price' => 1,
        ])
        ->assertForbidden();
});

test('user cannot delete ingredient of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $ingredient = Ingredient::factory()->for($owner)->create();

    $this->actingAs($other)
        ->deleteJson("/api/ingredients/{$ingredient->id}")
        ->assertForbidden();
});

test('user list does not include ingredients of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    Ingredient::factory()->for($owner)->create(['name' => 'Private']);

    $this->actingAs($other)
        ->getJson('/api/ingredients')
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

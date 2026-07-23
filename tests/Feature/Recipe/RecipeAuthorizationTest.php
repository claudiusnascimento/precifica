<?php

use App\Enums\IngredientUnit;
use App\Models\Recipe;
use App\Models\User;

test('guest cannot access recipes', function () {
    $this->getJson('/api/recipes')->assertUnauthorized();
    $this->postJson('/api/recipes', [])->assertUnauthorized();
});

test('user cannot view recipe of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $recipe = Recipe::factory()->for($owner)->create();

    $this->actingAs($other)
        ->getJson("/api/recipes/{$recipe->id}")
        ->assertForbidden();
});

test('user cannot update recipe of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $recipe = Recipe::factory()->for($owner)->create();

    $this->actingAs($other)
        ->putJson("/api/recipes/{$recipe->id}", [
            'name' => 'Hack',
            'yield_quantity' => 1,
            'yield_unit' => IngredientUnit::Unit->value,
        ])
        ->assertForbidden();
});

test('user cannot delete recipe of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $recipe = Recipe::factory()->for($owner)->create();

    $this->actingAs($other)
        ->deleteJson("/api/recipes/{$recipe->id}")
        ->assertForbidden();
});

test('user list does not include recipes of another user', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    Recipe::factory()->for($owner)->create(['name' => 'Private']);

    $this->actingAs($other)
        ->getJson('/api/recipes')
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

<?php

use App\Actions\Ingredient\CreateIngredientAction;
use App\Enums\IngredientUnit;
use App\Models\User;

test('create ingredient action persists ingredient for user', function () {
    $user = User::factory()->create();

    $ingredient = (new CreateIngredientAction)->execute($user, [
        'name' => 'Açúcar',
        'unit' => IngredientUnit::Gram->value,
        'price' => 0.006,
    ]);

    expect($ingredient->exists)->toBeTrue()
        ->and($ingredient->user_id)->toBe($user->id)
        ->and($ingredient->name)->toBe('Açúcar')
        ->and($ingredient->unit)->toBe(IngredientUnit::Gram);
});

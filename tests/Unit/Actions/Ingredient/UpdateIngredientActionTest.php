<?php

use App\Actions\Ingredient\UpdateIngredientAction;
use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

test('update ingredient action updates fields', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create([
        'name' => 'Ovo',
        'unit' => IngredientUnit::Unit,
        'price' => 0.1,
    ]);

    $updated = (new UpdateIngredientAction)->execute($ingredient, [
        'name' => 'Ovo branco',
        'unit' => IngredientUnit::Unit->value,
        'price' => 0.15,
    ]);

    expect($updated->name)->toBe('Ovo branco')
        ->and((float) $updated->price)->toBe(0.15);
});

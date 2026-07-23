<?php

use App\Actions\Recipe\CreateRecipeAction;
use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

test('create recipe action persists recipe and syncs ingredients', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create();

    $recipe = (new CreateRecipeAction)->execute($user, [
        'name' => 'Bolo',
        'yield_quantity' => 1,
        'yield_unit' => IngredientUnit::Unit->value,
        'ingredients' => [
            ['id' => $ingredient->id, 'quantity' => 100],
        ],
    ]);

    expect($recipe->exists)->toBeTrue()
        ->and($recipe->user_id)->toBe($user->id)
        ->and($recipe->name)->toBe('Bolo')
        ->and($recipe->ingredients)->toHaveCount(1)
        ->and($recipe->ingredients->first()->pivot->quantity)->toBe('100.0000');
});

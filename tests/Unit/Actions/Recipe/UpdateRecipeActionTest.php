<?php

use App\Actions\Recipe\UpdateRecipeAction;
use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;

test('update recipe action updates fields and replaces ingredients', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->withIngredients(1)->create(['name' => 'Antigo']);
    $novo = Ingredient::factory()->for($user)->create();

    $updated = (new UpdateRecipeAction)->execute($recipe, [
        'name' => 'Novo',
        'yield_quantity' => 3,
        'yield_unit' => IngredientUnit::Liter->value,
        'ingredients' => [
            ['id' => $novo->id, 'quantity' => 50],
        ],
    ]);

    expect($updated->name)->toBe('Novo')
        ->and($updated->yield_unit)->toBe(IngredientUnit::Liter)
        ->and($updated->ingredients)->toHaveCount(1)
        ->and($updated->ingredients->first()->id)->toBe($novo->id);
});

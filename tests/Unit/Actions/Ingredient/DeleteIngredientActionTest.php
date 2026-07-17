<?php

use App\Actions\Ingredient\DeleteIngredientAction;
use App\Models\Ingredient;
use App\Models\User;

test('delete ingredient action soft deletes ingredient', function () {
    $user = User::factory()->create();
    $ingredient = Ingredient::factory()->for($user)->create();

    (new DeleteIngredientAction)->execute($ingredient);

    $this->assertSoftDeleted('ingredients', [
        'id' => $ingredient->id,
    ]);
});

<?php

use App\Actions\Recipe\DeleteRecipeAction;
use App\Models\Recipe;
use App\Models\User;

test('delete recipe action soft deletes recipe', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->for($user)->create();

    (new DeleteRecipeAction)->execute($recipe);

    expect($recipe->fresh()->trashed())->toBeTrue();
});

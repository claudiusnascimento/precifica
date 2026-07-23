<?php

namespace App\Actions\Recipe;

use App\Models\Recipe;

class DeleteRecipeAction
{
    public function execute(Recipe $recipe): void
    {
        $recipe->delete();
    }
}

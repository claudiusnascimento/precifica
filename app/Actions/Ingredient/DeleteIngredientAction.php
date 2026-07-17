<?php

namespace App\Actions\Ingredient;

use App\Models\Ingredient;

class DeleteIngredientAction
{
    public function execute(Ingredient $ingredient): void
    {
        $ingredient->delete();
    }
}

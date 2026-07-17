<?php

namespace App\Actions\Ingredient;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;

class UpdateIngredientAction
{
    /**
     * @param  array{name: string, unit: string, price: float|string}  $data
     */
    public function execute(Ingredient $ingredient, array $data): Ingredient
    {
        $ingredient->update([
            'name' => $data['name'],
            'unit' => IngredientUnit::from($data['unit']),
            'price' => $data['price'],
        ]);

        return $ingredient->refresh();
    }
}

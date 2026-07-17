<?php

namespace App\Actions\Ingredient;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;

class CreateIngredientAction
{
    /**
     * @param  array{name: string, unit: string, price: float|string}  $data
     */
    public function execute(User $user, array $data): Ingredient
    {
        return Ingredient::query()->create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'unit' => IngredientUnit::from($data['unit']),
            'price' => $data['price'],
        ]);
    }
}

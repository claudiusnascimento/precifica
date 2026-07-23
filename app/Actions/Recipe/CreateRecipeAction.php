<?php

namespace App\Actions\Recipe;

use App\Enums\IngredientUnit;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateRecipeAction
{
    /**
     * @param  array{
     *     name: string,
     *     yield_quantity: float|string,
     *     yield_unit: string,
     *     ingredients?: list<array{id: int, quantity: float|string}>
     * }  $data
     */
    public function execute(User $user, array $data): Recipe
    {
        return DB::transaction(function () use ($user, $data): Recipe {
            $recipe = Recipe::query()->create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'yield_quantity' => $data['yield_quantity'],
                'yield_unit' => IngredientUnit::from($data['yield_unit']),
            ]);

            $recipe->ingredients()->sync($this->syncPayload($data['ingredients'] ?? []));

            return $recipe->load('ingredients');
        });
    }

    /**
     * @param  list<array{id: int, quantity: float|string}>  $ingredients
     * @return array<int, array{quantity: float|string}>
     */
    private function syncPayload(array $ingredients): array
    {
        $sync = [];

        foreach ($ingredients as $ingredient) {
            $sync[(int) $ingredient['id']] = [
                'quantity' => $ingredient['quantity'],
            ];
        }

        return $sync;
    }
}

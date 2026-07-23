<?php

namespace Database\Factories;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->words(3, true),
            'yield_quantity' => fake()->randomFloat(4, 0.5, 20),
            'yield_unit' => fake()->randomElement(IngredientUnit::cases()),
        ];
    }

    public function withIngredients(int $count = 2): static
    {
        return $this->afterCreating(function (Recipe $recipe) use ($count): void {
            $ingredients = Ingredient::factory()
                ->count($count)
                ->for($recipe->user)
                ->create();

            $sync = [];

            foreach ($ingredients as $ingredient) {
                $sync[$ingredient->id] = [
                    'quantity' => fake()->randomFloat(4, 0.1, 500),
                ];
            }

            $recipe->ingredients()->sync($sync);
        });
    }
}

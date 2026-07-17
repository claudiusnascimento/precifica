<?php

namespace Database\Factories;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ingredient>
 */
class IngredientFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->words(2, true),
            'unit' => fake()->randomElement(IngredientUnit::cases()),
            'price' => fake()->randomFloat(4, 0.001, 50),
        ];
    }
}

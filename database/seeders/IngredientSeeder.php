<?php

namespace Database\Seeders;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'user@precifica.test')->first()
            ?? User::query()->where('email', 'admin@precifica.test')->first();

        if ($user === null) {
            return;
        }

        $ingredients = [
            ['name' => 'Ovo', 'unit' => IngredientUnit::Unit, 'price' => '0.1000'],
            ['name' => 'Farinha de trigo', 'unit' => IngredientUnit::Gram, 'price' => '0.0080'],
            ['name' => 'Leite', 'unit' => IngredientUnit::Milliliter, 'price' => '0.0050'],
            ['name' => 'Açúcar', 'unit' => IngredientUnit::Gram, 'price' => '0.0060'],
            ['name' => 'Óleo', 'unit' => IngredientUnit::Milliliter, 'price' => '0.0120'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $ingredient['name'],
                ],
                [
                    'unit' => $ingredient['unit'],
                    'price' => $ingredient['price'],
                ],
            );
        }
    }
}

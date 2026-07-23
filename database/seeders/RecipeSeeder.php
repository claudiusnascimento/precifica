<?php

namespace Database\Seeders;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
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

        $farinha = Ingredient::query()
            ->where('user_id', $user->id)
            ->where('name', 'Farinha de trigo')
            ->first();
        $ovo = Ingredient::query()
            ->where('user_id', $user->id)
            ->where('name', 'Ovo')
            ->first();
        $oleo = Ingredient::query()
            ->where('user_id', $user->id)
            ->where('name', 'Óleo')
            ->first();

        $bolo = Recipe::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'name' => 'Bolo de Cenoura',
            ],
            [
                'yield_quantity' => '1.0000',
                'yield_unit' => IngredientUnit::Unit,
            ],
        );

        $sync = [];

        if ($farinha !== null) {
            $sync[$farinha->id] = ['quantity' => '500.0000'];
        }

        if ($ovo !== null) {
            $sync[$ovo->id] = ['quantity' => '3.0000'];
        }

        if ($oleo !== null) {
            $sync[$oleo->id] = ['quantity' => '200.0000'];
        }

        $bolo->ingredients()->sync($sync);

        Recipe::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'name' => 'Receita rascunho',
            ],
            [
                'yield_quantity' => '1.0000',
                'yield_unit' => IngredientUnit::Unit,
            ],
        );
    }
}

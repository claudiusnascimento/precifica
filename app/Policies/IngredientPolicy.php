<?php

namespace App\Policies;

use App\Models\Ingredient;
use App\Models\User;

class IngredientPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ingredient $ingredient): bool
    {
        return $user->id === $ingredient->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Ingredient $ingredient): bool
    {
        return $user->id === $ingredient->user_id;
    }

    public function delete(User $user, Ingredient $ingredient): bool
    {
        return $user->id === $ingredient->user_id;
    }
}

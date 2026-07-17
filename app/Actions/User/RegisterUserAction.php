<?php

namespace App\Actions\User;

use App\Enums\User\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class RegisterUserAction
{
    public function execute(string $name, string $email, string $password): User
    {
        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => UserRole::USER,
        ]);

        Auth::login($user);
        session()->regenerate();

        return $user;
    }
}

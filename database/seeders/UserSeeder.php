<?php

namespace Database\Seeders;

use App\Enums\User\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@precifica.test'],
            [
                'name' => 'Administrador',
                'password' => 'password',
                'role' => UserRole::ADMIN,
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'user@precifica.test'],
            [
                'name' => 'Usuário',
                'password' => 'password',
                'role' => UserRole::USER,
                'email_verified_at' => now(),
            ],
        );

        User::factory(8)->create();
    }
}

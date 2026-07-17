<?php

use App\Models\User;

test('user can register with valid data', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Maria Pastel',
        'email' => 'maria@precifica.test',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('user.email', 'maria@precifica.test')
        ->assertJsonPath('user.name', 'Maria Pastel');

    $this->assertDatabaseHas('users', [
        'email' => 'maria@precifica.test',
        'name' => 'Maria Pastel',
    ]);

    $this->assertAuthenticated();
});

test('user cannot register with duplicate email', function () {
    User::factory()->create([
        'email' => 'maria@precifica.test',
    ]);

    $response = $this->postJson('/api/register', [
        'name' => 'Maria Pastel',
        'email' => 'maria@precifica.test',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest();
});

test('user cannot register with password mismatch', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Maria Pastel',
        'email' => 'maria@precifica.test',
        'password' => 'password',
        'password_confirmation' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest();
});

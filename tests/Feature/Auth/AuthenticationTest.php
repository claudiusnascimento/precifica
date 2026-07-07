<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('user.email', $user->email);

    $this->assertAuthenticatedAs($user);
});

test('user cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest();
});

test('authenticated user can fetch profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/user');

    $response
        ->assertOk()
        ->assertJsonPath('user.email', $user->email);
});

test('guest cannot fetch profile', function () {
    $this->getJson('/api/user')->assertUnauthorized();
});

test('authenticated user can logout', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertOk();

    $this->getJson('/api/user')->assertOk();

    $this->postJson('/api/logout')
        ->assertOk();

    $this->getJson('/api/user')->assertUnauthorized();
});

test('user can request password reset link', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/forgot-password', [
        'email' => $user->email,
    ]);

    $response->assertOk();
});

test('user can reset password with valid token', function () {
    $user = User::factory()->create([
        'password' => 'old-password',
    ]);

    $token = Password::createToken($user);

    $response = $this->postJson('/api/reset-password', [
        'email' => $user->email,
        'token' => $token,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertOk();

    $user->refresh();

    expect(Hash::check('new-password', $user->password))->toBeTrue();
});

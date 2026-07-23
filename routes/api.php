<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\IngredientUnitController;
use App\Http\Controllers\Api\RecipeController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/ingredient-units', [IngredientUnitController::class, 'index']);
    Route::apiResource('ingredients', IngredientController::class);
    Route::apiResource('recipes', RecipeController::class);
});

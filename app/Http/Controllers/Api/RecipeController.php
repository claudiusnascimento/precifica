<?php

namespace App\Http\Controllers\Api;

use App\Actions\Recipe\CreateRecipeAction;
use App\Actions\Recipe\DeleteRecipeAction;
use App\Actions\Recipe\UpdateRecipeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Recipe\StoreRecipeRequest;
use App\Http\Requests\Recipe\UpdateRecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecipeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Recipe::class);

        $query = Recipe::query()
            ->where('user_id', $request->user()->id)
            ->withCount('ingredients')
            ->orderBy('name');

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->string('name')->toString().'%');
        }

        return RecipeResource::collection(
            $query->paginate($request->integer('per_page', 15)),
        );
    }

    public function store(
        StoreRecipeRequest $request,
        CreateRecipeAction $createRecipeAction,
    ): JsonResponse {
        $this->authorize('create', Recipe::class);

        $recipe = $createRecipeAction->execute(
            user: $request->user(),
            data: $request->validated(),
        );

        return (new RecipeResource($recipe))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Recipe $recipe): RecipeResource
    {
        $this->authorize('view', $recipe);

        $recipe->load('ingredients');

        return new RecipeResource($recipe);
    }

    public function update(
        UpdateRecipeRequest $request,
        Recipe $recipe,
        UpdateRecipeAction $updateRecipeAction,
    ): RecipeResource {
        $this->authorize('update', $recipe);

        $recipe = $updateRecipeAction->execute(
            recipe: $recipe,
            data: $request->validated(),
        );

        return new RecipeResource($recipe);
    }

    public function destroy(
        Recipe $recipe,
        DeleteRecipeAction $deleteRecipeAction,
    ): JsonResponse {
        $this->authorize('delete', $recipe);

        $deleteRecipeAction->execute($recipe);

        return response()->json([
            'message' => 'Receita removida com sucesso.',
        ]);
    }
}

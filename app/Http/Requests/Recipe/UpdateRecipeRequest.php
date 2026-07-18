<?php

namespace App\Http\Requests\Recipe;

use App\Enums\IngredientUnit;
use App\Models\Recipe;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Recipe $recipe */
        $recipe = $this->route('recipe');

        return [
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('recipes', 'name')
                    ->where(fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->whereNull('deleted_at'))
                    ->ignore($recipe->id),
            ],
            'yield_quantity' => ['required', 'numeric', 'min:0.0001', 'max:999999.9999'],
            'yield_unit' => ['required', Rule::enum(IngredientUnit::class)],
            'ingredients' => ['sometimes', 'array'],
            'ingredients.*.id' => [
                'required',
                'integer',
                Rule::exists('ingredients', 'id')->where(fn ($query) => $query
                    ->where('user_id', $this->user()->id)
                    ->whereNull('deleted_at')),
            ],
            'ingredients.*.quantity' => ['required', 'numeric', 'min:0.0001', 'max:999999.9999'],
        ];
    }
}

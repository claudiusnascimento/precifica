<?php

namespace App\Http\Requests\Recipe;

use App\Enums\IngredientUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRecipeRequest extends FormRequest
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
        return [
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('recipes', 'name')
                    ->where(fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->whereNull('deleted_at')),
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

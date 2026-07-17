<?php

namespace App\Http\Requests\Ingredient;

use App\Enums\IngredientUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIngredientRequest extends FormRequest
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
                Rule::unique('ingredients', 'name')
                    ->where(fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->whereNull('deleted_at')),
            ],
            'unit' => ['required', Rule::enum(IngredientUnit::class)],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.9999'],
        ];
    }
}

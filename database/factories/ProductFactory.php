<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(10000, 1000000),
            'stock' => $this->faker->numberBetween(1, 100),
            'image' => null, // nanti bisa diisi upload / placeholder
        ];
    }
}

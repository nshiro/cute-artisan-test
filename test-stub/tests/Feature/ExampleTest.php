<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Mail\FooMail;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class   ExampleTest   extends   TestCase
{
    /**
     * A basic test example.
     */
    public function aaaほげほげ(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function bbbあいあい(): void
    {
        $response = $this->get('/');

        $response->assertStatus(201);
    }
}

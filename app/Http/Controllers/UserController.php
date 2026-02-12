<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class UserController extends Controller
{
   public function edit()
{
    return Inertia::render('SettingUsers', [
        'user' => auth()->user()
    ]);
}

public function update(Request $request)
{
    $request->validate([
        'name' => 'required',
        'address' => 'nullable|string',
        'phone' => 'nullable|string',
    ]);

    auth()->user()->update($request->only([
        'name', 'address', 'phone'
    ]));

    return redirect()->back();
}

}

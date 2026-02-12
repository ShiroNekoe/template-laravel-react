import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } =
    useForm<Required<LoginForm>>({
      email: "",
      password: "",
      remember: false,
    });

   const [showPassword, setShowPassword] = useState(false); 
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen grid md:grid-cols-2">
        {/* ================= LEFT ================= */}
        <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 overflow-hidden">
          {/* glow */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%)]" />

          {/* meteor */}
          <div className="meteor" />
          <div className="meteor delay-2" />
          <div className="meteor delay-4" />

          <div className="relative text-center text-white p-10">
            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/95 p-6 rounded-3xl shadow-2xl ring-1 ring-white/40">
                <img
                  src="/LOGO TOKOLU.png"
                  alt="Logo"
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-wide">
              TokoLU
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Belanja cepat, aman, tanpa ribet.
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-50">
          {/* blur dekor */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-200/40 rounded-full blur-2xl" />

          <div className="relative w-full max-w-md">
            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
              {/* TITLE */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-blue-900">
                  Selamat Datang 👋
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Masuk untuk melanjutkan petualangan belanjamu.
                </p>
              </div>

              {/* STATUS */}
              {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                  {status}
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={submit}>
                {/* EMAIL */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                  <InputError message={errors.email} />
                </div>

             {/* PASSWORD */}
<div className="grid gap-2">
  <Label htmlFor="password">Password</Label>

  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      required
      value={data.password}
      onChange={(e) => setData("password", e.target.value)}
      placeholder="••••••••"
      className="pr-10"
    />

    {/* TOGGLE */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  <InputError message={errors.password} />
</div>


                {/* REMEMBER */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={data.remember}
                    onClick={() => setData("remember", !data.remember)}
                    tabIndex={3}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-900 hover:opacity-90"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>

              {/* REGISTER */}
              <div className="text-muted-foreground text-center text-sm mt-6">
                Belum punya akun?{" "}
                <TextLink href={route("register")} tabIndex={5}>
                  Daftar
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= METEOR STYLE ================= */}
      <style>{`
        .meteor{
          position:absolute;
          top:-10%;
          left:10%;
          width:2px;
          height:120px;
          background:linear-gradient(white,transparent);
          transform:rotate(25deg);
          animation:fall 4s linear infinite;
          opacity:.7;
        }
        .meteor.delay-2{ left:40%; animation-delay:1.5s; }
        .meteor.delay-4{ left:70%; animation-delay:3s; }

        @keyframes fall{
          from{ transform:translateY(-200px) rotate(25deg); }
          to{ transform:translateY(900px) rotate(25deg); }
        }
      `}</style>
    </>
  );
}

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { AlertTriangleIcon, EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isButtonDisabled = !email || !password;

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = await createClient();

      const { data: logInData, error: logInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (logInError) throw logInError;

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", logInData.user?.id || "")
        .single();

      if (profileError || !profileData) throw profileError;

      setSuccessMessage("Login berhasil! Mengalihkan ke sistem...");

      setTimeout(() => {
        setEmail("");
        setPassword("");
        setErrorMessage(null);
        setSuccessMessage(null);
        router.push("/");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal Login. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form action={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev: boolean) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-hidden"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>
              {successMessage && (
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <InfoIcon className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <p className="leading-relaxed">{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-800 border border-rose-200">
                  <AlertTriangleIcon className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              )}
              <FieldGroup>
                <Field>
                  <Button
                    type="submit"
                    className="h-12"
                    onSubmit={handleLogin}
                    disabled={isButtonDisabled || loading}
                  >
                    {loading ? "Memproses..." : "Login"}
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="/signup">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

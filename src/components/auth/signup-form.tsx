import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { AlertTriangleIcon, EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disabledButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (
      fullname &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword
    )
      setDisableButton(false);
    else setDisableButton(true);
  }, [password, confirmPassword]);

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const defaultRole = "Peminjam";

    try {
      const supabase = createClient();

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: signUpData.user.id,
            nama_lengkap: fullname,
            email,
            role: defaultRole,
          },
        ]);

        if (profileError) throw profileError;
      }

      setSuccessMessage("Registrasi berhasil! Mengalihkan ke sistem...");

      setTimeout(() => {
        setFullname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage(null);
        setSuccessMessage(null);
        router.push("/");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Gagal membuat akun baru. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                disabled={loading}
              />
            </Field>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev: boolean) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-hidden"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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
                  onSubmit={handleSignup}
                  disabled={disabledButton || loading}
                >
                  {loading ? "Memproses..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

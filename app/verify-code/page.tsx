import VerifyCodeClient from "./VerifyCodeClient";

export const metadata = {
  title: "Verifikasi Email",
  description: "Masuk ke akun Lisan untuk mengelola data dan aktivitas Anda.",
};

export default function SignInPage() {
  return <VerifyCodeClient />;
}
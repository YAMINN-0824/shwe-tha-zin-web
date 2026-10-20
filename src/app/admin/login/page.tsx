import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStaff } from "@/lib/auth/staff";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "ログイン | SHWE THA ZIN 管理画面",
};

export default function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>SHWE THA ZIN 管理画面</CardTitle>
          <CardDescription>お店の人のアカウントでログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          {/* cookie と URL を読むところだけ、あとから表示する */}
          <Suspense fallback={<p className="text-sm text-muted-foreground">読み込み中…</p>}>
            <LoginGate searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function LoginGate({
  searchParams,
}: Pick<PageProps<"/admin/login">, "searchParams">) {
  // すでに staff としてログインしているなら、管理画面へ
  if (await getStaff()) {
    redirect("/admin");
  }
  const { error } = await searchParams;
  return <LoginForm notStaff={error === "not_staff"} />;
}

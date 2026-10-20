import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/staff";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "SHWE THA ZIN 管理画面",
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">管理画面</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中…</p>}>
        <AdminHome />
      </Suspense>
    </main>
  );
}

async function AdminHome() {
  // staff でなければ、ここでログイン画面へ送られる
  const staff = await requireStaff();

  return (
    <div className="flex items-center justify-between gap-4">
      <p>
        ようこそ、<span className="font-medium">{staff.name}</span> さん
      </p>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          ログアウト
        </Button>
      </form>
    </div>
  );
}

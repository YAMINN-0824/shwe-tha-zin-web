"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignInState = { error: null, email: "" };

export function LoginForm({ notStaff }: { notStaff: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const error =
    state.error ?? (notStaff ? "このアカウントは管理画面に入れません" : null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "ログイン中…" : "ログイン"}
      </Button>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateReservationStatus } from "./actions";
import type { ReservationStatus } from "./status";

// お母さんがスマホでも押しやすいように、大きいボタン
const bigButton = "h-12 px-5 text-body";

export function ReservationButtons({
  id,
  status,
  canRestore,
  summary,
}: {
  id: string;
  status: ReservationStatus;
  // キャンセルした予約を確認待ちに戻せるか（これからの予約だけ）
  canRestore: boolean;
  // 確認の文に出す「10月28日（水）18:00 山田 様 4名」
  summary: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  function change(nextStatus: ReservationStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateReservationStatus(id, nextStatus);
      setError(result.error);
    });
  }

  const showConfirm = status === "pending";
  const showCancel = status === "pending" || status === "confirmed";
  const showRestore = status === "cancelled" && canRestore;
  if (!showConfirm && !showCancel && !showRestore) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {showConfirm && (
          <Button className={bigButton} disabled={pending} onClick={() => change("confirmed")}>
            確定する
          </Button>
        )}

        {showCancel && (
          <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogTrigger
              render={<Button variant="destructive" className={bigButton} disabled={pending} />}
            >
              キャンセルする
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-h3">
                  この予約をキャンセルしますか？
                </AlertDialogTitle>
                <AlertDialogDescription className="text-body text-forest-soft">
                  {summary}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={bigButton}>やめる</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  className={bigButton}
                  onClick={() => {
                    setCancelOpen(false);
                    change("cancelled");
                  }}
                >
                  キャンセルする
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showRestore && (
          <Button
            variant="outline"
            className={bigButton}
            disabled={pending}
            onClick={() => change("pending")}
          >
            確認待ちに戻す
          </Button>
        )}
      </div>

      {pending && (
        <p role="status" className="text-small text-forest-soft">
          変えています…
        </p>
      )}
      {error && (
        <p role="alert" className="text-small text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

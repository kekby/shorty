"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { clearUserId, getUserId, subscribeToAuthChanges } from "@/lib/auth";

function getServerSnapshot() {
  return null;
}

export function NavBar() {
  const router = useRouter();
  const userId = useSyncExternalStore(subscribeToAuthChanges, getUserId, getServerSnapshot);

  function handleLogout() {
    clearUserId();
    router.push("/login");
  }

  return (
    <nav className="mx-auto flex w-full max-w-3xl items-center gap-6 px-6 py-4">
      <Link href="/" className="font-semibold">
        URL Shortener
      </Link>
      {userId ? (
        <>
          <Link href="/dashboard">Дашборд</Link>
          <button
            onClick={handleLogout}
            className="ml-auto text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Выйти
          </button>
        </>
      ) : (
        <Link href="/login" className="ml-auto">
          Войти
        </Link>
      )}
    </nav>
  );
}

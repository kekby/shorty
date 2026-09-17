"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLinks, shortLinkUrl } from "@/lib/api";
import type { LinkWithClicks } from "@/lib/model";
import { clearUserId, getUserId } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkWithClicks[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getUserId()) {
      router.replace("/login");
      return;
    }

    getLinks()
      .then(setLinks)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, [router]);

  function handleLogout() {
    clearUserId();
    router.push("/login");
  }

  if (error) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!links) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
        <p>Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Мои ссылки</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-zinc-300 px-4 py-1.5 text-sm dark:border-zinc-700"
        >
          Выйти
        </button>
      </div>

      {links.length === 0 && <p className="text-zinc-500">Пока нет ссылок.</p>}

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li
            key={link.code}
            className="flex flex-col gap-1 rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <a
              href={shortLinkUrl(link.code)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400"
            >
              {shortLinkUrl(link.code)}
            </a>
            <span className="truncate text-sm text-zinc-500">{link.original_url}</span>
            <span className="text-sm text-zinc-500">Клики: {link.clicks}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

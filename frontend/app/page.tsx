"use client";

import { useState, type FormEvent } from "react";
import { createLink, shortLinkUrl } from "@/lib/api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const link = await createLink(url);
      setResult(shortLinkUrl(link.code));
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">Сократи ссылку</h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="url"
          required
          placeholder="https://example.com/very/long/path"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-5 py-2 text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "Сокращаю..." : "Сократить"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <a
            href={result}
            target="_blank"
            rel="noreferrer"
            className="break-all font-medium text-blue-600 dark:text-blue-400"
          >
            {result}
          </a>
        </div>
      )}
    </main>
  );
}

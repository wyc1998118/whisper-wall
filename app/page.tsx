"use client";

import { useEffect, useState } from "react";

type Message = {
  id: number;
  content: string;
  created_at: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function loadMessages() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      setInput("");
      await loadMessages();
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">一句话留言墙</h1>
      <p className="text-zinc-500 mb-8">留下一句话，别人也能看到。</p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="说点什么……"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 outline-none focus:border-black"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-black text-white px-5 py-2.5 font-medium disabled:opacity-50"
        >
          {sending ? "提交中…" : "提交"}
        </button>
      </form>

      <ul className="space-y-3">
        {messages.length === 0 && (
          <li className="text-zinc-400">还没有留言，来抢第一条。</li>
        )}
        {messages.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-zinc-200 px-4 py-3 bg-white"
          >
            <p className="text-zinc-900">{m.content}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {new Date(m.created_at).toLocaleString("zh-CN")}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

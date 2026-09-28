import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'

export default function Chat() {
  const { messages, chatBusy, ask } = useStore()
  const [q, setQ] = useState('')
  const end = useRef()
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, chatBusy])

  const send = () => {
    const v = q.trim()
    if (!v || chatBusy) return
    setQ('')
    ask(v)
  }

  return (
    <section className="flex h-[32rem] flex-col rounded-2xl border border-slate-200 bg-white lg:sticky lg:top-6">
      <h2 className="border-b border-slate-200 px-6 py-4 text-lg font-semibold">Ask about this meeting</h2>
      <div className="flex-1 space-y-3 overflow-auto px-6 py-4">
        {!messages.length && <p className="text-sm text-slate-500">Ask anything the meeting covered, for example who owns a task or why a decision was made.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'ml-auto bg-signal text-white' : m.err ? 'bg-red-50 text-red-800' : 'bg-slate-100'}`}>{m.text}</div>
        ))}
        {chatBusy && <div className="w-fit rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500">Thinking…</div>}
        <div ref={end} />
      </div>
      <div className="flex gap-2 border-t border-slate-200 p-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a question" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-signal" />
        <button onClick={send} disabled={chatBusy || !q.trim()} className="rounded-xl bg-signal px-5 font-semibold text-white disabled:opacity-50">Send</button>
      </div>
    </section>
  )
}

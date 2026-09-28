import { useState } from 'react'
import { useStore } from '../store'
import Chat from './Chat'

const list = (x) => (Array.isArray(x) ? x : x ? [x] : [])
const txt = (i) => (typeof i === 'string' ? i : Object.values(i || {}).filter(Boolean).join(' - '))

function Card({ title, items, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-signal">{items.map((i, n) => <li key={n}>{txt(i)}</li>)}</ul>
      ) : <p className="mt-3 text-sm text-slate-500">Nothing was found for this section.</p>}
    </section>
  )
}

export default function Result() {
  const { result: r, reset } = useStore()
  const [open, setOpen] = useState(false)
  const transcript = typeof r.transcript === 'string' ? r.transcript : JSON.stringify(r.transcript, null, 2)

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{r.title || 'Untitled meeting'}</h1>
        <button onClick={reset} className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">New meeting</button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed">{txt(r.summary)}</p>
          </section>
          <Card title="Action items" items={list(r.action_items)} />
          <Card title="Key decisions" items={list(r.key_decisions)} />
          <Card title="Open questions" items={list(r.open_questions)} />
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-left text-lg font-semibold">
              Transcript <span className="text-slate-400">{open ? 'Hide' : 'Show'}</span>
            </button>
            {open && <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">{transcript}</pre>}
          </section>
        </div>
        <div className="lg:col-span-2"><Chat /></div>
      </div>
    </div>
  )
}

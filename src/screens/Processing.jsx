import { useEffect, useState } from 'react'
import { useStore } from '../store'

const STEPS = [['queued', 'Queued'], ['processing', 'Transcribing and analysing'], ['completed', 'Done']]

export default function Processing() {
  const { phase, status, error, retrying, startedAt, reset } = useStore()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  if (phase === 'failed') {
    const bot = /sign in|not a bot|cookies|youtube/i.test(error || '')
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-red-800">This meeting could not be processed</h2>
        <p className="mt-3 break-words rounded-lg bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>
        {bot && <p className="mt-3 text-sm text-slate-600">YouTube often blocks downloads from cloud servers. Download the video yourself and upload the file instead.</p>}
        <button onClick={reset} className="mt-6 rounded-xl bg-ink px-5 py-2.5 font-semibold text-white">Start over</button>
      </div>
    )
  }

  const idx = Math.max(0, STEPS.findIndex(([k]) => k === status))
  const s = Math.floor((now - startedAt) / 1000)
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-xl font-semibold">Working on your meeting</h2>
      <p className="mt-1 text-sm text-slate-500">Elapsed {Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}. Long recordings can take several minutes. Keep this tab open.</p>
      <ol className="mt-6 space-y-4">
        {STEPS.map(([k, label], i) => (
          <li key={k} className="flex items-center gap-3">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-semibold ${i < idx ? 'bg-signal text-white' : i === idx ? 'border-2 border-signal text-signal' : 'bg-slate-100 text-slate-400'}`}>
              {i < idx ? '✓' : i + 1}
            </span>
            <span className={i === idx ? 'font-semibold' : 'text-slate-500'}>{label}</span>
            {i === idx && <span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-signal border-t-transparent" />}
          </li>
        ))}
      </ol>
      {retrying && <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">Lost contact with the server. Retrying…</p>}
    </div>
  )
}

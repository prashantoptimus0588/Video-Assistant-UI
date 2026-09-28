import { useRef, useState } from 'react'
import { useStore } from '../store'
import * as api from '../api'
import { LANGS, EXTS, MAX_MB, checkFile, isYouTube } from '../constants'

export default function Input() {
  const { submit, busy, error } = useStore()
  const [tab, setTab] = useState('file')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [lang, setLang] = useState('english')
  const [err, setErr] = useState(null)
  const [drag, setDrag] = useState(false)
  const pick = useRef()

  const choose = (f) => {
    if (!f) return
    const e = checkFile(f)
    setErr(e)
    setFile(e ? null : f)
  }
  const go = () => {
    if (tab === 'file') return file ? submit(() => api.upload(file, lang)) : setErr('Choose a file first.')
    if (!isYouTube(url)) return setErr('Enter a valid YouTube link (youtube.com or youtu.be).')
    setErr(null)
    submit(() => api.createFromUrl(url.trim(), lang))
  }
  const tabCls = (t) => `rounded-lg px-4 py-2 text-sm font-medium ${tab === t ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'}`

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight">Turn a recording into notes.</h1>
      <p className="mt-3 text-slate-600">Upload a meeting or paste a YouTube link. You get a summary, action items, decisions, open questions, and a transcript you can ask questions about.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex gap-2">
          <button className={tabCls('file')} onClick={() => { setTab('file'); setErr(null) }}>Upload file</button>
          <button className={tabCls('url')} onClick={() => { setTab('url'); setErr(null) }}>YouTube link</button>
        </div>

        {tab === 'file' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); choose(e.dataTransfer.files[0]) }}
            onClick={() => pick.current.click()}
            className={`mt-5 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${drag ? 'border-signal bg-teal-50' : 'border-slate-300 hover:border-slate-400'}`}
          >
            <input ref={pick} type="file" hidden accept={EXTS.map((e) => '.' + e).join(',')} onChange={(e) => choose(e.target.files[0])} />
            {file ? (
              <>
                <p className="font-semibold">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">{(file.size / 1048576).toFixed(1)} MB. Click to choose a different file.</p>
              </>
            ) : (
              <>
                <p className="font-semibold">Drop a file here, or click to browse</p>
                <p className="mt-1 text-sm text-slate-500">{EXTS.join(', ')}. Up to {MAX_MB} MB.</p>
              </>
            )}
          </div>
        ) : (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-signal focus:ring-2 focus:ring-teal-100"
          />
        )}

        <label className="mt-5 block text-sm font-medium">Language of the recording</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 capitalize">
          {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {(err || error) && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{err || error}</p>}

        <button onClick={go} disabled={busy} className="mt-6 w-full rounded-xl bg-signal py-3 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-60">
          {busy ? 'Sending. This can take a moment if the server is waking up.' : 'Start analysis'}
        </button>
      </div>
    </div>
  )
}

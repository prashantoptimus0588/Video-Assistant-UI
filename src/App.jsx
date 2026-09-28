import { useEffect } from 'react'
import { useStore } from './store'
import Input from './screens/Input'
import Processing from './screens/Processing'
import Result from './screens/Result'

export default function App() {
  const { phase, server, wake, resume } = useStore()
  useEffect(() => { wake(); resume() }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal font-bold text-white">M</span>
          <span className="text-lg font-semibold">AI Meeting Assistant</span>
        </div>
      </header>

      {(server === 'slow' || server === 'down') && (
        <div className={`px-5 py-2 text-center text-sm ${server === 'down' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-900'}`}>
          {server === 'down'
            ? 'The server is not responding. Check that the backend is running and that VITE_API_URL is correct.'
            : 'Waking up the server. On free hosting this can take up to a minute.'}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 py-10">
        {phase === 'input' && <Input />}
        {(phase === 'processing' || phase === 'failed') && <Processing />}
        {phase === 'result' && <Result />}
      </main>
    </div>
  )
}

import { create } from 'zustand'
import * as api from './api'

const KEY = 'ama_meeting_id'
let timer = null
let run = 0
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const blank = { phase: 'input', meetingId: null, status: null, result: null, error: null, messages: [], retrying: false, startedAt: null }

export const useStore = create((set, get) => ({
  ...blank,
  server: 'checking', // checking | slow | up | down
  busy: false,
  chatBusy: false,

  // Ping /health on load: wakes a sleeping Render instance and drives the banner.
  async wake() {
    setTimeout(() => get().server === 'checking' && set({ server: 'slow' }), 2000)
    for (let i = 0; i < 40; i++) {
      try { await api.health(); set({ server: 'up' }); return } catch { await sleep(3000) }
    }
    set({ server: 'down' })
  },

  async submit(fn) {
    set({ busy: true, error: null })
    try {
      const r = await fn()
      localStorage.setItem(KEY, r.meeting_id)
      set({ ...blank, phase: 'processing', meetingId: r.meeting_id, status: r.status, startedAt: Date.now(), busy: false })
      get().poll()
    } catch (e) { set({ busy: false, error: e.message }) }
  },

  resume() {
    const id = localStorage.getItem(KEY)
    if (id) { set({ ...blank, phase: 'processing', meetingId: id, startedAt: Date.now() }); get().poll() }
  },

  poll() {
    clearTimeout(timer)
    const my = ++run
    let fails = 0
    const fail = (msg) => { localStorage.removeItem(KEY); set({ phase: 'failed', error: msg, retrying: false }) }
    const tick = async () => {
      try {
        const d = await api.getStatus(get().meetingId)
        if (my !== run) return
        fails = 0
        set({ status: d.status, retrying: false })
        if (d.status === 'completed') return set({ phase: 'result', result: d.result })
        if (d.status === 'failed') return fail(d.error || 'Processing failed.')
      } catch (e) {
        if (my !== run) return
        if (e.status === 404) return fail('This meeting was not found. The server probably restarted and lost it. Submit it again.')
        if (++fails >= 10) return fail(e.message)
        set({ retrying: true })
      }
      timer = setTimeout(tick, 3000)
    }
    tick()
  },

  reset() { run++; clearTimeout(timer); localStorage.removeItem(KEY); set({ ...blank }) },

  async ask(q) {
    const add = (m) => set((s) => ({ messages: [...s.messages, m] }))
    add({ role: 'user', text: q })
    set({ chatBusy: true })
    try { add({ role: 'ai', text: (await api.ask(get().meetingId, q)).answer }) }
    catch (e) { add({ role: 'ai', text: e.message, err: true }) }
    set({ chatBusy: false })
  },
}))

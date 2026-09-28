const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function req(path, opts) {
  let res
  try { res = await fetch(BASE + path, opts) }
  catch { throw new ApiError('Cannot reach the server. It may be starting up, or VITE_API_URL is wrong.', 0) }
  let data = null
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) {
    const d = data?.detail
    throw new ApiError(typeof d === 'string' ? d : d ? JSON.stringify(d) : `Request failed (${res.status})`, res.status)
  }
  return data
}

const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const health = () => req('/health')
export const createFromUrl = (source, language) => req('/meetings', json({ source, language }))
export const upload = (file, language) => {
  const f = new FormData()
  f.append('file', file)
  f.append('language', language)
  return req('/meetings/upload', { method: 'POST', body: f })
}
export const getStatus = (id) => req(`/meetings/${id}/status`)
export const ask = (id, question) => req(`/meetings/${id}/chat`, json({ question }))

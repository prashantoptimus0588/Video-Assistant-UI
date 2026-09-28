// Edit LANGS to match the languages your backend supports.
export const LANGS = ['english', 'hindi', 'spanish', 'french', 'german', 'portuguese', 'italian', 'japanese']
export const EXTS = ['mp4', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'm4a']
export const MAX_MB = 50

export const checkFile = (f) => {
  const ext = f.name.split('.').pop().toLowerCase()
  if (!EXTS.includes(ext)) return `.${ext} files are not supported. Use ${EXTS.join(', ')}.`
  if (f.size > MAX_MB * 1024 * 1024) return `This file is ${(f.size / 1048576).toFixed(1)} MB. The limit is ${MAX_MB} MB.`
  return null
}
export const isYouTube = (u) => /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(u.trim())

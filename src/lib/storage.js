const QUOTES_KEY = 'quickquote.v2.quotes'
const COUNTER_KEY = 'quickquote.v2.counter'
const BUSINESS_KEY = 'quickquote.v2.businessName'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable; nothing else we can do without a backend.
  }
}

export const loadQuotes = () => read(QUOTES_KEY, [])
export const saveQuotes = (quotes) => write(QUOTES_KEY, quotes)

export const loadCounter = () => read(COUNTER_KEY, 0)
export const saveCounter = (n) => write(COUNTER_KEY, n)

export const loadBusinessName = () => read(BUSINESS_KEY, '')
export const saveBusinessName = (name) => write(BUSINESS_KEY, name)

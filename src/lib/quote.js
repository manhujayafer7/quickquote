export const CURRENCY = 'AED'
export const VAT_RATE = 0.05

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

// Local calendar date (toISOString would give the UTC date, which can be a day off in the UAE).
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const newItem = () => ({ id: uid(), description: '', quantity: '1', unitPrice: '' })

export function newQuote({ number, businessName = '' }) {
  return {
    id: uid(),
    number,
    date: todayISO(),
    businessName,
    clientName: '',
    clientEmail: '',
    items: [newItem()],
    updatedAt: Date.now(),
  }
}

// Quote numbers look like QQ-2026-0007. The sequence is global and never reused,
// so `counter` (the highest number ever issued) is tracked separately from saved quotes.
export const quoteSequence = (number) => parseInt(String(number).match(/(\d+)$/)?.[1] ?? '0', 10)

export function nextQuoteNumber(quotes, counter = 0) {
  const highest = quotes.reduce((max, q) => Math.max(max, quoteSequence(q.number)), counter)
  return `QQ-${new Date().getFullYear()}-${String(highest + 1).padStart(4, '0')}`
}

export const toNumber = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

export const lineTotal = (item) => round2(toNumber(item.quantity) * toNumber(item.unitPrice))

export function calcTotals(items) {
  const subtotal = round2(items.reduce((sum, i) => sum + lineTotal(i), 0))
  const vat = round2(subtotal * VAT_RATE)
  return { subtotal, vat, total: round2(subtotal + vat) }
}

const aed = new Intl.NumberFormat('en-AE', { style: 'currency', currency: CURRENCY })
export const formatAED = (amount) => aed.format(amount)

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

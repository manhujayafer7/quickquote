import { useEffect, useMemo, useState } from 'react'
import QuoteEditor from '../components/QuoteEditor.jsx'
import QuotePreview from '../components/QuotePreview.jsx'
import { newQuote, nextQuoteNumber, quoteSequence } from '../lib/quote.js'
import { validateQuote } from '../lib/validation.js'
import {
  loadBusinessName,
  loadCounter,
  loadQuotes,
  saveBusinessName,
  saveCounter,
  saveQuotes,
} from '../lib/storage.js'

function initialQuotes() {
  const stored = loadQuotes()
  if (stored.length) return stored
  return [newQuote({ number: nextQuoteNumber([], loadCounter()), businessName: loadBusinessName() })]
}

export default function QuoteBuilder() {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [activeId, setActiveId] = useState(() => quotes[0]?.id)
  // Errors stay hidden until a field is blurred or the user tries to download.
  const [touched, setTouched] = useState(() => new Set())
  const [submitted, setSubmitted] = useState(false)

  const active = quotes.find((q) => q.id === activeId) ?? quotes[0]
  const errors = useMemo(() => validateQuote(active), [active])

  useEffect(() => {
    saveQuotes(quotes)
    const highest = quotes.reduce((max, q) => Math.max(max, quoteSequence(q.number)), 0)
    if (highest > loadCounter()) saveCounter(highest)
  }, [quotes])

  const resetValidation = () => {
    setTouched(new Set())
    setSubmitted(false)
  }

  const updateQuote = (next) => {
    setQuotes((qs) => qs.map((q) => (q.id === next.id ? { ...next, updatedAt: Date.now() } : q)))
    // Remember the business name so new quotes are pre-filled.
    if (next.businessName !== active.businessName) saveBusinessName(next.businessName.trim())
  }

  const markTouched = (key) =>
    setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))

  const createQuote = () => {
    const q = newQuote({
      number: nextQuoteNumber(quotes, loadCounter()),
      businessName: loadBusinessName() || active.businessName,
    })
    setQuotes((qs) => [q, ...qs])
    setActiveId(q.id)
    resetValidation()
  }

  const selectQuote = (id) => {
    setActiveId(id)
    resetValidation()
  }

  const deleteQuote = () => {
    if (!window.confirm(`Delete quote ${active.number}? This can't be undone.`)) return
    const remaining = quotes.filter((q) => q.id !== active.id)
    const next = remaining.length
      ? remaining
      : [newQuote({ number: nextQuoteNumber(quotes, loadCounter()), businessName: active.businessName })]
    setQuotes(next)
    setActiveId(next[0].id)
    resetValidation()
  }

  const downloadPdf = () => {
    setSubmitted(true)
    if (errors.count > 0) {
      // Wait for the error styles to render, then take the user to the first problem.
      requestAnimationFrame(() => {
        const first = document.querySelector('[aria-invalid="true"]')
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        first?.focus({ preventScroll: true })
      })
      return
    }
    // The document title becomes the suggested PDF file name.
    const previousTitle = document.title
    document.title = `Quote ${active.number}${active.clientName ? ` - ${active.clientName.trim()}` : ''}`
    window.addEventListener('afterprint', () => (document.title = previousTitle), { once: true })
    window.print()
  }

  const shown = (key) => submitted || touched.has(key)
  const label = (q) => `${q.number} · ${q.clientName.trim() || 'Untitled'}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8 print:max-w-none print:p-0">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quote builder</h1>
          <p className="text-sm text-slate-500">Saved automatically in this browser.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="quote-picker" className="sr-only">
            Saved quotes
          </label>
          <select
            id="quote-picker"
            value={active.id}
            onChange={(e) => selectQuote(e.target.value)}
            className="max-w-[16rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {[...quotes]
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((q) => (
                <option key={q.id} value={q.id}>
                  {label(q)}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={createQuote}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            New quote
          </button>
          <button
            type="button"
            onClick={deleteQuote}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 shadow-sm transition hover:bg-rose-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {submitted && errors.count > 0 && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 print:hidden">
          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5m0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clipRule="evenodd" />
          </svg>
          <p>
            <span className="font-semibold">Almost there!</span> Please fix{' '}
            {errors.count === 1 ? 'the highlighted field' : `the ${errors.count} highlighted fields`} before downloading your PDF.
          </p>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-2 print:block">
        <div className="print:hidden">
          <QuoteEditor quote={active} onChange={updateQuote} errors={errors} shown={shown} onBlur={markTouched} />
        </div>

        <div className="lg:sticky lg:top-24 print:static">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 print:hidden">Live preview</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
            <QuotePreview quote={active} />
          </div>
        </div>
      </div>
    </div>
  )
}

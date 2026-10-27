import { VAT_RATE, calcTotals, formatAED, lineTotal, newItem } from '../lib/quote.js'

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500'
const inputOk = 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
const inputBad = 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/20'
const inputClass = (error) => `${inputBase} ${error ? inputBad : inputOk}`

function ErrorText({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1 flex items-start gap-1 text-xs text-rose-600">
      <svg viewBox="0 0 20 20" className="mt-px h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0m-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5m0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clipRule="evenodd" />
      </svg>
      {children}
    </p>
  )
}

function Field({ id, label, required, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function Card({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * `errors` comes from validateQuote; `shown(key)` decides whether an error is visible yet
 * (after the field is blurred, or after the user tries to download).
 */
export default function QuoteEditor({ quote, onChange, errors, shown, onBlur }) {
  const set = (patch) => onChange({ ...quote, ...patch })
  const setItem = (id, patch) => set({ items: quote.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })
  const removeItem = (id) => set({ items: quote.items.filter((i) => i.id !== id) })
  const addItem = () => set({ items: [...quote.items, newItem()] })

  const fieldError = (name) => (shown(name) ? errors.fields[name] : undefined)
  const itemError = (id, name) => (shown(`item:${id}:${name}`) ? errors.items[id]?.[name] : undefined)

  const textInput = (name, props = {}) => {
    const error = fieldError(name)
    return (
      <input
        id={name}
        className={inputClass(error)}
        value={quote[name]}
        onChange={(e) => set({ [name]: e.target.value })}
        onBlur={() => onBlur(name)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
    )
  }

  const { subtotal, vat, total } = calcTotals(quote.items)

  return (
    <div className="space-y-5">
      <Card title="Quote details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field id="businessName" label="Business name" required error={fieldError('businessName')}>
              {textInput('businessName', { placeholder: 'e.g. Al Noor Design Studio', autoComplete: 'organization' })}
            </Field>
          </div>
          <Field id="clientName" label="Client name" required error={fieldError('clientName')}>
            {textInput('clientName', { placeholder: 'e.g. Fatima Al Mansoori' })}
          </Field>
          <Field id="clientEmail" label="Client email" required error={fieldError('clientEmail')}>
            {textInput('clientEmail', { type: 'email', placeholder: 'name@company.ae', inputMode: 'email' })}
          </Field>
          <Field id="date" label="Quote date" required error={fieldError('date')}>
            {textInput('date', { type: 'date' })}
          </Field>
          <Field id="number" label="Quote number" hint="Generated automatically">
            <input id="number" className={inputClass()} value={quote.number} disabled />
          </Field>
        </div>
      </Card>

      <Card
        title="Line items"
        action={
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            <span className="text-base leading-none">+</span> Add row
          </button>
        }
      >
        <div className="hidden grid-cols-[1fr_4.5rem_7rem_6.5rem_2rem] gap-2 px-1 pb-2 text-xs font-medium text-slate-500 sm:grid">
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Unit price (AED)</span>
          <span className="text-right">Amount</span>
          <span />
        </div>

        <div className="space-y-3 sm:space-y-2">
          {quote.items.map((item, index) => {
            const err = {
              description: itemError(item.id, 'description'),
              quantity: itemError(item.id, 'quantity'),
              unitPrice: itemError(item.id, 'unitPrice'),
            }
            const cell = (name, props) => (
              <div>
                <input
                  id={`item-${item.id}-${name}`}
                  className={inputClass(err[name])}
                  value={item[name]}
                  onChange={(e) => setItem(item.id, { [name]: e.target.value })}
                  onBlur={() => onBlur(`item:${item.id}:${name}`)}
                  aria-invalid={err[name] ? 'true' : undefined}
                  aria-describedby={err[name] ? `item-${item.id}-${name}-error` : undefined}
                  {...props}
                />
                <ErrorText id={`item-${item.id}-${name}-error`}>{err[name]}</ErrorText>
              </div>
            )

            return (
              <div
                key={item.id}
                className="grid grid-cols-2 items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-[1fr_4.5rem_7rem_6.5rem_2rem] sm:border-0 sm:bg-transparent sm:p-1"
              >
                <div className="col-span-2 sm:col-span-1">
                  {cell('description', { placeholder: 'Item or service', 'aria-label': `Item ${index + 1} description` })}
                </div>
                {cell('quantity', {
                  type: 'number',
                  min: '0',
                  step: 'any',
                  inputMode: 'decimal',
                  className: `${inputClass(err.quantity)} text-right`,
                  'aria-label': `Item ${index + 1} quantity`,
                })}
                {cell('unitPrice', {
                  type: 'number',
                  min: '0',
                  step: '0.01',
                  inputMode: 'decimal',
                  placeholder: '0.00',
                  className: `${inputClass(err.unitPrice)} text-right`,
                  'aria-label': `Item ${index + 1} unit price in AED`,
                })}
                <span className="col-span-1 self-center text-right text-sm font-medium tabular-nums text-slate-900 sm:pt-0">
                  {formatAED(lineTotal(item))}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={quote.items.length === 1}
                  aria-label={`Remove item ${index + 1}`}
                  title={quote.items.length === 1 ? 'A quote needs at least one item' : 'Remove row'}
                  className="justify-self-end rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94z" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        <dl className="ml-auto mt-5 max-w-xs space-y-2 border-t border-slate-100 pt-4 text-sm tabular-nums">
          <div className="flex justify-between text-slate-600">
            <dt>Subtotal</dt>
            <dd>{formatAED(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-600">
            <dt>VAT ({VAT_RATE * 100}%)</dt>
            <dd>{formatAED(vat)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
            <dt>Grand total</dt>
            <dd>{formatAED(total)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}

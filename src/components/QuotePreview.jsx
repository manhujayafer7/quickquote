import { VAT_RATE, calcTotals, formatAED, formatDate, lineTotal, toNumber } from '../lib/quote.js'

const Placeholder = ({ children }) => <span className="text-slate-300">{children}</span>

export default function QuotePreview({ quote }) {
  const { subtotal, vat, total } = calcTotals(quote.items)

  return (
    <article className="bg-white p-8 text-sm text-slate-700 sm:p-10 print:p-0">
      <header className="flex items-start justify-between gap-6 border-b-2 border-indigo-600 pb-6">
        <div className="min-w-0">
          <h2 className="break-words text-2xl font-bold text-slate-900">
            {quote.businessName || <Placeholder>Your business name</Placeholder>}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-light uppercase tracking-[0.2em] text-indigo-600">Quote</p>
          <p className="mt-1 font-semibold text-slate-900">{quote.number}</p>
          <p className="text-slate-500">{formatDate(quote.date) || <Placeholder>Date</Placeholder>}</p>
        </div>
      </header>

      <section className="py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prepared for</p>
        <p className="mt-1.5 text-base font-semibold text-slate-900">
          {quote.clientName || <Placeholder>Client name</Placeholder>}
        </p>
        <p className="break-all text-slate-500">{quote.clientEmail || <Placeholder>client@email.com</Placeholder>}</p>
      </section>

      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="w-1/2 px-3 py-2.5 font-semibold">Description</th>
            <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
            <th className="px-3 py-2.5 text-right font-semibold">Unit price</th>
            <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {quote.items.map((item) => (
            <tr key={item.id} className="break-inside-avoid align-top">
              <td className="break-words px-3 py-3 text-slate-800">
                {item.description || <Placeholder>Item description</Placeholder>}
              </td>
              <td className="px-3 py-3 text-right tabular-nums">{toNumber(item.quantity)}</td>
              <td className="px-3 py-3 text-right tabular-nums">{formatAED(toNumber(item.unitPrice))}</td>
              <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-900">{formatAED(lineTotal(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end break-inside-avoid border-t border-slate-200 pt-4">
        <dl className="w-full max-w-xs space-y-2 tabular-nums">
          <div className="flex justify-between text-slate-600">
            <dt>Subtotal</dt>
            <dd>{formatAED(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-600">
            <dt>VAT ({VAT_RATE * 100}%)</dt>
            <dd>{formatAED(vat)}</dd>
          </div>
          <div className="flex justify-between rounded-lg bg-indigo-600 px-3 py-2.5 text-base font-bold text-white">
            <dt>Grand total</dt>
            <dd>{formatAED(total)}</dd>
          </div>
        </dl>
      </div>

      <footer className="mt-10 border-t border-slate-100 pt-4 text-xs text-slate-400">
        All amounts are in UAE Dirhams (AED). VAT is charged at {VAT_RATE * 100}%.
      </footer>
    </article>
  )
}

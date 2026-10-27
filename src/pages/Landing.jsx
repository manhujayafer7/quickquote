import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Build quotes in minutes',
    body: 'Add line items, quantities and unit prices. Subtotal, 5% UAE VAT and the grand total in AED are calculated as you type.',
    icon: (
      <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
    ),
  },
  {
    title: 'Look professional',
    body: 'Every quote gets a clean, branded layout that you can print or save as a PDF straight from your browser.',
    icon: (
      <>
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v8H6z" />
      </>
    ),
  },
  {
    title: 'Private by design',
    body: 'No account, no server. Your quotes are saved in your own browser, so your client data never leaves your device.',
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
]

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
          <div className="h-[32rem] w-[64rem] rounded-full bg-gradient-to-tr from-indigo-200 via-sky-100 to-violet-200 opacity-60 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Free for freelancers & small teams
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Professional quotes,
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                ready in minutes.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              QuickQuote helps freelancers and small businesses put together clear, accurate quotes
              for their clients, with automatic VAT and totals in AED. Then download it as a PDF.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                Create a Quote
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64l-3.97-3.97a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l3.97-3.97H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="#features"
                className="rounded-xl px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Quote</p>
                  <p className="mt-1 text-lg font-semibold">#Q-1042</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Sent</span>
              </div>
              <div className="mt-6 divide-y divide-slate-100 text-sm">
                {[
                  ['Website redesign', '1 × AED 2,400.00', 'AED 2,400.00'],
                  ['Copywriting (pages)', '5 × AED 120.00', 'AED 600.00'],
                  ['Hosting setup', '1 × AED 150.00', 'AED 150.00'],
                  ['VAT (5%)', '', 'AED 157.50'],
                ].map(([d, q, t]) => (
                  <div key={d} className="flex items-center justify-between py-3">
                    <span className="font-medium text-slate-700">{d}</span>
                    <span className="hidden text-slate-400 sm:inline">{q}</span>
                    <span className="font-medium tabular-nums">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Grand total</p>
                  <p className="text-2xl font-bold tabular-nums">AED 3,307.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to send a quote</h2>
            <p className="mt-4 text-slate-600">Nothing you don't. No sign-up and no learning curve.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-900/5"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-14 text-center text-white shadow-xl sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight">Your next quote is a minute away.</h2>
            <p className="mx-auto mt-3 max-w-xl text-indigo-100">Start building now. It's free and nothing to install.</p>
            <Link
              to="/app"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
            >
              Create a Quote
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} QuickQuote. All data stays in your browser.
      </footer>
    </>
  )
}

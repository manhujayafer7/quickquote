const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const isBlank = (v) => String(v ?? '').trim() === ''

/**
 * Returns { fields, items, count }:
 *  - fields: { businessName?, clientName?, clientEmail?, date? } -> message
 *  - items:  { [itemId]: { description?, quantity?, unitPrice? } }
 *  - count:  total number of problems
 */
export function validateQuote(quote) {
  const fields = {}

  if (isBlank(quote.businessName)) fields.businessName = 'Please enter your business name.'
  if (isBlank(quote.clientName)) fields.clientName = "Please enter your client's name."
  if (isBlank(quote.clientEmail)) {
    fields.clientEmail = "Please enter your client's email address."
  } else if (!EMAIL_RE.test(quote.clientEmail.trim())) {
    fields.clientEmail = "That email doesn't look quite right. Try something like name@company.ae."
  }
  if (isBlank(quote.date)) fields.date = 'Please choose a quote date.'

  const items = {}
  for (const item of quote.items) {
    const e = {}
    if (isBlank(item.description)) e.description = 'Describe this item or service.'

    const qty = Number(item.quantity)
    if (isBlank(item.quantity) || !Number.isFinite(qty)) e.quantity = 'Enter a quantity.'
    else if (qty <= 0) e.quantity = 'Must be more than 0.'

    const price = Number(item.unitPrice)
    if (isBlank(item.unitPrice) || !Number.isFinite(price)) e.unitPrice = 'Enter a price.'
    else if (price < 0) e.unitPrice = "Can't be negative."

    if (Object.keys(e).length) items[item.id] = e
  }

  const count =
    Object.keys(fields).length + Object.values(items).reduce((n, e) => n + Object.keys(e).length, 0)

  return { fields, items, count }
}

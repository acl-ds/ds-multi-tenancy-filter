
const { allowedCustomers } = require('./filter')

const { isActive } = require('./helpers')


async function getESDSL(userSession = {}, options) {

  const { customerField = 'tenant' } = options

  if (!await isActive(options))
    return [{ match_all: {} }]

  const allowed = await allowedCustomers(userSession, options)

  if (allowed.length > 0) {
    return [{ terms: { [customerField]: allowed } }]
  }
  return []
}

module.exports = {
  getESDSL,
}

const { allowedCustomers } = require('./filter')

const { isActive } = require('./helpers')

async function getFilterAsync(userSession = {}, options) {

  let clause = 'false'
  const { customerField = 'customer', fullWhere = false, array = false, operator = 'AND' } = options

  if (!await isActive(options)) {
    clause = 'true'
    return ` ${fullWhere ? 'WHERE' : operator} ${clause} `
  }

  const allowed = await allowedCustomers(userSession, options)

  if (allowed.length > 0) {
    if (array)
      clause = `${customerField} && ARRAY[${allowed.map(i => `'${i}'`).reduce((acc, cur) => `${acc},${cur}`)}::uuid]`
    else
      clause = `${customerField} IN (${allowed.map(i => `'${i}'`).reduce((acc, cur) => `${acc},${cur}`)})`
  }
  return ` ${fullWhere ? 'WHERE' : operator} ${clause} `
}


module.exports = { getFilterAsync }
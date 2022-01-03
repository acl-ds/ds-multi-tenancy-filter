
const { isActive } = require('./helpers')

async function managedCustomers(userId, customerId, dbClient, freshList = false) {
  if (!await isActive({ dbClient, freshList })) {
    return ['00000000-0000-0000-0000-000000000000']
  }
  const allowed = [customerId]
  if (customerId !== '00000000-0000-0000-0000-000000000000' || !dbClient)
    return allowed

  const managedCustomers = await dbClient.any('SELECT * FROM ds_customer_managers WHERE manager=${userId}', { userId })
  managedCustomers.forEach(customer => {
    allowed.push(customer.customer)
  });

  return allowed
}

async function managers(userSession, options) {
  const { customerId } = userSession
  const { dbClient } = options
  if (!dbClient || !customerId)
    return []
  const r = await dbClient.any('SELECT manager FROM ds_customer_managers WHERE customer=${customerId}', { customerId })
  return r.map(i => i.manager)
}

async function allowedCustomers(userSession, options) {

  const { customerId, id: userId } = userSession
  let { allowedCustomers = [] } = userSession
  const { dbClient, freshList = false } = options

  if (freshList) {
    allowedCustomers = []
    allowedCustomers.push(...await managedCustomers(userId, customerId, dbClient, freshList))
  }

  return allowedCustomers
}

async function getCustomerName(customerId, options, short_name) {
  const { dbClient } = options
  if (!dbClient || !customerId)
    return []

  const res = short_name ?
    await dbClient.one('SELECT short_name FROM ds_customers WHERE id=${customerId}', { customerId }) :
    await dbClient.one('SELECT name FROM ds_customers WHERE id=${customerId}', { customerId })

  return short_name ? res.short_name : res.name
}

module.exports = {
  allowedCustomers,
  managedCustomers,
  managers,
  getCustomerName
}

const filters = require('./src/filter')
const sql_filters = require('./src/sql_filter')
const es_filters  =  require('./src/es_filter')


module.exports = {
  sqlFilterAsync: sql_filters.getFilterAsync,
  esFilterDSLAsync : es_filters.getESDSL,
  allowedCustomersAsync :  filters.allowedCustomers,
  getManagersAsync : filters.managers,
  getCustomerNameAsync : filters.getCustomerName
}
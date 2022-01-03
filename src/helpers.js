
const APP_URL = process.env.APP_URL || "http://localhost:4000"
const bypassSecret = process.env.BYPASS_SECRET || 's3cret789'

const request = require('request-promise')

let featureObject = {
  status: false,
  count: 0,
}

async function fetchLicenseStatus() {
  try {
    const { status = false, data } = await request({
      uri: `${APP_URL}/api/license/validate_feature/multi_customer`,
      json: true,
      method: 'GET',
      headers: {
        Cookie: `on_special_token=${bypassSecret}`
      },
    })
    if(status)
      featureObject =  data
  }
  catch (ex) {
    console.log(ex)
  }
}

async function isActive(options) {
  const { freshList = false } = options

  if (freshList)
    await fetchLicenseStatus()

  return featureObject.status
}

module.exports = {
  isActive
}
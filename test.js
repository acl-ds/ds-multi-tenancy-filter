const { isActive } = require('./src/helpers')

isActive({freshList:true}).then(console.log).catch(console.log)
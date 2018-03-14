// figure out whether to use prod or dev keys

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys/prod.js')
} else {
  module.exports = require('./keys/dev.js')
}

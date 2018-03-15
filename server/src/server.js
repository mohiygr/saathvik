const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Keys = require('./keys')
const serveStatic = require('serve-static')

require('dotenv').config()
mongoose.Promise = global.Promise

console.log(Keys)

const MONGO_URI = Keys['mongoURI']
console.log('Mongo', MONGO_URI)
server_ready = false
mongoose.connect(MONGO_URI).
  then(
    (conn) => {
      server_ready = true;
      console.log('connected to mongodb.')
    },
    (err) => {
      server_ready = false;
      console.log('error connecting to mongo', err)
    })

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
var x = __dirname + '/../../dist'
console.log("X", x)
app.use(serveStatic(x))
app.use(cors())

/***********************************/
require('./CategoryRoutes')(app)
require('./DishRoutes')(app)
require('./MealRoutes')(app)
require('./ComboRoutes')(app)
require('./VueRoutes')(app)
require('./SettingsRoutes')(app)
require('./EnquiryRoutes')(app)
require('./FAQRoutes')(app)
/***********************************/

function myServerReadyMW (req, res, next) {
  if (!server_ready) {
    res.status(503).send({status: 'db_not_ready', message: 'trouble connecting to the database. please try again later or report to the site administrator : suraj@sunson.in .'})
  }
  next(req, res)
}

app.use(myServerReadyMW)

const port = process.env.PORT || Keys['port'] || 8081

app.listen(port, function (err, app) { console.log('listening for HTTP requests on port ' + port + ' ...') })



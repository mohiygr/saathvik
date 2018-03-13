const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const serveStatic = require('serve-static')
// mongoose.Promise = global.Promise

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sathvik' // 'mongodb://webapp:W3bapp@ds111059.mlab.com:11059/sathvik'
server_ready = false

mongoose.connect(MONGO_URI, function (x, y) { if (!x) { server_ready = true; console.log('connected to mongodb://' + y.host + ':' + y.port + '/' + y.name + ' as ' + y.user) } })

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
/***********************************/

function myServerReadyMW (req, res, next) {
  if (!server_ready) {
    res.status(503).send({status: 'db_not_ready', message: 'trouble connecting to the database. please try again later or report to the site administrator : suraj@sunson.in .'})
  }
  next(req, res)
}

//app.use(myServerReadyMW)


const port = process.env.PORT || 8081

app.listen(port, function (err, app) { console.log('listening on port ' + port + ' ...') })



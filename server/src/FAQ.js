const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FAQSchema = new Schema({
  question: { type: String }, // Note: ** User management is in
                          // FireBase. This is a string reference to
                          // the firebase User UID
  answer: { type: String },
  votes: { type: Number, default: 0 }
})

var FAQ = mongoose.model('FAQ', FAQSchema)

module.exports = FAQ


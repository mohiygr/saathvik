const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EnquirySchema = new Schema({
  name: { type: String }, // Note: ** User management is in
                          // FireBase. This is a string reference to
                          // the firebase User UID
  email: { type: String },
  phone: { type: String },
  pincode: { type: String },
  message: { type: String },
  date: { type: Date, default: Date.now }
})

var Enquiry = mongoose.model('Enquiry', EnquirySchema)

module.exports = Enquiry

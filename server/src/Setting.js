const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingSchema = new Schema({
  key: { type: String }, 
  value: { type: String },
  last_modified: { type: Date, default: Date.now }
})

var Setting = mongoose.model('Setting', SettingSchema)

module.exports = Setting

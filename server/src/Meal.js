const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MealSchema = new Schema({
  title: { type: String },
  user: { type: String }, // Note: ** User management is in
                          // FireBase. This is a string reference to
                          // the firebase User UID
  combo: { type: Schema.Types.ObjectId,
          ref: 'Combo', required: true },
  dishes: [ { type: Schema.Types.ObjectId,
               ref: 'Dish', required: true } ],
  tags: [ { type: String} ]
})

var Meal = mongoose.model('Meal', MealSchema)

module.exports = Meal

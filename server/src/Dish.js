const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DishSchema = new Schema({
  title: { type: String,
           required: true },
  category: { type: Schema.Types.ObjectId,
              ref: 'Category',
              required: true },
  cost: { type: Number, required: true }
})

var Dish = mongoose.model('Dish', DishSchema)

module.exports = Dish

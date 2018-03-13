const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*******************************************************************
 * Combo is an abstract way of creating a plate of categories, like
 * templates, out of which a Meal can be defined. The admin gets to
 * create a Combo object, using which as a template, we provide the
 * user interface to create and save meals, attach recipes and
 * pictures and other media to it, and so on.
 */

const ComboSchema = new Schema({
  title: { type: String,
           required: true },
  categories: [ { type: Schema.Types.ObjectId, ref: 'Category', required: true } ],
  tags: [ { type: String } ]
})

var Combo = mongoose.model('Combo', ComboSchema)

module.exports = Combo

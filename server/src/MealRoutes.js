const Meal = require('./Meal')


module.exports = function (app) {

  app.put('/meals/:id', (req, res) => {
    if (!req.body.dishes) {
      res.send({status: 'error', message: "'dishes' is needed"})
    } else {
      if (req.body.dishes.constructor === Array) {
        if (req.body.dishes.length < 1) {
          res.send({status: 'error', message: "'dishes' must be a list"})
        } else if (!req.body.combo) {
          res.send({status: 'error', message: "'combo' is needed"})
        } else if (!req.body.title) {
          res.send({status: 'error', message: "'title' is needed"})
        } else {
          // finally, success!
          Meal.findOneAndUpdate(
            {_id: req.params.id},
            {
              title: req.body.title,
              dishes: req.body.dishes,
              combo: req.body.combo,
              cost: req.body.cost
            })
            .then(
              (o) => { res.send({status: 'ok', created: o}) },
              (e) => { console.log("Error", e); res.send({status: 'error', message: 'could not update Meal'}) })
        }
      } else {
        res.send({status: 'error', message: "'dishes' should be a non-empty list"})
      }
    }
  })

  
  app.post('/meals', (req, res) => {
    if (!req.body.dishes) {
      res.send({status: 'error', message: "'dishes' is needed"})
    } else {
      if (req.body.dishes.constructor === Array) {
        if (req.body.dishes.length < 1) {
          res.send({status: 'error', message: "'dishes' must be a list"})
        } else if (!req.body.combo) {
          res.send({status: 'error', message: "'combo' is needed"})
        } else if (!req.body.title) {
          res.send({status: 'error', message: "'title' is needed"})
        } else {
          // finally, success!
          new Meal({
            title: req.body.title,
            dishes: req.body.dishes,
            combo: req.body.combo,
            cost: req.body.cost
          }).save().then(
            (o) => { res.send({status: 'ok', created: o}) },
            (e) => { console.log("Error", e); res.send({status: 'error', message: 'could not save new Meal'}) })
        }
      } else {
        res.send({status: 'error', message: "'dishes' should be a non-empty list"})
      }
    }
  })

  
  app.get('/meals', (req, res) => {
    Meal.find({})
      .populate({path: 'combo', populate: { path: 'categories' }})
      .populate({path: 'dishes', populate: {path: 'category' }})
      .exec()
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of meals'})
      })
  })

  app.delete('/meals/:id', (req, res) => {
    Meal.remove({_id: req.params.id})
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of meals'})
      })
  })

}

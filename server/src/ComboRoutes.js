const Combo = require('./Combo')

module.exports = function (app) {

  app.post('/combos', (req, res) => {
    if (!req.body.title) {
      res.send({status: 'error', message: "'title' is needed"})
    } else if (!req.body.categories) {
      res.send({status: 'error', message: "'categories' is needed"})
    } else {
      if (req.body.categories.constructor === Array) {
        if (req.body.categories.length < 1) {
          res.send({status: 'error', message: "'categories' array must contain atleast 1 id ref to category"})
        } else {
          // finally, success!
          new Combo({
            title: req.body.title,
            categories: req.body.categories,
            tags: req.body.tags
          }).save().then(
            (o) => { res.send({status: 'ok'}) },
            (e) => { console.log("Error", e); res.send({status: 'error', message: 'could not save new combo'}) })
        }
      } else {
        res.send({status: 'error', message: "'categories' should be an array"})
      }
    }
  })


  app.get('/combos', (req, res) => {
    Combo.find()
      .populate('categories')
      .exec()
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("MY Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of combos'})
      })
  })

  app.put('/combos/:id', (req, res) => {
    if (!req.body.title || !req.body.categories) {
      res.send({status: 'error', message: 'need title, categories'})
    } else {
      var c = Combo.update({_id: req.params.id}, { title: req.body.title,
                                                   categories: req.body.categories })
          .then(
            (resp) => {
              res.send({'status': 'updated'})
            },
            (err) => {
              res.send({'status': 'error'})
            })
    }
  })

  app.delete('/combos/:id', (req, res) => {
    var c = Combo.remove({_id: req.params.id})
        .then(
          (resp) => {
            res.send({'status': 'deleted'})
          },
          (err) => {
            res.send({'status': 'error', 'message': 'error deleting'})
          })
  })

}

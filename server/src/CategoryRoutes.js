const Category = require('./Category')

module.exports = function (app) {
  app.get('/categories', (req, res) => {
    Category.find()
      .exec()
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of dish categories'})
      })
  })

  app.post('/categories', (req, res) => {
    if (!req.body.title) {
      res.send({status:'error',message:'need title'})
    } else {
      var c = new Category({ title: req.body.title}).save().then((o) => { res.send({'status': 'created', 'object': o}) },
                                                                 (e) => { res.send({'status':'error', 'message': 'could not save'}) })
    }
  })

  app.put('/categories/:id', (req, res) => {
    if (!req.body.title) {
      res.send({status: 'error', message: 'need title'})
    } else {
      var c = Category.update({_id: req.params.id}, { title: req.body.title })
          .then(
            (resp) => {
              res.send({'status': 'updated'})
            },
            (err) => {
              res.send({'status': 'error'})
            })
    }
  })

  app.delete('/categories/:id', (req, res) => {
    var c = Category.remove({_id: req.params.id})
        .then(
          (resp) => {
            res.send({'status': 'deleted'})
          },
          (err) => {
            res.send({'status': 'error', 'message': 'error deleting'})
          })
  })
}


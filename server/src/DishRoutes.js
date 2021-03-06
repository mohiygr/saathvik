const Dish = require('./Dish')

module.exports = function (app) {

  app.get('/dishes', (req, res) => {
    Dish.find()
      .populate('category')
      .sort({'title':'asc'})
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of meals'})
      })
  })

  app.post('/dishes', (req, res) => {
    if (!req.body.title || !req.body.category || !req.body.cost) {
      res.send({status:'error',message:'need title and a valid category ref'})
    } else {
      var c = new Dish({ title: req.body.title, category: req.body.category, cost: req.body.cost})
          .save()
          .then(
            (o) => {
              res.send({'status': 'created', 'object': o})
            },
            (e) => {
              res.send({'status':'error', 'message': 'could not save'})
            })
    }
  })

  app.put('/dishes/:id', (req, res) => {
    if (!req.body.title || !req.body.category || !req.body.cost) {
      res.send({status: 'error', message: 'need title and a valid category ref'})
    } else {
      var c = Dish.update({_id: req.params.id}, { title: req.body.title, category: req.body.category, cost: req.body.cost })
          .then(
            (resp) => {
              res.send({'status': 'updated'})
            },
            (err) => {
              res.send({'status': 'error'})
            })
    }
  })

  app.delete('/dishes/:id', (req, res) => {
    var c = Dish.remove({_id: req.params.id})
        .then(
          (resp) => {
            res.send({'status': 'deleted'})
          },
          (err) => {
            res.send({'status': 'error', 'message': 'error deleting'})
          })
  })
  
}

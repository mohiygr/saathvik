const Enquiry = require('./Enquiry')

module.exports = function (app) {

  app.post('/enquiries', (req, res) => {
    if (!req.body.name || !req.body.phone || !req.body.email || !req.body.pincode) {
      res.send({status: 'error', message: "name, phone, email and pincode are needed"})
    } else {
      new Enquiry({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        pincode: req.body.pincode,
        message: req.body.message
          }).save().then(
            (o) => { res.send({status: 'ok', created: o}) },
            (e) => { console.log("Error", e); res.send({status: 'error', message: 'could not save new Enquiry'}) })
    }
  })

  app.get('/enquiries', (req, res) => {
    Enquiry.find({})
      .exec()
      .then((dbres) => {
        res.send(JSON.stringify(dbres, null, 2))
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of enquiries'})
      })
  })


  app.delete('/enquiries/:id', (req, res) => {
    var c = Enquiry.remove({_id: req.params.id})
        .then(
          (resp) => {
            res.send({'status': 'deleted'})
          },
          (err) => {
            res.send({'status': 'error', 'message': 'error deleting'})
          })
  })


}

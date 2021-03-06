const Setting = require('./Setting')

module.exports = function (app) {

  app.put('/settings/:key', (req, res) => {
    if (!req.body.value) {
      res.send({status:'error', message:'need key (/settings/:key), value (json body)'})
    } else {
      Setting.update({key: req.params.key}, { key: req.params.key, value: req.body.value, last_updated: new Date()}, {upsert: true, setDefaultsOnInsert: true}).then(
        (o) => { res.send({status: 'ok', created: o}) },
        (e) => { console.log("Error", e); res.send({status: 'error', message: 'could not save new Setting'}) })
    }
  })

  app.get('/settings/:key', (req, res) => {
    Setting.find({key: req.params.key})
      .exec()
      .then(
        (dbres) => {
          res.send(dbres)
        },
        (err) => {
          console.log('Error getting ' + req.params.ey, err)
        })
  })
  
  app.get('/settings', (req, res) => {
    Setting.find({})
      .sort({'key':'asc'})
      .exec()
      .then((dbres) => {
        res.send(dbres)
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of settings'})
      })
  })

}

// TODO: Testing of Settings and Contacts APIs
// TODO: Settings UI
// TODO: Contacts UI

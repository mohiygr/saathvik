const FAQ = require('./FAQ')

module.exports = function (app) {
  // get FAQs (whether from FAQMaster or main website)
  app.get('/faqs', (req, res) => {
    FAQ.find({})
      .sort({votes: 'desc'})
      .exec()
      .then((dbres) => {
        res.send(JSON.stringify(dbres, null, 2))
      }, (err) => {
        console.log("Error", err);
        res.send({status: 'error', message: 'error occurred fetching list of enquiries'})
      })
  })

  // post new from FAQmaster screen
  app.post('/faqs', (req, res) => {
    if (!req.body.question || !req.body.answer) {
      res.send({status: 'error', message: "question and answer are required"})
    } else {
      new FAQ({
        question: req.body.question,
        answer: req.body.answer,
      }).save().then(
        (o) => { res.send({status: 'ok', created: o}) },
        (e) => { console.log("Error in creating FAQ", e); res.send({status: 'error', message: 'could not save new Enquiry'}) })
    }
  })

  // update from FAQmaster screen
  app.put('/faqs/:id', (req, res) => {
    if (!req.body.question || !req.body.answer) {
      res.send({status: 'error', message: 'question,answer are required to update FAQ'})
    } else {
      FAQ.findOneAndUpdate({_id: req.params.id},
                        {question: req.body.question,
                         answer: req.body.answer,
                         votes: req.body.votes})
        .then(
          (o) => {
            res.send({status: 'ok', updated: o})
          },
          (e) => {
            console.log('Error in updating FAQ', e)
            res.send({status: 'error', message: 'could not update FAQ'})
          })
    }
  })

  app.delete('/faqs/:id', (req, res) => {
    var c = FAQ.remove({_id: req.params.id})
        .then(
          (resp) => {
            res.send({'status': 'deleted'})
          },
          (err) => {
            res.send({'status': 'error', 'message': 'error deleting'})
          })
  })

  // whenever user opens an FAQ to view it, this upvote is made
  app.put('/faqs/:id/incr_vote', (req, res) => {
    FAQ.findOneAndUpdate({_id: req.params.id},
                         { '$inc': { votes: 1 } })
      .then(
        (o) => {
          res.send({status: 'ok', upvoted: o})
        },
        (e) => {
          console.log('Error in upvoting FAQ', e)
          res.send({status: 'error', message: 'could not upvote FAQ'})
        })
  })

}

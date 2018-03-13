const express = require('express')

module.exports = function (app) {
  app.get('/auth', (req, res) => {
    res.sendFile('../../dist/index.html')
  })
}



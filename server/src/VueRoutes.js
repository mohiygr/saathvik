const express = require('express')

function doIt(res) {
  res.sendFile('index.html', {root: '../dist/'})
}

module.exports = function (app) {
  app.get('/auth', (req, res) => {
    doIt(res)
  })
  app.get('/contact', (req, res) => {
    doIt(res)
  })
  app.get('/about', (req, res) => {
    doIt(res)
  })
  app.get('/logout', (req, res) => {
    doIt(res)
  })
}



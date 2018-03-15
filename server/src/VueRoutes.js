const express = require('express')

function doIt(res) {
  res.sendFile('index.html', {root: '../dist/'})
}

module.exports = function (app) {
  var stuff = ['auth', 'about', 'contact', 'faq', 'menu', 'profile',
               'logout','admin', 'faqmaster', 'catmaster','dishmaster',
               'combomaster' ,'mealmaster']

  stuff.forEach(function (path) {
    app.get('/' + path, (req, res) => {
      doIt(res)
    })
  })
}

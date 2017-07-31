require('./../util/time')
var express = require('express');
var router = express.Router();

var Message = require('./../models/messages')

router.post("/messageSub", function (req,res) {
  let name = req.cookies.name
  let email = req.cookies.email
  let content = req.body.content

  let random = Math.floor(Math.random()*10)
  let sysDate = new Date().Format('yyyMMddhhmmss')
  let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

  let messageId = sysDate +random

  let message = {
      "messageId": messageId,
      "name": name,
      "email": email,
      "content": content,
      "createDate": createDate
  }

  Message.push(article)
  Message.save(function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
        result:''
      })
    } else {
      res.json ({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

require('./../util/time')
var express = require('express');
var md5 = require('md5');
var router = express.Router();

var Article = require('./../models/articles')
var User = require('./../models/users')

router.get("/api/articleList_admin", function (req,res) {
  let page = parseInt(req.param("page")) //浏览器参数第几页
  let pageSize = parseInt(req.param("pageSize")) //当前一页多少个
  let skip = (page - 1)*pageSize
  let ArticleModal = Article.find().skip(skip).limit(pageSize).sort({_id:-1}).lean()

  ArticleModal.exec(function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
      })
    } else {
      res.json ({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 发布文章
router.post("/api/articleSub", function (req,res) {
  let title = req.body.title
  let tag = req.body.tag
  let describtion = req.body.describtion
  let content = req.body.content

  let random = Math.floor(Math.random()*10)
  let sysDate = new Date().Format('yyyMMddhhmmss')
  let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
  let articleId = sysDate +random

  let article = {
      "articleId": articleId,
      "title": title,
      "tag": tag,
      "describtion": describtion,
      "createDate": createDate,
      "content": content
  }
  Article.create(article, function (err,doc) {
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

// 删除文章
router.post("/api/articleDelete", function (req,res) {
  let articleId = req.body.articleId
  Article.remove({articleId:articleId}, function (err,doc) {
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

// 修改文章
router.post("/api/articleModify", function (req,res) {
  let content = req.body.content
  let articleId = req.body.articleId
  Article.findOneAndUpdate({articleId:articleId}, {$set: {content:content}}, function (err,doc) {
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

router.get("/api/login", function (req,res) {
  let account = req.query.account
  let password = req.query.password
  User.findOne({account:account}).lean().exec(function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
        result:''
      })
    } else {
      if (!doc.password) {
        res.json ({
          status: "1",
          msg: '',
          result: '无此用户'
        })
      } else {
          let pwd = md5(doc.password)
          doc.password = md5(doc.password)
          if (password == pwd) {
            res.json ({
              status: '0',
              msg: '',
              result: doc
            })
          } else {
            res.json ({
              status: '1',
              msg: '',
              result: doc
            })
          }
        }
    }
  })
})
module.exports = router

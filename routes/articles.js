require('./../util/time')
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var trimHtml = require('trim-html');

var Article = require('./../models/articles')

mongoose.connect('mongodb://127.0.0.1:27017/my_blog');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connect success");
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connect fail");
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connect disconnected");
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 分页检索文章
router.get("/articleList", function (req,res) {
  let page = parseInt(req.param("page")) //浏览器参数第几页
  let pageSize = parseInt(req.param("pageSize")) //当前一页多少个
  let skip = (page - 1)*pageSize
  let ArticleModal = Article.find().select('articleId title content').skip(skip).limit(pageSize).lean()

  ArticleModal.exec(function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
      })
    } else {
      doc.forEach(function (item) {
        item.content = trimHtml(item.content, {limit: 100})
      })
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

// 文章详情
router.get("/articleDetial", function (req,res) {
  let articleId = parseInt(req.param("articleId"))
  Article.findOne({articleId:articleId}, function (err,doc) {
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
        result: doc
      })
    }
  })
})

// 发布文章
router.post("/articleSub", function (req,res) {
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
  Article.push(article)
  Article.save(function (err,doc) {
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
module.exports = router;

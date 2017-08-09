require('./../util/time')
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var trimHtml = require('trim-html');

var Article = require('./../models/articles')
var Message = require('./../models/messages')

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

router.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
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
  let ArticleModal = Article.find().select('articleId title tag content createDate').skip(skip).limit(pageSize).sort({_id:-1}).lean()

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
  let articleId = req.query.articleId
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

// 查询标签
router.get("/articleTags", function (req,res) {
  Article.find().select('tag -_id').exec(function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
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
module.exports = router

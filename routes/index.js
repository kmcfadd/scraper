// server and db schema modules
var express = require('express');
var router = express.Router();
var db = require('../models');

// scraping dependencies
var axios = require('axios');
var cheerio = require('cheerio');

// route for getting all articles in the db
router.get('/', function (req, res) {
    db.Article.find({}).sort({created: -1}).limit(20)
        .then(function(article) {
            res.render('index', { articles: article })
        })
        .catch(function(err) {
            res.writeContinue(err)
        })
})

// route for displaying saved articles
router.get('/articles/saved', function (req, res) {
    db.Article.find({saved: true}).sort({created: -1}).limit(20).populate('note')
        .then(function(article) {
            res.render('saved', { articles: article })
        })
        .catch(function(err) {
            res.writeContinue(err)
        })
})

// route to scrape gameinformer articles
router.get('/scrape', function (req, res) {
    axios.get('https://www.gameinformer.com/').then(function(response) {
        // load cheerio module into the $ variable
        var $ = cheerio.load(response.data)
        // grab every page-title class article to form our db articles
        $('.page-title').each(function (i, element) {

            var result = {}

            result.title = $(element).children().text();
            result.link = $(element).find('a').attr('href');

            // create new article using the result from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // log the article to console
                    console.log(dbArticle)
                })
                .catch(function(err) {
                    res.writeContinue(err)
                })
        })
        // send message upon successful scrape and article saving
        res.send('scrape complete')
    })
})

// route to delete an article from the index
router.delete('/deleteArticle/:id', function (req, res) {
    db.Article.remove({ _id: req.params.id })
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.writeContinue(err)
        })
})

// route to clear the db of articles
router.get('/cear-articles', function (req, res) {
    db.Article.remove({}, function(err, response) {
        if (err) {
            res.writeContinue(err)
        } else {
            res.send(response)
            console.log(response)
        }
    })
})

module.exports = router;
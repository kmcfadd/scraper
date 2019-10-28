var express = require('express');
var router = express.Router();
var db = require('../models');

// route for updating single article saved status
router.post('/save-article/:id', function(req, res) {
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: {saved: true} }
    ).then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.writeContinue(err)
    })
});

// delete route to remove single article saved status
router.post('/delete-saved/:id', function (req, res) {
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: {saved: false} }
    ).then(function(response) {
        res.redirect('/articles/saved/')
    }).catch(function(err){
        res.writeContinue(err)
    })
});

// route for grabbing a specific Article by id, populate it with it's note
router.get('/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbarticle) {
        res.json(dbarticle)
    })
    .catch(function(err) {
        res.writeContinue(err)
    })
});

// Route for saving/updating an Article's associated Note
router.post('/save-note/:id', function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return dbArticle.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { note: dbNote._id } }, 
                { new: true }
            )
            .populate("note")
        })
        .then(function(dbArticle) {
            res.json( { success: true })
        })
        .catch(function(err) {
            res.writeContinue(err)
        })
})

// route to delete a note from the DB
router.post('/delete/:id', function (req, res) {
    db.Note.findByIdAndRemove( { _id: req.params.id })
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate(
                { "note": req.params.id },
                { $pull: { "note": req.params.id } }
            )
        })
        .then(function(dbArticle) {
            res.redirect('back')
        })
        .catch(function(err) {
            res.writeContinue(err)
        })
})

module.exports = router
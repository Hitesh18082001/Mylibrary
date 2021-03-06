var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
const { body, validationResult } = require('express-validator');
// Display list of all Authors.
exports.author_list = function(req, res,next) {

       Author.find({},'first_name family_name')
       .exec(function(err,list_author)
       { if(err){return next(err);}
       res.render('author_list', { title: 'Author List', author_list: list_author });       
        });
 

   
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });

};
// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.render('author_form',{title:'create author'});
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    body('first_name').trim().isLength({min:1}).escape().withMessage('first name required')
    .isAlphanumeric().withMessage("name should not contains numbers"),
    body('family_name','family name required').trim().isLength({min:1}).escape(),
    body('date_of_birht','invalid').optional({checkFalsy:true}).isISO8601().toDate(),
    body('date_of_death','invalid').optional({checkFalsy:true}).isISO8601().toDate(),
    (req,res,next)=>
    {
       const errors=validationResult(req);
       if(!errors.isEmpty()){
           res.render('author_form',{title:'Create Author',author: req.body,errors:errors.array()});
           return;
       }
       else{
            var author=new Author(

                {
                    first_name:req.body.first_name,
                    family_name:req.body.family_name,
                    date_of_birth:req.body.date_of_birth,
                    date_of_death:req.body.date_of_death
                }
            );
            author.save(function(err){

                if(err){return next(err);}
                res.redirect(author.url);
            });

       }


    }
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
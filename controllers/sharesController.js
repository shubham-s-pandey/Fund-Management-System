const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Shares = mongoose.model('Shares');     
const passport = require('passport');
const User = mongoose.model('user'); 


router.get('/',isAuthenticated, (req,res) => {
    res.render("shares/addOrEditshares",{
        viewTitle : "Insert shares details"
        });
    
});

router.post('/',isAuthenticated,(req,res) => {
    if(req.body._id == '')
        insertRecord(req,res);
        else{
            
                updateRecord(req,res);
        }
});

function insertRecord(req,res){
    var shares = new Shares();
    shares.idno = req.user.email;
    shares.createid = req.user.email;
    shares.fullName = req.body.fullName;
    shares.email = req.user.email;
    
    
    shares.company = req.body.company;
    shares.address = req.body.address;
    shares.amount = req.body.amount;

    shares.save((err, doc) => {
        if(!err)
            res.redirect('shares/listshares');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("shares/addOrshares",{
                    viewTitle : "Insert shares",
                    shares: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

function updateRecord(req,res){
    Shares.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('shares/listshares');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("shares/addOrEditshares",{
                    viewTitle: 'update shares details',
                    shares: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Shares.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
}

router.get('/listshares',isAuthenticated,(req,res) => {
    Shares.find({ email: req.user.email},(err, docs) => {
        if(!err){
            res.render("shares/listshares",{
                
                listshares: docs

            });
        }
        else{
            console.log('Error in retrieving shares list :' + err);
        }
    });
});

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;

        }
    }
}


function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
  }
  


router.get('/:id',isAuthenticated, (req,res) => {
    Shares.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("shares/addOrEditshares",{
                viewTitle: "Update shares",
                shares: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Shares.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/shares/listshares');
        }
        else {console.log('Error in shares delete:' + err);}
    });
});

module.exports = router;







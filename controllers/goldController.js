const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const gold1 = mongoose.model('gold');     
const passport = require('passport');
const User = mongoose.model('user'); 


router.get('/',isAuthenticated, (req,res) => {
    res.render("gold/addOrEdit",{
        viewTitle : "Please enter your gold possesion"
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
    var gold = new gold1();
    gold.idno = req.user.email;
    gold.createid = req.user.email;
    gold.fullName = req.body.fullName;
    gold.email = req.user.email;
    
    
    gold.mobile = req.body.mobile;
    gold.Amount = req.body.Amount;
    gold.save((err, doc) => {
        if(!err)
            res.redirect('gold/list');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("gold/addOrEdit",{
                    viewTitle : "Please enter your gold possesion",
                    fund: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

router.get('/list',isAuthenticated,(req,res) => {
    gold1.find({ email : req.user.email },(err, docs) => {
        if(!err){
            res.render("gold/list",{
                
                list: docs

            });
        }
        else{
            console.log('Error in retrieving Fund list :' + err);
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
    gold1.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("gold/addOrEdit",{
                viewTitle: "Update Fund",
                fund: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    gold1.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/gold/list');
        }
        else {console.log('Error in Fund delete:' + err);}
    });
});

module.exports = router;







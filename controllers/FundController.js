const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Fund = mongoose.model('Fund');     
const passport = require('passport');
const User = mongoose.model('user'); 


router.get('/',isAuthenticated, (req,res) => {
    res.render("Fund/addOrEdit",{
        viewTitle : "Insert Amount"
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

    console.log("i am here");
    console.table(req.body)
    var fund = new Fund();
    fund.idno = req.user.email;
    fund.createid = req.user.email;
    fund.fullName = req.body.fullName;
    fund.email = req.body.email;
    
    
    fund.mobile = req.body.month;
    fund.Amount = req.body.Amount;
    fund.save((err, doc) => {
        if(!err)
            res.redirect('Fund/list');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("Fund/addOrEdit",{
                    viewTitle : "Insert Fund",
                    fund: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

router.get('/',isAuthenticated,(req,res) => {
    Fund.find((err, docs) => {
        if(!err){
            res.render("profile",{
                
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
    Fund.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("Fund/addOrEdit",{
                viewTitle: "Update Fund",
                fund: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Fund.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/Fund/list');
        }
        else {console.log('Error in Fund delete:' + err);}
    });
});

module.exports = router;







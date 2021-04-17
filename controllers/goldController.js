const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Gold = mongoose.model('Gold');     
const passport = require('passport');
const User = mongoose.model('user'); 
const Fund = mongoose.model('Fund'); 

router.get('/',isAuthenticated, (req,res) => {
    res.render("gold/addOrEditgold",{
        viewTitle : "Insert Gold details"
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
    var gold = new Gold();
    gold.idno = req.user.email;
    gold.createid = req.user.email;
    gold.fullName = req.body.fullName;
    gold.email = req.user.email;
    
    
    gold.location = req.body.location;
    gold.address = req.body.address;
    gold.amount = req.body.amount;

    console.log("fetch to fund");

    // const fund = new Fund()
    // fund.idno = req.user.email;
    // fund.createid = req.user.email;
    // fund.fullName = req.body.fullName;
    // fund.email = req.body.email;
    
    
    // fund.month = req.body.month;
    // fund.Amount = req.body.Amount;
    // fund.save();
    Fund.find({email : req.user.email},(err,userh)=> {

        console.log("inside fund", userh);
        if(userh.length != 0){
       
        const j = userh[0].Amount + Number(req.body.amount);
        console.log("user exist",j );
            Fund.update({email : req.user.email},{$set:{ Amount : j }},function (error, response) {
                console.log(error);
                console.log(response);
                
            })
        }
        else {
            const fund = new Fund()
    fund.idno = req.user.email;
    fund.createid = req.user.email;
    fund.fullName = req.body.fullName;
    fund.email = req.user.email;    
    fund.month = req.body.month;
    fund.Amount = req.body.salary;
    fund.save();
        }
    })

    
//     

    gold.save((err, doc) => {
        if(!err)
            res.redirect('gold/listgold');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("gold/addOrgold",{
                    viewTitle : "Insert Gold",
                    gold: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

function updateRecord(req,res){
    Gold.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('gold/listgold');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("gold/addOrEditgold",{
                    viewTitle: 'update gold details',
                    gold: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Gold.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
}

router.get('/listgold',isAuthenticated,(req,res) => {
    Gold.find({ email: req.user.email},(err, docs) => {
        if(!err){
            res.render("gold/listgold",{
                
                listgold: docs

            });
        }
        else{
            console.log('Error in retrieving gold list :' + err);
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
    Gold.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("gold/addOrEditgold",{
                viewTitle: "Update gold",
                gold: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Gold.findByIdAndRemove(req.params.id,(err, doc) =>{

        Fund.find({email : req.user.email},(err,userh)=> {

            console.log("inside fund", userh);
            if(userh.length != 0){
           
            const j = userh[0].Amount - Number(doc.amount);
            console.log("user exist",j );
                Fund.update({email : req.user.email},{$set:{ Amount : j }},function (error, response) {
                    console.log(error);
                    console.log(response);
                    
                })
            }
          
        })

        if(!err){
            res.redirect('/gold/listgold');
        }
        else {console.log('Error in gold delete:' + err);}
    });
});

module.exports = router;







const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Salary = mongoose.model('Salary');     
const passport = require('passport');
const User = mongoose.model('user'); 
const fetch = require("node-fetch");
const Fund = mongoose.model('Fund'); 


router.get('/',isAuthenticated, (req,res) => {
    res.render("salary/addOrEditsalary",{
        viewTitle : "Insert Salary"
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
    var salary = new Salary();
    salary.idno = req.user.email;
    salary.createid = req.user.email;
    salary.fullName = req.body.fullName;
    salary.email = req.user.email;
    
    
    salary.month = req.body.month;
    salary.salary = req.body.salary;
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
       
        const j = userh[0].Amount + Number(req.body.salary);
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

    salary.save((err, doc) => {
        if(!err)
            res.redirect('salary/listsalary');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("salary/addOrsalary",{
                    viewTitle : "Insert Salary",
                    salary: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

async function updateRecord(req,res){

    console.log("in update salary");

    await Salary.find({_id:req.body._id},(err, d) => {

        console.log("in update salary",d);
        Fund.find({email : req.user.email},(err,userh)=> {

            const j =userh[0].Amount - Number(d[0].salary)
            console.log("this is userh - d",j);
        Fund.update({email : req.user.email},{ $set :{Amount : j}},function (error, response) {
            console.log(error);
            console.log(response);
            
        })

        })
    })

    

    Salary.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('salary/listsalary');}
        else{

            console.log("This is is update salary : ",doc);

            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("salary/addOrEditsalary",{
                    viewTitle: 'update Salary',
                    salary: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Salary.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    console.log("updated salary",doc);
        Fund.update({email : req.user.email},{ $set :{Amount : doc.salary}},function (error, response) {
            console.log(error);
            console.log(response);
            
        })
        console.log(doc,"hello");
    });
}


router.get('/listsalary',isAuthenticated,(req,res) => {
    Salary.find({ email: req.user.email},(err, docs) => {
        if(!err){
            res.render("salary/listsalary",{
                
                listsalary: docs

            });
        }
        else{
            console.log('Error in retrieving salary list :' + err);
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
    Salary.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("salary/addOrEditsalary",{
                viewTitle: "Update Salary",
                salary: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Salary.findByIdAndRemove(req.params.id,(err, doc) =>{

        Fund.find({email : req.user.email},(err,userh)=> {

            console.log("inside fund", userh);
            if(userh.length != 0){
           
            const j = userh[0].Amount - Number(doc.salary);
            console.log("user exist",j );
                Fund.update({email : req.user.email},{$set:{ Amount : j }},function (error, response) {
                    console.log(error);
                    console.log(response);
                    
                })
            }
          
        })

        if(!err){
            res.redirect('/salary/listsalary');
        }
        else {console.log('Error in salary delete:' + err);}
    });
});

module.exports = router;







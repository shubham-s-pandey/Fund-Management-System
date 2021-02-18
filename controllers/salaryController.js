const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Salary = mongoose.model('Salary');     
const passport = require('passport');
const User = mongoose.model('user'); 


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
    salary.email = req.body.email;
    
    
    salary.month = req.body.month;
    salary.salary = req.body.salary;
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

function updateRecord(req,res){
    Salary.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('salary/listsalary');}
        else{
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
    
        console.log(doc);
    });
}

router.get('/listsalary',isAuthenticated,(req,res) => {
    Salary.find((err, docs) => {
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
        if(!err){
            res.redirect('/salary/listsalary');
        }
        else {console.log('Error in salary delete:' + err);}
    });
});

module.exports = router;







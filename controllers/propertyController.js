const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Property = mongoose.model('Property');     
const passport = require('passport');
const User = mongoose.model('user'); 


router.get('/',isAuthenticated, (req,res) => {
    res.render("property/addOrEditproperty",{
        viewTitle : "Insert Property details"
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
    var property = new Property();
    property.idno = req.user.email;
    property.createid = req.user.email;
    property.fullName = req.body.fullName;
    property.email = req.user.email;
    
    
    property.location = req.body.location;
    property.address = req.body.address;
    property.amount = req.body.amount;

    property.save((err, doc) => {
        if(!err)
            res.redirect('property/listproperty');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("property/addOrproperty",{
                    viewTitle : "Insert Property",
                    property: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

function updateRecord(req,res){
    Property.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('property/listproperty');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("property/addOrEditproperty",{
                    viewTitle: 'update property details',
                    property: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Property.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
}

router.get('/listproperty',isAuthenticated,(req,res) => {
    Property.find({ email: req.user.email},(err, docs) => {
        if(!err){
            res.render("property/listproperty",{
                
                listproperty: docs

            });
        }
        else{
            console.log('Error in retrieving property list :' + err);
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
    Property.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("property/addOrEditproperty",{
                viewTitle: "Update property",
                property: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Property.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/property/listproperty');
        }
        else {console.log('Error in property delete:' + err);}
    });
});

module.exports = router;







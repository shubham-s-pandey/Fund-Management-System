const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Shares = mongoose.model('Shares');     
const passport = require('passport');
const User = mongoose.model('user'); 
const Fund = mongoose.model('Fund'); 


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

// function updateRecord(req,res){
//     Shares.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
//         if(!err){res.redirect('shares/listshares');}
//         else{
//             if(err.name == 'ValidationError'){
//                 handleValidationError(err, req.body);
//                 res.render("shares/addOrEditshares",{
//                     viewTitle: 'update shares details',
//                     shares: req.body,

//                 });
//             }
//             else
//                 console.log('Error during record update:' + err);
//         }
//     });

//     Shares.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
//         if (err) {
//             console.log("Something wrong when updating data!");
//         }
    
//         console.log(doc);
//     });
// }


async function updateRecord(req,res){

    console.log("in update salary");

    await Shares.find({_id:req.body._id},(err, d) => {

        console.log("in update salary",d);
        Fund.find({email : req.user.email},(err,userh)=> {

            const j =userh[0].Amount - Number(d[0].amount)
            console.log("this is userh - d",j);
        Fund.update({email : req.user.email},{ $set :{Amount : j}},function (error, response) {
            console.log(error);
            console.log(response);
            
        })

        })
    })

    

    Shares.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('shares/listshares');}
        else{

            console.log("This is is update salary : ",doc);

            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("shares/addOrEditshares",{
                                        viewTitle: 'update shares details',
                                        shares: req.body

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
    
        Fund.update({email : req.user.email},{ $set :{Amount : doc.amount}},function (error, response) {
            console.log(error);
            console.log(response);
            
        })
        console.log(doc,"hello");
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
            res.redirect('/shares/listshares');
        }
        else {console.log('Error in shares delete:' + err);}
    });
});

module.exports = router;







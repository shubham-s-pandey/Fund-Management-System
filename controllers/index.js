const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Fund = mongoose.model('Fund');



//
router.get('/profile',isAuthenticated,(req,res) => {
  User.find((err, docs) => {
      if(!err){


        Fund.find({email : req.user.email},(err, docs) => {
          if(!err){
            res.render("profile",{
              name: req.user.email,
              id: req.user._id,
              list: docs
          });
          }
          else{
              console.log('Error in retrieving Fund list :' + err);
          }
      });


          
      }
      else{
          console.log('Error in retrieving Fund list :' + err);
      }
  });
});
//


//Test

// router.get('/',isAuthenticated,(req,res) => {
  
// });

//\test




router.get('/', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.render('profile');
  }
  else{
    res.render('index');
  }
});

router.get('/signup', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.render('profile');
  }
  else{
    res.render('signup');
  }
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.render('profile');
  }
  else{
    res.render('signin');
  }
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));




router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});
router.get('/Fund',isAuthenticated, (req, res, next) => {
  res.render('Fund');
});
router.get('/Fund/addOrEdit',isAuthenticated, (req, res, next) => {
  res.render('/Fund/addOrEdit');
});
router.get('/Fund/list',isAuthenticated, (req, res, next) => {
  res.render('/Fund/list');
});

/*
router.get('/salary',isAuthenticated, (req, res, next) => {
  res.render('salary');
});
router.get('/salary/addOrEditsalary',isAuthenticated, (req, res, next) => {
  res.render('/salary/addOrEditsalary');
});
router.get('/salary/list',isAuthenticated, (req, res, next) => {
  res.render('/salary/list');
});
*/

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});



function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}




module.exports = router;


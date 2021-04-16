const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/FundDB',{ useNewUrlParser: true}, (err) =>{
    if(!err) {console.log('MongoDB Connection Succeeded.')}
    else { console.log('Error in DB connection:' + err)}
} );

require('./Fund.model');
require('./salary.model');
require('./user');
require('./property.model');
require('./shares.model');
require('./gold.model');
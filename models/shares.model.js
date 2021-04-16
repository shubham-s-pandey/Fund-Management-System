const mongoose = require('mongoose');
var sharesSchema = new mongoose.Schema({
    idno: {
        type:String
    },
    createid:{
        type:String
    },
    fullName: {
        type:String,
        required: 'This field is required.'
    },
    email:{
        type:String
    },
    company: {
        type:String
    },
    amount: {
        type:Number
    },
    address: {
        type:Number
    }
});
//custom validation for email
sharesSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
},'Invalid e-mail.');


mongoose.model('Shares',sharesSchema);
const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
var nodemailer = require('nodemailer');
require('dotenv').config();

//setting up what email serveice we are using, and our authorization to that service. username and password
var transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/', (req, res, next) => {
    //the candidate email address and the message to be sent come from the client side
    let email = req.body.candidate.email
    let message = req.body.message
    // var content = `${message} `

    //create new mail object
    let mail = {
        from: 'Economic Elector',
        to: `${email}`,  //email address that you want to receive the message
        subject: 'Budget Plan Request',
        text: 'Requesting your budget plan for upcoming election',
        html: `<html>${message}</html>`//the message is html, so that it looks nice on the email page.
    }
    //use the transporter to send the email
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
})

module.exports = router;
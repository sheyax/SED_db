const router = require("express").Router();
const nodemailer = require("nodemailer")
require("dotenv").config();
const Mailgen = require("mailgen")

const User = require("../models/users");
const Hackathon = require("../models/hackusers")


// user registration 
router.post("/user/register", async(req, res) => {

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city,
        country: req.body.country
    })

    // save user 
    result = await user.save();
    const { data } = await result.toJSON();
    res.send(data)
})


router.post("/hack/register", async(req, res) => {

    const user = new Hackathon({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city,
        country: req.body.country
    })

    // save user 
    result = await user.save();
    const { data } = await result.toJSON();
    res.send(data)
})

const mailSender = (req, res) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            password: process.env.MAILPASS
        }
    }


    let transporter = nodemailer.createTransport(config)
    let mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: "https://mailgen.js"
        }
    })

    let response = {
        body: {
            name: "SED23 host",
            intro: "Your Registration was successful",
            table: {
                data: [{
                        item: "SED23 Ticket",
                        description: "Sustainable Energy Days 2023"

                    }

                ]
            },
            outro: "Looking forward to see you there"
        }
    }

    let mail = mailGenerator.generate(response)

    let message = {
        from: process.env.EMAIL,
        to: "saxdasax@gmail.com",
        subject: "Welcome to SED23",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(err => {
        return res.status(500).json({ err })
    })
}


router.post('/sendmail', mailSender)
module.exports = router;
const router = require('express').Router();
const {generateUsername} = require('unique-username-generator');
const User = require('../models/Users');


//create user
router.post('/', async(req, res) => {
    try {
        req.body.name = generateUsername("@",2,15);                // Generates the username for the User 'name' object field
        const email = req.body.email;
        const password = req.body.password;

        const userNameExists = User.exists({name: req.body.name}) // Checks if the generated user exists in the db
        if(userNameExists){                                       // If the user exists then we generate a new username until we generate a unique one
            req.body.name = generateUsername("@",2,15);
        }
        const name = req.body.name;                               // We assign the 'name' object field to the name variable
        
        const user = await User.create({name, email, password});  // We pass the variables to the user var and call the create() method to create a new entry in the db
        res.status(201).json(user);
    
    } catch (e) {
        let msg;
        const emailExists = User.exists({email: req.body.email});
        if(emailExists) {
            msg = "User already exists";
        }
        else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});


//login user
router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        user.status = 'online';
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json(e.message);
    }
})

module.exports = router;
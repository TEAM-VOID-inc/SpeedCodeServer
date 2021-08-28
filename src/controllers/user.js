const User = require('../models/user');
const {sendEmail} = require('../utils/mail');
const {uploader} = require('../utils/uploader');

//Return all users 
exports.index = async function (req, res) {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if(!user) return res.json({success: false,message: "User not Found"});

    if(user.role !== 'admin')
        return res.status(403).json({success: false,message: "You don't have permission to access this"});
    const users = await User.find({});
    res.status(200).json({success: true,users});
};

//Add a new user

exports.store = async(req, res) => {
    try {
        const {email} = req.body;

        if(!req.headers.host)
            return res.status(400).json({success: false,message: 'Front site Link not provided'});

        const user = await User.findOne({email});

        if(user)
            return res.status(401).json({success: false,message: 'Email already Exists'});

        const password = '_' + Math.random().toString(36).substr(2, 9);
        const newUser = new User({...req.body, password});

        const user_ = await newUser.save();

        user_.generatePasswordReset();

        await user_.save();

        let domain = "http://" + req.headers.host;
        let subject =  "New Account Created";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let text = "New Account Created";
        let link = req.headers.host  + user.resetPasswordToken;
        let html = `<p>Hi user<p><br><p>A new account has been created for you on ${domain}. Please click on the following <a href="${link}">link</a> to set your password and login.</p><br><p>If you did not request this, please ignore this email.</p>`

        await sendEmail({ subject, text, html, to , from});

        res.status(200).json({success: true,message: 'An email has been sent to ' + user.email + '.'})

    } catch (error) {
        res.status(500).json({success: false, message: 'Error in creating a User'})
    }
}


//Return a specific user
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) return res.status(401).json({success: false,message: 'User does not exist'});

        res.status(200).json({success: true,user});
    } catch (error) {
        res.status(500).json({success: false,message: 'Error in getting User'})
    }
};


// Update user details
exports.update = async function (req, res) {
    try {
        const id = req.params.id; 

        await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })

        // const user = await User.findById(id);
        const user_ = await User.findById(id);
        
        return res.status(200).json({success: true,user: user_, message: 'User has been updated'});

    } catch (error) {
        res.status(500).json({success: false,message: 'there is an error in user updation'});
    }
};

//Delete User

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const user_id = req.user._id;

        if (user_id.toString() !== id.toString()) 
                return res.status(401).json({success: false,message: "Sorry, you don't have the permission to delete this data."});

        await User.findByIdAndDelete(id);

        res.status(200).json({success: true,message: 'User has been deleted'});

    } catch (error) {
        res.status(500).json({success: false,message: 'there is an error in user deletion'});
    }
};

//make a user admin
exports.makeadmin = async function (req, res) {
    try {
        const id = req.params.id;
        const user= await User.findById(id);

        user.role = "admin";

        const user_ = await user.save();
        
        return res.status(200).json({success: true,user: user_, message: 'User is Admin Now'});
    } catch (error) {
        res.status(500).json({success: false,message: 'Dont updated as Admin. Please Contact to Website Owner'});
    }
}
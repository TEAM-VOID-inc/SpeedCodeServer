const User = require('../models/user');
const Token = require('../models/token');
const {sendEmail} = require('../utils/mail');
const VerifyEmailTemplate = require('../template/verifymailtemplate');


async function sendVerificationEmail(user, req, res){
    try{

        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();
        
        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let text = "Account Verification"
        let link= process.env.AUTH_VERIFY_LINK + token.token;
        let html = VerifyEmailTemplate.html({link})

        await sendEmail({ subject, text, html, to , from});

        res.status(200).json({success: true,message: 'A verification email has been sent to ' + user.email + '.'});
        
    }catch (error) {
        res.status(500).json({success: false,message: error.message})
    }
}


// Registeration controller

exports.register = async (req, res)=>{
    try {
        const { email } = req.body;

        const user = await User.findOne({email});

        if(user)
            return res.status(401).json({message: "Email Already Exits"});

            const newUser = new User({ ...req.body, role: "basic" });

            const user_ = await newUser.save();

            await sendVerificationEmail(user_, req, res);

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


// Login Controller
exports.login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) 
            return res.status(401).json({msg: 'Email is not registerd'});

        //validate password
        if (!user.comparePassword(password)) 
            return res.status(401).json({message: 'Invalid email or password'});

        // Make sure the user has been verified
        if (!user.isVerified) 
            return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });

        // Login successful, write token, and send back user
        res.status(200).json({success: true,token: user.generateJWT(), user: user});
    } catch (error) {
        res.status(500).json({success: false,message: error.message})
    }
}

// Email verification controller

exports.verify = async (req, res)=>{
    if(!req.params.token)
                return res.status(400).json({success: false,message: "We are unable to find a user for this token"});

    try {
        const token  = await Token.findOne({token : req.params.token});

        if(!token)
            return res.status(400).json({success: false, message: 'We were unable to find a valid token. Your token may have expired.' });
        
            User.findOne({ _id: token.userId }, (err, user) => {
                if (!user) 
                    return res.status(400).json({success: false, message: 'We were unable to find a user for this token.' });
    
                if (user.isVerified) 
                    return res.status(400).json({success: false, message: 'This user has already been verified.' });
    
                user.isVerified = true;

                user.save(function (err) {
                    if (err) 
                        return res.status(500).json({message:err.message});
                    res.status(200).json({success: true,message : "The account has been verified. Please log in."});
                });
            });
    } catch (error) {
        res.status(500).json({success: false,message: error.message})
    }
}


//Resend Verification Token
exports.resendToken = async (req, res)=>{
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) 
            return res.status(401).json({success: false, message: 'Email is not registerd'});

        if (user.isVerified) 
                return res.status(400).json({success: true, message: 'This account has already been verified. Please log in.'});

        await sendVerificationEmail(user, req, res);

    } catch (error) {
        res.status(500).json({success: false,message: error.message})
    }
}

const User = require('../models/user');
const Vedio = require('../models/vedio');
const Playlist = require('../models/playlist');

exports.vediomarkdone = async (req, res)=>{
    try {
        const {userId, vedioId} = req.body;

        const user = await User.findById(userId);

        if(!user)
            return res.status(200).json({success: false, message: 'User not found'});

        const vedio = await Vedio.findById(vedioId);

        user.vediodone.push(vedio);
        const user_ = await user.save();

        return res.status(200).json({success: true, user: user_});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

exports.vedioumarkdone = async (req, res)=>{
    try {
        const {userId, vedioId} = req.body;

        const user = await User.findById(userId);

        if(!user)
            return res.status(200).json({success: false, message: 'User not found'});

        const vedio = await Vedio.findById(vedioId);

        user.vediodone.pull(vedio);
        const user_ = await user.save();

        return res.status(200).json({success: true, user: user_});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
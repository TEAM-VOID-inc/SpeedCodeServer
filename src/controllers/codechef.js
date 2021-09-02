const {getContent, getquestions} = require('../utils/codechefextract');
const axios = require('axios');
const User = require('../models/user');


exports.getContent = async(req, res) => {
    try {
        const content = await getContent();
        res.status(200).json({success: true,content});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

exports.gettopicbyid = async (req, res) => {
    try {
        const id= req.params.id;
        const user = await User.findById(id);

        if(!user) return res.status(400).json({success: false,message: 'user not found'});

        if(user.codechefid=== undefined || user.codechefid === null)
            return res.status(400).json({success: false,message: 'Codeforcesid is null'});

        const pageid = req.query.pageid;

        const questions = await getquestions({id: pageid})
        
        const codechefdata = await axios.get(`https://competitive-coding-api.herokuapp.com/api/codechef/${user.codechefid}`);

        const objects = codechefdata?.data?.fully_solved;

        let codechefdone = [];

        for(var key in objects) {
            if(key!=="count"){
                var value = objects[key];
                codechefdone = codechefdone.concat(value);
            }
        }

        questions?.map((question, i) => {
            codechefdone?.map((data) => {
                    if(question.questionCode === data.name){
                        questions[i].done = true; 
                    }
            })
        })

        res.status(200).json({success: true,questions});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}



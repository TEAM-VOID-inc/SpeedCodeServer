const {getContent, getquestions} = require('../utils/spojextract');
const axios = require('axios');
const User = require('../models/user');


exports.getContent = async(req, res) => {
    try {
        const content = await getContent();
        res.status(200).json({success: true, content});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


exports.gettopicbyid = async (req, res) => {
    try {
        const id= req.params.id;
        const user = await User.findById(id);

        if(!user) 
            return res.status(400).json({success: false,message: 'user not found'});

        if(user.spojid=== undefined || user.spojid === null)
            return res.status(400).json({success: false,message: 'spojid is null'});

        const pageid = req.query.pageid;

        const questions = await getquestions({id: pageid})
        
        const spojquestions = await axios.get(`https://competitive-coding-api.herokuapp.com/api/spoj/${user.spojid}`);

        questions?.map((question, i) => {
            spojquestions?.data?.solved.map((d,j) => {
                    if(question.questionMainTitle === d)
                    {
                        questions[i].done = true;
                    }
            }) 
        })

        res.status(200).json({success: true, questions});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
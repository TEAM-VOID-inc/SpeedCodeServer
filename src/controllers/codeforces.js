const {getContent, getquestions} = require('../utils/codeforcesextract');
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

        if(user.Codeforcesid=== undefined || user.Codeforcesid === null)
            return res.status(400).json({success: false,message: 'Codeforcesid is null'});

        const pageid = req.query.pageid;

        const questions = await getquestions({id: parseInt(pageid)})
        
        const codeforcesquestions = await axios.get(`https://codeforces.com/api/user.status?handle=${user.Codeforcesid}&from=1`);
        const codeforcesdata = codeforcesquestions.data.result


        questions?.map((question, i) => {
            codeforcesdata?.map((data) => {
                if(data.verdict === 'OK')
                {
                    if(question.questionTitle === data.problem.name){
                        questions[i].done = true; 
                    }
                }
            })
        })

        res.status(200).json({success: true,questions, user});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}



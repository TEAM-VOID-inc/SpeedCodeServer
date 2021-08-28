const {getContent, getquestions} = require('../utils/spojextract');
const axios = require('axios');
const User = require('../models/user');

exports.gettopicbyid = async ({id, pageid}) => {
    try {
        const user = await User.findById(id);

        if(!user)
            return ({success: false,message: 'user does not exist'});

        if(user.spojid=== undefined || user.spojid === null)
            return ({success: false,message: 'spojid is null'});

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

        return ({success: false,questions});

    } catch (error) {
    }
}

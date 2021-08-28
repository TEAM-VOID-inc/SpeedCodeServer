const {getquestions} = require('../utils/codechefextract');
const axios = require('axios');
const User = require('../models/user');


exports.gettopicbyid = async ({id, pageid}) => {
    try {
        const user = await User.findById(id);

        if(!user) return ({success: false,message: 'user does not exist'});

        if(user.codechefid=== undefined || user.codechefid === null)
            return ({success: false,message: 'Codechefid is null'});


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

        return ({success: true,questions}) ;

    } catch (error) {
    }
}

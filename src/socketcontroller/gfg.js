const {gfg} = require('../utils/gfgextract');
const GFGmodel = require('../models/gfg');
const User = require('../models/user');
const GFGTopic = require('../models/gfgTopic');


exports.getGFG = async ({id}) => {
    try {
        const user = await User.findById(id);

        if(!user)
            return ({success: false,message: 'user does not exist'});

        if(user.GFGid === undefined || user.GFGid === null)
            return res.json({message: 'Enter Gfg id'});

        const articles = await gfg({GFGid : user.GFGid});

        const questions = await GFGmodel.find({}).sort('topic');

        const questionsdone = await GFGTopic.find({});

        questionsdone?.map((que, i)=>{
            questionsdone[i] = {topic : que._doc.topic , count : 0, totalcount: 0, questionsets : [], position: i}
        })

        questions?.map((question, j)=>{
            questions[j] = {...question._doc, done: false}
        });

        questionsdone.sort(function(a, b) {
            var StringA = a.topic.toUpperCase();
            var StringB = b.topic.toUpperCase();
            if (StringA  < StringB) {
                return -1;
            }
            if (StringA  > StringB) {
                return 1;
            }
            return 0;
        });


        let i=0, j=0; 

        while(i<questionsdone.length && j<questions.length)
        {
            if(questionsdone[i].topic.toUpperCase().trim() === questions[j].topic.toUpperCase().trim())
            {   let count = questionsdone[i].count;

                for(var k=0;k<articles.length;k++) 
                {   
                    if(questions[j].title.toUpperCase().trim() == articles[k].title.toUpperCase().trim()){
                        count = count+1;
                        questions[j].done = true;
                    }
                }

                if(questionsdone[i].questionsets.length > 0)
                    {
                        questionsdone[i].count = count;
                        if(questions[j].type === "practice")
                        {
                            questionsdone[i].totalcount = questionsdone[i].totalcount+1;
                        }
                        questionsdone[i].questionsets = [...questionsdone[i].questionsets, questions[j]];
                    }else{
                        questionsdone[i].count = count;

                        if(questions[j].type === "practice")
                        {
                            questionsdone[i].totalcount = questionsdone[i].totalcount+1;
                        }
                        questionsdone[i].questionsets = [questions[j]];
                    }
                j++;
            }
            else{
                i++;
            }
        }

        questionsdone.sort(function (a, b) {
            return a.position - b.position;
        });
        
        return ({success: true,questionsdone});

    } catch (error) {
    }
}


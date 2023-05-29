const { generateProposalPrompt } = require('../prompts')
const WorkSchema = require('../schema/WorkSchema')
const propAI = require('../modules/streamGpt')

exports.generatePropsal = async (req,res,next) => {
    if(req.user) {
        /**
         * Refactor
         * 1. Check user credit
         * 2. if its exhausted then return error to tell them buy
         * 3. if its available then return response
         */

        if(req.user.credits > 0) {
                
            try {
                const { workId, gig_info } = req.body;

                const work = await WorkSchema.findById(workId)
                const prompt = generateProposalPrompt(gig_info, work.workBio);

                console.log(prompt)
                // Find workBio using workId and then pas into generateProposalPrompt and generate prompt
                
                req.user.credits -= 1;
                
              await propAI(prompt, (chunk) => {
                    res.write(chunk);
              });
                // update user credits by one
              await req.user.save();
                res.end();
            } catch (err) {
                res.status(500).send({ message: 'Something went wrong, please try again later', err });
            }

        } else {
            // tell them to buy credits
              res.status(400).send({ message: 'Your credits is exhausted, please buy more' });
        }


    } else {
        res.status(404).send({ message: 'User not authenticated' });
    }
}
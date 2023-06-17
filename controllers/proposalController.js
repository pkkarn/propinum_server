const { generateProposalPrompt } = require('../prompts')
const WorkSchema = require('../schema/WorkSchema')
const {streamCompletion, customStreamCompletion} = require('../modules/streamGpt')

exports.generatePropsal = async (req,res,next) => {
    try {
        if(req.user) {
            /**
             * Refactor
             * 1. Check user credit
             * 2. if its exhausted then return error to tell them buy
             * 3. if its available then return response
             */

            console.log(req.body)
    
            if(req.user.credits > 0) {
                    const { workId, gig_info } = req.body;
    
                    const work = await WorkSchema.findById(workId)
                    const prompt = generateProposalPrompt(gig_info, work.workBio);
    
                    console.log('User credits is being used')
                    // Find workBio using workId and then pas into generateProposalPrompt and generate prompt
                    
                    req.user.credits -= 1;
                    
                  await streamCompletion(prompt, (chunk) => {
                        res.write(chunk);
                  });
                    // update user credits by one
                  await req.user.save();
                    res.end();
            } else {
                if(req.body.openaiKey) {
                    try{
                        const { workId, gig_info } = req.body;
        
                        const work = await WorkSchema.findById(workId)
                        const prompt = generateProposalPrompt(gig_info, work.workBio);
        
                        console.log('API is being used')
                        // Find workBio using workId and then pas into generateProposalPrompt and generate prompt
                      await customStreamCompletion(req.body.openaiKey, prompt, (chunk) => {
                            res.write(chunk);
                      });
                        // update user credits by one
                        res.end();
                    } catch (err) {
                        res.status(500).send({ message: 'API is invalid' });
                    }
                     
                } else {
                    res.status(400).send({ message: 'Your credits is exhausted, please buy more' });
                }
                // tell them to buy credits
            }
        } else {
            res.status(404).send({ message: 'User not authenticated' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Something went wrong, please try again later', err });
    }
    
}
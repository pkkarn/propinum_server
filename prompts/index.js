exports.generateProposalPrompt = (projectDescription, freeLancerBio) => {
    return `Write a upwork project propsal from
    Freelancer: ${freeLancerBio} for Project: ${projectDescription} \n\n
    Proposal:`
}
const AwayMessage = require('../models/awayMessage.models');

module.exports = {
    findAllAwayMessages: (req, res) => {
        AwayMessage
            .find()
            .then((allAwayMessages) => res.json(allAwayMessages))
            .catch((err) => res.status(400).json({message: 'Something went wrong while trying to view all awayMessages', error: err}))
    },

    findOneAwayMessage: (req, res) => {
        AwayMessage
            .findById(req.params.id, )
            .then((awayMessage) => res.json(awayMessage))
            .catch((err) => res.status(400).json({message: 'Something went wrong while trying to find details of a awayMessage', error: err}))
    },
    createAwayMessage: (req, res) => {
        console.log("what is away req.body", req.body)
        AwayMessage
            .create(req.body)
            .then((newAwayMessage) => res.json(newAwayMessage))
            .catch((err) =>
                res.status(400).json({message: 'Something went wrong while trying to create', error:err}))
            console.log(req.body);
    },

    updateAwayMessage: (req, res) => {
        AwayMessage
            .findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
            .then(updatedAwayMessage => res.json({updatedAwayMessage}))
            .catch((err) => res.status(400).json({message: "Something went wrong while updating.", error:err}))
    },
    
    deleteAwayMessage: (req, res) => {
        AwayMessage
            .findByIdAndDelete(req.params.id)
            .then(deletedAwayMessage => res.json({deletedAwayMessage}))
            .catch((err) => res.status(400).json({message: "Something went wrong while deleting.", error:err}));
    }
};





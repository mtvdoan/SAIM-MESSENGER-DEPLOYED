const Room = require("../models/rooms.model");

module.exports = {
    findAll: (req, res) => {
        Room.find()
            .then((allRooms) => res.json(allRooms))
            .catch((err) => res.status(400).json(err));
    },
    create: (req, res) => {
        console.log(req.body);
        Room.create(req.body)
            .then((newRoom) => res.json(newRoom))
            .catch((err) => res.status(400).json(err));
    },
    find: (req, res) => {
        Room.findById(req.params.id)
            .then((oneRoom) => res.json(oneRoom))
            .catch((err) => res.status(400).json(err));
    },
    addUser: (req, res) => {
        Room.findByIdAndUpdate(
            req.params.id,
            { $push: { membersJoined: req.body.userid } },
            { new: true }
        )
            .then((updatedRoom) => res.json(updatedRoom))
            .catch((err) => res.status(400).json(err));
    },
    removeUser: (req, res) => {
        //Note: To remove.  http://localhost:8000/api/rooms/remove/:id
        //:id is ROOM id
        //Body needs to have 'userid: 123453.."
        Room.findByIdAndUpdate(
            req.params.id,
            { $pull: { membersJoined: req.body.userid } },
            { new: true }
        )
            .then((updatedRoom) => res.json(updatedRoom))
            .catch((err) => res.status(400).json(err));
    },
    delete: async (req, res) => {
        const roomToDelete = await Room.findById(req.params.id);
        Room.findByIdAndDelete(roomToDelete._id)
            .then((deleteConfirmation) => res.json(deleteConfirmation))
            .catch((err) => res.status(400).json(err));
        console.log("You have successfully deleted your chat room.");
    },
};

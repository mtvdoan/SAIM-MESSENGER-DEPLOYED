const AwayMessageController = require('../controllers/awayMessage.controllers');
module.exports = (app) => {
    app.get('/api/awayMessages/', AwayMessageController.findAllAwayMessages);
    app.get('/api/awayMessages/:id/', AwayMessageController.findOneAwayMessage);
    app.post('/api/awayMessages/', AwayMessageController.createAwayMessage);
    app.put('/api/awayMessages/:id', AwayMessageController.updateAwayMessage);
    app.delete('/api/awayMessages/:id', AwayMessageController.deleteAwayMessage);
};
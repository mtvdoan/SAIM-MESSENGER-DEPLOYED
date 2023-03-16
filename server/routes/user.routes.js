const UserController = require("../controllers/user.controllers");
const { authenticate } = require("../config/jwt.config");
module.exports = (app) => {
    app.get("/api/users/logout", UserController.logout); //LOGOUT NEEDS TO BE ABOVE FIND
    app.get('/api/user-current', UserController.getLogged);
    app.get("/api/users/", authenticate, UserController.findAllUsers);
    app.get("/api/users/:id/", UserController.findOneUser);
    app.delete("/api/users/:id", UserController.deleteUser);
    app.post("/api/users/register", UserController.register);
    app.post("/api/users/login", UserController.login);
    app.put("/api/users/update/:id", UserController.updateUser);

};

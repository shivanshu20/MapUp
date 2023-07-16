const AppError = require("../utils/AppError");
const fs = require('fs');
const userController = require('../controllers/userController');
const userFile = fs.readFileSync('./data/users.json', 'utf-8');

const jwt = require('jsonwebtoken');

const users = JSON.parse(userFile);

const authenticateUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(new AppError('Please provide an authentication token.', 401));
        }

        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = userController.getUserById(decoded.id);

        if (!user) {
            return next(new AppError('User not found.', 404));
        }

        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}


module.exports = { authenticateUser };
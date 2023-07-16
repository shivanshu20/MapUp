const fs = require('fs');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const userController = require('./userController');
const { token } = require('morgan');

const generateJwtSignature = async(payload) => {
    console.log("SECRET KEY:", process.env.JWT_SECRET_KEY)
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}



const signup = async(req, res, next) => {
    try {
        if (!req.body) {
            return next(new AppError('Please provide a valid data', 400));
        }

        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return next(new AppError('Please provide a valid data', 400));
        }

        if (password !== confirmPassword) {
            return next(new AppError('Password and Confirm Password must be same', 400));
        }

        let user = await userController.getUserByEmail(email);

        if (user) {
            return next(new AppError('User already exist', 400));
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userController.addUser({
            email,
            password: hashedPassword
        });

        let token = await generateJwtSignature({ id: newUser.id });

        res.status(201).json({
            status: 'success',
            "accessToken": token
        });
    } catch (error) {
        next(error);
    }
}

const login = async(req, res, next) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return next(new AppError('Please provide a valid data', 400));
        }

        const { email, password } = req.body;

        // if (!email || !password) {
        //     return next(new AppError('Please provide a valid data', 400));
        // }
        const user = await userController.getUserByEmail(email);

        if (!user) {
            return next(new AppError('User not found', 401));
        }

        const isCorrectPassword = await userController.validatePassword(password, user.password);

        if (!isCorrectPassword) {
            return next(new AppError('Invalid password', 401));
        }

        let token = await generateJwtSignature({ id: user.id });
        res.status(200).json({
            status: 'success',
            "accessToken": token
        });
    } catch (error) {
        next(error);
    }
}
module.exports = { signup, login };
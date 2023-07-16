const fs = require('fs');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
// const { verify } = require('crypto');


const addUser = async (user) => {

    const users = await getAllUsers();

    const newUser = {
        id: users.length + 1,
        email: user.email,
        password: user.password
    }

    users.push(newUser);

    const writeFile = promisify(fs.writeFile);

    await writeFile('./data/users.json', JSON.stringify(users), 'utf-8');

    return newUser;
}

const getAllUsers = async() => {

    const readFile = promisify(fs.readFile);
    const userFile = await readFile('./data/users.json', 'utf-8');
    const users = JSON.parse(userFile);

    return users;
}


const getUserById = async (id) => {

    const users = await getAllUsers();

    const user = users.find(user => user.id === id);

    return user;
}

const getUserByEmail = async (email) => {

    const users = await getAllUsers();

    const user = users.find(user => user.email === email);

    return user;
}

const validatePassword = async (password, hashedPassword) => {
    const verify = await bcrypt.compare(password, hashedPassword);
    return verify;
}


module.exports = { addUser, getAllUsers, getUserById, getUserByEmail, validatePassword }
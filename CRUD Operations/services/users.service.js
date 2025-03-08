const db = require('../services/database/sqlLiteDb');
const config = require('../constants');
const { HttpError } = require('http-errors');
const { generateToken } = require('../middleware/jwtAuthentication');

function getUsers(page = 1) {
    const offset = (page - 1) * config.LIST_PER_PAGE;
    const data = db.query(sql.GET_USERS, [offset, config.LIST_PER_PAGE]);
    const meta = { page };

    return {
        data,
        meta
    }
}

function createUser({ userName, email, firstName, middleName, lastName }) {
    try {
        const data = db.run(sql.INSERT_USER, [userName, email, firstName, middleName, lastName]);
        const meta = { userName, email, firstName, middleName, lastName };
        return {
            data,
            meta
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}


function deleteUser(id) {
    const data = db.run(sql.DELETE_USER, [id]);
    const meta = { id };
    return {
        data,
        meta
    }
}

function updateUser({ userName, email, firstName, middleName, lastName }, id) {
    const data = db.run(sql.UPDATE_USER, [userName, email, firstName, middleName, lastName, id]);
    const meta = {
        id, userName, email, firstName, middleName, lastName
    }
    return {
        data,
        meta
    }
};

function login({ email }) {
    try {
        const data = db.query(sql.GET_USER_BY_EMAIL, [email]);

        if (!data || data.length === 0) {
            const error = new Error('Unauthorized: User not found');
            error.status = 401;
            throw error;
        }
        const token = generateToken(data[0])
        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const sql = {
    GET_USERS: `SELECT id,
        user_name as userName,
        email as email,
        first_name as firstName,
        middle_name as middleName,
        last_name as lastName
    FROM users
    LIMIT ?,?`,
    INSERT_USER: `INSERT INTO users 
        (user_name, email, first_name, middle_name, last_name) 
    VALUES (?,?,?,?,?)`,
    DELETE_USER: `DELETE 
        FROM users 
        WHERE id = ?`,
    UPDATE_USER: `UPDATE users
            SET user_name = ?,
            email = ?,
            first_name = ?,
            middle_name = ?,
            last_name = ?
        WHERE id = ?`,
    GET_USER_BY_EMAIL: `SELECT id,
            first_name as firstName,
            middle_name as middleName,
            last_name as lastName
        FROM users
        WHERE 
            email = ?`
}

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    login
}
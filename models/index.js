const pool = require('../database/connection')
const models = {}

//Create a new user
models.createUser = async function(username, password) {
    try {
        const sql = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *'
        const result = await pool.query(sql, [username, password])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

//Checks if user already exists in the database
models.checkUsers = async function(username) {
    try {
        const sql = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(sql, [username]);
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

//OAUTH2

//Checks if user already exists in the database using email
models.checkUsersByEmail = async function(email) {
    try {
        const sql = 'SELECT * FROM users WHERE email = $1'
        const result = await pool.query(sql, [email]);
        return result.rows[0]
    } catch {
        throw error
    }
}

//Creates a new user using the email obtained from the Google account.
models.createUserOAuth = async function (email) {
    try {
        const sql = 'INSERT INTO users (email) VALUES ($1) RETURNING *'
        const result = await pool.query(sql, [email])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

module.exports = models;
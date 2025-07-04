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

module.exports = models;
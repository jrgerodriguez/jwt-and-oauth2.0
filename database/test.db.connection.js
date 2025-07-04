const pool = require('./connection')

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()')
        if(result) {
            console.log("Successful Connection ✅")
        }
    } catch (error) {
        console.error("Connection failed ❌", error)
    }
}

testConnection()
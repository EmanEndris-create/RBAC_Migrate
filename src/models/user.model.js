const pool = require('../config/db');

exports.checkUserExists = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};
exports.getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result;
};
exports.createUser = async (username, password_hash, full_name, role) => {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, password_hash, full_name, role]
    );
    return result.rows[0];
};
exports.updateUserPassword = async (id, password_hash) => {
    const result = await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *', [password_hash, id]);
    return result;
};

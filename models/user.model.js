const db = require('../config/db');

const User = {
    findByEmail: (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    create: (name, email, password) => {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [name, email, password], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findAll: () => {
        const query = 'SELECT id, name, email, created_at FROM users';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    update: (id, name, email, hashedPassword) => {
        let query;
        let params;

        if (hashedPassword) {
            query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
            params = [name, email, hashedPassword, id];
        } else {
            query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
            params = [name, email, id];
        }

        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findById: (id) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    delete: (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};


module.exports = User;
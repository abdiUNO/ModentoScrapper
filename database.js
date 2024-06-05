const sqlite3 = require('sqlite3').verbose();

const sql = {
    createTable: `
        CREATE TABLE IF NOT EXISTS disconnected_sites (
            id TEXT PRIMARY KEY,
            notified BOOLEAN NOT NULL
        );`,
    query: `SELECT id, notified FROM disconnected_sites WHERE id = ?`,
    insert: `
        INSERT INTO disconnected_sites (id, notified)
        VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET notified = excluded.notified;`,
    delete: `DELETE FROM disconnected_sites WHERE id = ?`
};

async function connectDB() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./test.db', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

async function initDB(db) {
    return new Promise((resolve, reject) => {
        db.run(sql.createTable, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function insertSite(db, siteName, notified) {
    console.log(`Inserting site ${siteName}`)

    return new Promise((resolve, reject) => {
        db.run(sql.insert, [siteName, notified], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function querySite(db, siteName) {
    return new Promise((resolve, reject) => {
        db.get(sql.query, [siteName], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function deleteSite(db, siteName) {
    console.log(`Deleting site ${siteName}`)
    return new Promise((resolve, reject) => {
        db.run(sql.delete, [siteName], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


// (async () => {
//     try {
//         const db = await connectDB();
//         await initDB(db);


//         //delete
//         await deleteSite(db,'denver')

        
//         // Close the database connection
//         db.close((err) => {
//             if (err) {
//                 console.error(err.message);
//             }
//             console.log('Closed the database connection.');
//         });
//     } catch (error) {
//         console.error('Database operation failed:', error);
//     }
// })();

module.exports = { connectDB, initDB, insertSite, querySite,deleteSite };
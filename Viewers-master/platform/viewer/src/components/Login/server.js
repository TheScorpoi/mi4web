const express = require('express');
const app = express();

const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mi4web'
});

app.get("/testar_db", (req, res) => {
    connection.query('SELECT * FROM users', (err, rows, fields) => {
        if (err) {
            console.log(err);
            //res.sendStatus(500);
        } else {
            console.log(rows);
            //res.send(rows);
        }
    })
});


app.listen(4545, () => {
    console.log('Server started on port 4545');
});

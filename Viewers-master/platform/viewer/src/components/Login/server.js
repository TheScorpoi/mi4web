const express = require('express');
const app = express();

const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mi4web'
});

app.get("/testar_db", (req, res) => {
    connection.connect();
    console.log("lalalalalalalalal");
    connection.query('SELECT * FROM users', (err, rows, fields) => {
        if (err) {
            console.log("DEU TUDO ERRADO");
            console.log(err);
            //res.sendStatus(500);
        } else {
            console.log("DEU CERTO");
            console.log(rows);
            //res.send(rows);
        }
    })
});


app.listen(4545, () => {
    console.log('Server started on port 4545');
});

const { convertToFalseColorImage } = require('cornerstone-core');
const express = require('express');
const {mysql} = require('mysql');
const app = express();

const connection = mysql({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mi4web',
    port: 3306
});


connection.query('SELECT * FROM `mi4web.Users`', (error, results) => {
    return console.log(results);
});

app.listen(3306, () => {
    console.log('Server up on 3306');
});
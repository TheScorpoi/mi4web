const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mi4web',
  database: 'mi4web',
  port: 3306,
});

db.connect(function(error) {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log('Connected');
  }
});

app.get('/staff', (req, res) => {
  let sql_query = 'SELECT email, fullname, professional_id, hospital, type_user FROM `staff`';
  db.query(sql_query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get('/staff_delete/:id', (req, res) => {
  let sql_query = 'DELETE FROM `staff` WHERE `email` = ?';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
    //console.log("Deleted from Staff");
  });
});

app.get('/request_accept/:id', (req, res) => {
  let sql_query = 'CALL AcceptOnStaff(?)';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get('/request_accepte_update/:id', (req, res) => {
  let sql_query = 'CALL DeleteOnNotAcceptedTable (?)';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get('/request_delete/:id', (req, res) => {
  let sql_query = 'DELETE FROM `not_accepted` WHERE `email` = ?';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


app.get("/request_account", (req, res) => {
  let sql_query = 'SELECT email, fullname, professional_id, hospital, type_user FROM `not_accepted`';
  db.query(sql_query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// para por parametros para fazer where's no sql
// sqlquery .... where ${req.params.parameter_name}
app.get('/testar_insert', (req, res) => {
  let post = {
    email: 'santos@incesto.pt',
    fullname: 'Fernando Santos',
    password: '12345',
  };
  let sql_query = 'INSERT INTO `user` SET ?';
  db.query(sql_query, post, (error, results) => {
    if (error) throw error;
    res.send(results);
    //console.log(results);
  });
});

//! NO URL PARA PASSAR ESPAÇOS TEMOS DE USAR ISTO: %20 QUE É O CODIGO PARA O ESPAÇO
app.get('/testar_insert_with_params/:email/:fullname/:password', (req, res) => {
  let post = {
    email: req.params.email,
    fullname: req.params.fullname,
    password: req.params.password,
  };
  let sql_query = 'INSERT INTO `user` SET ?';
  db.query(sql_query, post, (error, results) => {
    if (error) throw error;
    res.send(results);
    //console.log(results);
  });
});

// e o app.get fica ("/testar_insert/:parameter_name", (req, res) => {
// para por parametros para fazer where's no sql
// sqlquery .... where ${req.params.parameter_name}

app.listen(3005, () => {
  console.log('Server started on port 3005');
});

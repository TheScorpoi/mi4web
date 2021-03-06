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
  host: '10.4.0.4',
  user: 'root',
  password: 'password',
  database: 'mi4web',
  port: 3306,
});

// connection to database
db.connect(function(error) {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log('Connected');
  }
});

// get all staff data (withou delicated data)
app.get('/staff', (req, res) => {
  let sql_query = 'SELECT u.email, u.fullname, s.professional_id, s.hospital, s.type_user FROM staff as s JOIN user as u ON s.email = u.email';
  db.query(sql_query, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/staff");
  });
});

//get all request accounts from not accepted table (without delicated data)
app.get("/request_account", (req, res) => {
  let sql_query = 'SELECT email, fullname, professional_id, hospital, type_user FROM `not_accepted`';
  db.query(sql_query, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/request_account");
  });
});
// delete staff user on current users admin table
app.get('/staff_delete/:id', (req, res) => {
  let sql_query = 'DELETE FROM user WHERE `email` = ?';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/staff_delete/:id");
  });
});

// accept a new staff user from request account
app.get('/request_accept/:id', (req, res) => {
  let sql_query = 'CALL AcceptOnStaff(?)';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/request_accept/:id");
  });
});

// delete a request account from not accepted table
app.get('/request_accepte_update/:id', (req, res) => {
  let sql_query = 'CALL DeleteOnNotAcceptedTable (?)';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/request_accepte_update/:id");
  });
});

// delete a request account from not accepted table
app.get('/request_delete/:id', (req, res) => {
  let sql_query = 'DELETE FROM `not_accepted` WHERE `email` = ?';
  db.query(sql_query, req.params.id, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("/request_delete/:id");
  });
});

// just realise that i have 2 endpoints that do the same thing... oh well, i not gonna change it

// get user from token
app.get("/get_user_from_token/:id", (req, res) => {
  let sql_query = 'SELECT u.fullname, s.type_user FROM staff AS s JOIN user as u ON u.email = s.email WHERE u.token = ?';
  db.query(sql_query, req.params.id , (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("get_user_from_token");
  });
});

app.get("/chart_dash", (req, res) => {
  let sql_query = 'SELECT * FROM chart_info';
  db.query(sql_query, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log("chart_dash");
  });
});

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

//! NO URL PARA PASSAR ESPA??OS TEMOS DE USAR ISTO: %20 QUE ?? O CODIGO PARA O ESPA??O
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

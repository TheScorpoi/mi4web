const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: '10.4.0.4',
  user: 'root',
  password: 'password',
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

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './../../Viewers-master/platform/ui/src/assets/');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send("I'm Alive ");
});

app.post('/upload/:study_id', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('No file received');
    return res.send({
      success: false,
    });
  } else {
    let post = [req.file.filename, req.params.study_id];
    var insertData = 'INSERT INTO store_pdf (pdf_file, study_id) VALUES (?)';
    db.query(insertData, [post], (error, results) => {
      if (error) throw error;
      res.send(results);
    });
  }
});

app.get('/get_report/:studyId', (req, res) => {
  var sql_query = 'SELECT pdf_file FROM store_pdf WHERE study_id = ?';
  let studyId = req.params.studyId;
  db.query(sql_query, studyId, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});

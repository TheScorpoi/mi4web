const express = require('express');
const app = express();
const multer = require('multer');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use(express.static(__dirname + '/uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File is uploaded');
    res.sendStatus(200);
});

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});
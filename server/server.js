// '/' directory

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const api = require('./routes/api');

const app = express();

const port = process.env.PORT || 3001;


app.use(express.json()); // Express v4.16.0 기준 built-in body-parser 포함
app.use(express.urlencoded({extend:true}));
app.use(cors());
app.use(cookieParser());

app.use('/api', api);
app.listen(port, () => {
    console.log(`express is running on ${port}`);
});
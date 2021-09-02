// '/' directory

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const api = require('./routes/api');

const app = express();

const port = process.env.PORT || 3001;

// const {sequelize}=require('./database/models');

app.use(express.json()); // Express v4.16.0 기준 built-in body-parser 포함
app.use(express.urlencoded({extend:true}));
app.use(cors());
app.use(cookieParser());

// sequelize.sync({force:true}).then(()=>{//실행할때마다 생성쿼리 실행(업데이트 시 사용)
//     console.log('연결 성공');
// })

app.use('/api', api);

app.listen(port, () => {
    console.log(`express is running on ${port}`);
});
var mysql = require('mysql');
const dotenv = require('dotenv');
const axios = require('axios')



dotenv.config();
//console.log(process.env.REACT_APP_BACKEND_URL);
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  //console.log("Connected!");
});
const api = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL,
	withCredentials: true,
});

con.query('SELECT * FROM programatedMessages',function(err,results,fields){
  if (err) throw err;

  results.forEach(element => {
    let values = {
                
      wpId:element.wpid,
      num:element.phoneNumber,
      msg: element.message
  }
  
  api.post("/messagesend", {
     values
    })
    .then(res => {
      //console.log(`statusCode: ${res.status}`)
      //console.log(res)
    })
    .catch(error => {
      console.error(error)
    })
  });
})
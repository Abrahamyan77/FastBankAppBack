const {Client} = require('pg');

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();
//path.resolve()
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;


const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '093334395',
    database: 'demoDB'
})

client.connect();


// client.query(`Select * from realestatedata`, (err, res) =>{
//     if(!err){
//         console.log(res.rows);
//     }else{
//         console.log(err.message);
        
//     }
//     client.end;
// })

client.query(`Select product from realestatedata`, (err, res) =>{
    if(!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
        
    }
    client.end;
})

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});





// app.get("/demoDB", (req, res) => {
//   const sql = "SELECT * FROM realestatedata";
//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Server error" }); // <--- return stops execution
//     }
    
//     res.json(result);
    
//   });
// });
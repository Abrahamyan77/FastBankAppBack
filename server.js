const { Client } = require('pg');
const express = require("express");
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



app.listen(port, () => {
  console.log(`listening on port ${port} `);
});



// app.get("/demoDB", (req, res) => {
//   client.query("SELECT * FROM realestatedata", (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//       res.json(result.rows);
//   });
// });


app.get("/demoDB", (req, res) => {
  const query = `
    SELECT 
      id,
      applicationid,
      clientid,
      branch,
      product,
      status,
      TO_CHAR(applicationdate, 'YYYY-MM-DD') AS applicationdate,
      TO_CHAR(finaldecisiondate, 'YYYY-MM-DD') AS finaldecisiondate,
      TO_CHAR(phase1_start, 'YYYY-MM-DD') AS phase1_start,
      TO_CHAR(phase1_end, 'YYYY-MM-DD') AS phase1_end,
      TO_CHAR(phase2_start, 'YYYY-MM-DD') AS phase2_start,
      TO_CHAR(phase2_end, 'YYYY-MM-DD') AS phase2_end,
      TO_CHAR(phase3_start, 'YYYY-MM-DD') AS phase3_start,
      TO_CHAR(phase3_end, 'YYYY-MM-DD') AS phase3_end
    FROM realestatedata
  `;

  client.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
});

app.get("/product", (req, res) => {
  client.query("SELECT product FROM realestatedata", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
      res.json(result.rows);
  });
});

// app.get("/demoDB", (req, res) => {
//   client.query("SELECT product FROM realestatedata", (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//       res.json(result.rows);
//   });
// });



// app.post("/add_user", (req, res) => {
//   const sql =
//     "INSERT INTO student_details (`name`,`email`,`age`,`gender`) VALUES (?, ?, ?, ?)";
//   const values = [req.body.name, req.body.email, req.body.age, req.body.gender];
//   db.query(sql, values, (err, result) => {
//     if (err)
//       return res.json({ message: "Something unexpected has occured" + err });
//     return res.json({ success: "Student added successfully" });
//   });
// });

// app.get("/students", (req, res) => {
//   const sql = "SELECT * FROM student_details";
//   db.query(sql, (err, result) => {
//     if (err) res.json({ message: "Server error" });
//     return res.json(result);
//   });
// });

// app.get("/get_student/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM student_details WHERE `id`= ?";
//   db.query(sql, [id], (err, result) => {
//     if (err) res.json({ message: "Server error" });
//     return res.json(result);
//   });
// });

// app.post("/edit_user/:id", (req, res) => {
//   const id = req.params.id;
//   const sql =
//     "UPDATE student_details SET `name`=?, `email`=?, `age`=?, `gender`=? WHERE id=?";
//   const values = [
//     req.body.name,
//     req.body.email,
//     req.body.age,
//     req.body.gender,
//     id,
//   ];
//   db.query(sql, values, (err, result) => {
//     if (err)
//       return res.json({ message: "Something unexpected has occured" + err });
//     return res.json({ success: "Student updated successfully" });
//   });
// });

// app.delete("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "DELETE FROM student_details WHERE id=?";
//   const values = [id];
//   db.query(sql, values, (err, result) => {
//     if (err)
//       return res.json({ message: "Something unexpected has occured" + err });
//     return res.json({ success: "Student updated successfully" });
//   });
// });

// app.listen(port, () => {
//   console.log(`listening on port ${port} `);
// });

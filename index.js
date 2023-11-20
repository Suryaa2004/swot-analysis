const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'suryaa',
  database: 'company',
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Signup route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log('Error inserting user:', err);
      res.send('Error signing up');
    } else {
      res.render('index');
    }
  });
});

// Login route
// app.get('/login', (req, res) => {
//   res.render('login');
// });

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log('Error querying user:', err);
      res.send('Error logging in');
    } else {
      if (results.length > 0) {
        res.redirect('/home');
      } else {
        res.send('Invalid email or password');
      }
    }
  });
});

// Home route
app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/quote', (req, res) => {
  res.render('quote');
});

app.get('/form', (req, res) => {
  res.render('form');
});
app.get('/result', (req, res) => {
  res.render('result');
});
app.get('/strength', (req, res) => {
  res.render('strength');
});

app.post('/result', (req, res) => {
  const strengths = req.body['strengthsMarks'];
  const weaknesses = req.body['weaknessesMarks'];
  const opportunities = req.body['opportunitiesMarks'];
  const threats = req.body['threatsMarks'];
  const orgName = req.body['org'];
  console.log(orgName);

  // Check if weaknesses are greater than strengths
  const isWeaknessGreater = weaknesses > strengths;

  const query = 'INSERT INTO result (orgName, strength, Weakness, opportunities, threats) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [orgName, strengths, weaknesses, opportunities, threats], (err, results) => {
    if (err) {
      console.log('Error inserting user:', err);
      res.send('Error signing up');
    } else {
      // Conditional rendering based on weaknesses vs strengths
      if (isWeaknessGreater) {
        res.render('result', {
          
          strengths,
          weaknesses,
          opportunities,
          threats,
        });
      } else {
        res.render('strength', {
          
          strengths,
          weaknesses,
          opportunities,
          threats,
        });
      }
    }
  });
});


app.post("/submit",(req,res)=>{
  const { orgName, chairpersonName,numEmployees,yearlyTurnover,numBranches } = req.body;
  const query = 'INSERT INTO data (orgName, chairpersonName,numEmployees,yearlyTurnover,numBranches) VALUES (?, ?,?,?,?)';
  db.query(query, [orgName, chairpersonName,numEmployees,yearlyTurnover,numBranches], (err, results) => {
    if (err) {
      console.log('Error inserting user:', err);
      res.send('Error signing up');
    } else {
      res.render('form',{
        orgName,

      });
    }
  });


});

app.get("/report",(req,res)=>{
  res.render('report');
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/final', (req, res) => {
  const query = 'SELECT * FROM data';
  db.query(query, (err, data) => {
      if (err) {
          console.error('Error fetching data from MySQL:', err);
      } else {
          res.render('dashboard', { data });
      }
  });
});

app.get("/dashboard",(req,res)=>{
  res.render('dashboard')
})

app.get("/report",(req,res)=>{
  res.render('report');
})
app.get("/score",(req,res)=>{
  res.render('score');
})

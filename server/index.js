const express = require('express')
const users = require('./sample-data.json')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors');
dotenv.config({path : path.join(__dirname, 'config', 'config.env')})

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Only allow requests from this origin
  }));

// all users
app.get("/users",(req,res) => {
    return res.json(users);

})

app.listen(process.env.PORT, (err)=> {
    if (err) {
        console.error(`Error starting the server: ${err}`);
    } else {
        console.log(`App is running on port ${process.env.PORT}`);
    }
    // console.log(`App is running in port ${process.env.PORT}`)
})
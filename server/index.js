const express = require('express')
const users = require('./sample-data.json')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors');
const fs = require('fs')
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') })

const app = express()
app.use(express.json())

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Only allow requests from this origin
}));

// all users
app.get("/users", (req, res) => {
    return res.json(users);

})

// delete user
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id)
    const filteredUsers = users.filter((user) => user.id !== id)
    fs.writeFile("./sample-data.json", JSON.stringify
        (filteredUsers), (err, data) => {
            if (err) {
                console.error("Error writing to file", err);
                return res.status(500).send("Internal Server Error");
            }
            return res.json(filteredUsers)
        })
})

// Add  user
app.post("/users", (req, res) => {
    let { name, age, city } = req.body
    if (!name || !age || !city) {
        res.status(400).send({ message: "All feilds are required!" })
        return;
    }
    // let id = Date.now();
    let userIdCounter = Math.max(...users.map(user => user.id), 0) + 1;
    let id = userIdCounter++;
    users.push({ id, name, age, city })

    fs.writeFile("./sample-data.json",
        JSON.stringify(users), (err) => {
            if (err) {
                console.error("Error writing to file", err);
                return res.status(500).send("Internal Server Error");
            }
            return res.json({ "message": "user details added successfully" })
        })

    // return res.json({ "message": "user details added successfully" })
})


// update user
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id)
    let { name, age, city } = req.body
    if (!name || !age || !city) {
        res.status(400).send({ message: "All feilds are required!" })
        return;
    }

    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
        return res.status(404).send({ message: "User with ID not found!" })
    }
    users[userIndex] = { ...req.body, id };
    // users.splice(index, 1, { ...req.body })
    // users.push({ id, name, age, city })

    fs.writeFile("./sample-data.json",
        JSON.stringify(users), (err) => {
            if (err) {
                console.error("Error writing to file", err);
                return res.status(500).send("Internal Server Error");
            }
            return res.json({ "message": "user details updated successfully" })
        })

    // return res.json({ "message": "user details added successfully" })
})


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error(`Error starting the server: ${err}`);
    } else {
        console.log(`App is running on port ${process.env.PORT}`);
    }
    // console.log(`App is running in port ${process.env.PORT}`)
})
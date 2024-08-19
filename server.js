// DotENV
require('dotenv').config()
// cors
const cors = require('cors')

// Bring in Express
const express = require('express');
// set a variable of app to run the express method
const mongoose = require('mongoose');
// set a port - listen changes on the port
const app = express();
// mongoose:
const port = 4000;

//allow cross origin
app.use(cors());

// import routes
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comments')

// use json with express
app.use(express.json());

// log out path and method of each request:
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Attach the routes to the app
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/comments', commentRoutes)
// Serve Static files
app.use('/public/uploads', express.static('public/uploads'))

const mongoUsername = process.env.MONGODB_USERNAME
const mongoPassword = process.env.MONGODB_PASSWORD

const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.rihw5cu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Define the home route for the backend
app.get('/', (req, res) => {
    // what happens at the route
    res.send("Hello, this is your express server")
})

// Listen to changes
app.listen(port, () => {
    console.log(`Express Server is running on http://localhost:${port}`);
})

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting MongoDB Atlas', err)
    });
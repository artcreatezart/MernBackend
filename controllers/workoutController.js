// import the model
const Workout = require('../models/workoutModel')
// import mongoose 
const mongoose = require('mongoose')

// GET All workouts
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).populate({
            path: 'comments',
            model: 'Comment'
        }).sort({createdAt: -1})
        res.status(200).json(workouts)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

// GET one Workout
const getWorkout = async (req, res) => {
    // Get id from request params
    const {id} = req.params;

    // Checking if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    try {
        // find the workout, populate the comments array with the comment document
        const workout = await Workout.findById(id).populate({
            path: 'comments',
            model: 'Comments' // reference the comments model
        })

        // if no workout found show an error
        if(!workout) {
        return res.status(404).json({error: 'No such workout'});
        }

         // otherwsie return the workout found
        res.status(200).json(workout)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})

    }

}

// CREATE workout
const createWorkout = async (req, res) => {
    const {title, load, reps, user_id} = req.body

    // get the uploaded image filename from the req.file object
    const imageFilename = req.file ? req.file.filename : null;

    // add doc to db
    try {
        const workout = await Workout.create({
            title, 
            load, 
            reps, 
            user_id,
            image: imageFilename
        })
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
    
}

const deleteWorkout = async (req, res) => {
    // get the id from the request parameters - just getting the id
    const {id} = req.params;
    // if it is not valid
    // Check if id is valid mongo valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    } 

    // if it is valid - find and delete
    const workout = await Workout.findOneAndDelete({_id: id})

    //  if id is valid but no workout found
    if (!workout) {
        return res.status(404).json({error: 'No such workout'});
    }

    // if it successfully finds and deletes:
    res.status(200).json(workout);
}

// UPDATE Workout
const updateWorkout = async (req, res) => {
    const {id} = req.params

    // Check if mongo id is valid 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    } 

    /** Find a workout by its id
     * if it finds it then
     * spread out properties of the workout
     * edit/change what it recives
     * - that comes from the request body
     */
    const workout = await Workout.findOneAndUpdate(
        {_id: id}, 
        {...req.body}, 
        {new: true}
        )

    // If no workout
    if (!workout) {
        return res.status(404).json({error: 'No such workout'});
    }

    // if it successfully finds and deletes:
    res.status(200).json(workout);




}

module.exports = {getWorkouts, getWorkout, createWorkout, deleteWorkout, updateWorkout}
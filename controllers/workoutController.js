// import the model
const Workout = require('../models/workoutModel')
// import mongoose 
const mongoose = require('mongoose')

// GET All workouts
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({}).sort({createdAt: -1})
    res.status(200).json(workouts)
}

// GET one Workout
const getWorkout = async (req, res) => {
    // Get id from request params
    const {id} = req.params;

    // Checking if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    // if it is valid find and get 
    const workout = await Workout.findById(id);

    // Valid but no workout found
    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    // if it successfully finds and gets: 
    res.status(200).json(workout + 'successfully gotten')

}

// CREATE workout
const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body

    // add doc to db
    try {
        const workout = await Workout.create({title, load, reps})
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
    res.status(200).json(workout + 'successfully deleted');
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

    // If successfull Return the updated workout
    res.status(200).json(workout)



}

module.exports = {getWorkouts, getWorkout, createWorkout, deleteWorkout, updateWorkout}
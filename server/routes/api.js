const express = require('express');
const router = express.Router();
const {
    User,
    Task
} = require('../storage/schema.js');


// TODO(saumeel): handle validation errors and not found errors;

// @AuthRequired
router.get("/task", async (req, res) => {
    const tasks = await Task.find({ userId: req.user._id});
    res.json(tasks);
});


// @AuthRequired
router.post('/task', async (req, res) => {
    console.log(req.body);
    const newTask = await new Task({
        description: req.body.description,
        userId: req.user._id,
        completed: false,
        timeSpent: 0,
        parentTask: null
    }).save();
    res.json(newTask);
});

// @AuthRequired
router.delete('/task/:id', async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json(deletedTask);
});

// @AuthRequired. Only mutable field is completed.
router.put('/task/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    const updatedTask = req.body.task;
    task.completed = updatedTask.completed;
    task.timeSpent = updatedTask.timeSpent;
    res.json(await task.save());
});

const userTaskTimers = {};
// @AuthRequired
router.post('/task/:id/start', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (userTaskTimers[req.user.email]) {
        userTaskTimers[req.user.email] = {};
    }
    else {
        userTaskTimers[req.user.email][req.params.id] = new Date().getTime;
    }
});

// @AuthRequired
router.post('/task/:id/stop', async (req, res) => {
    const task = await Task.findById(req.params.id);
    const timeElapsed = new Date().getTime() - userTaskTimers[req.user.email][req.params.id];
    task.timeSpent += timeElapsed;
    await task.save();
    userTaskTimers[req.user.email][req.params.id] = 0;
});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

module.exports = router;
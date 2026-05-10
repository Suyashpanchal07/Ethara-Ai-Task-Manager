const Task = require("../models/Task");


// ==============================
// CREATE TASK
// ==============================

const createTask = async (req, res) => {

  try {

    const {

      title,
      description,
      project,
      priority,
      dueDate,

    } = req.body;


    const task = await Task.create({

      title,
      description,
      project,
      priority,
      dueDate,

    });


    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// GET TASKS
// ==============================

const getTasks = async (req, res) => {

  try {

    const tasks = await Task.find()
      .populate("project")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// UPDATE TASK STATUS
// ==============================

const updateTask = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );

    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });
    }


    task.status =
      req.body.status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {

  createTask,
  getTasks,
  updateTask,

};
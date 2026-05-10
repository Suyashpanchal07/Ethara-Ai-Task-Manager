const express = require("express");

const Task = require("../models/Task");

const Project = require("../models/Project");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================
// CREATE TASK
// ======================================

router.post(
  "/",
  protect,

  async (req, res) => {

    try {

      const {
        title,
        description,
        project,
        assignedTo,
        priority,
        dueDate,
      } = req.body;

      const taskProject =
        await Project.findById(project);

      if (!taskProject) {

        return res.status(404).json({
          message: "Project not found",
        });
      }


      const finalAssignedTo =
        req.user.role === "admin"
          ? assignedTo
          : req.user._id.toString();


      if (!finalAssignedTo) {

        return res.status(400).json({
          message: "Assigned member is required",
        });
      }


      if (!dueDate) {

        return res.status(400).json({
          message: "Task deadline is required",
        });
      }


      if (
        !taskProject.members.some(
          (memberId) =>
            memberId.toString() ===
            finalAssignedTo
        )
      ) {

        return res.status(400).json({
          message:
            "Assigned member must be added to the project first",
        });
      }


      if (
        req.user.role !== "admin" &&
        !taskProject.members.some(
          (memberId) =>
            memberId.toString() ===
            req.user._id.toString()
        )
      ) {

        return res.status(403).json({
          message:
            "You can only add tasks to your assigned projects",
        });
      }


      const task = await Task.create({

        title,
        description,
        project,
        assignedTo: finalAssignedTo,
        priority,
        dueDate,

        status: "pending",

        createdBy: req.user.id,

      });


      const populatedTask =
        await Task.findById(task._id)

          .populate(
            "assignedTo",
            "name email"
          )

          .populate(
            "project",
            "title deadline"
          )

          .populate(
            "submittedBy",
            "name email"
          );


      res.status(201).json(
        populatedTask
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ======================================
// GET TASKS
// ======================================

router.get(
  "/",
  protect,

  async (req, res) => {

    try {

      let tasks;


      // ADMIN SEES ALL TASKS

      if (req.user.role === "admin") {

        tasks = await Task.find();

      } else {

        // MEMBER SEES ONLY OWN TASKS

        const projects = await Project.find({
          members: req.user._id,
        }).select("_id");

        const projectIds = projects.map(
          (project) => project._id
        );

        tasks = await Task.find({
          assignedTo: req.user.id,
          project: {
            $in: projectIds,
          },
        });
      }


      tasks = await Task.populate(
        tasks,

        [
          {
            path: "assignedTo",
            select: "name email",
          },

          {
            path: "project",
            select: "title deadline",
          },

          {
            path: "createdBy",
            select: "name",
          },

          {
            path: "submittedBy",
            select: "name email",
          },
        ]
      );


      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ======================================
// UPDATE TASK STATUS
// ======================================

router.put(
  "/:id",
  protect,

  async (req, res) => {

    try {

      const task = await Task.findById(
        req.params.id
      );

      if (!task) {

        return res.status(404).json({
          message: "Task not found",
        });
      }


      if (
        req.user.role !== "admin" &&
        task.assignedTo?.toString() !==
          req.user._id.toString()
      ) {

        return res.status(403).json({
          message: "You can only submit your own tasks",
        });
      }


      if (
        req.user.role !== "admin" &&
        req.body.status &&
        ![
          "pending",
          "in-progress",
          "completed",
        ].includes(req.body.status)
      ) {

        return res.status(403).json({
          message: "Invalid task status",
        });
      }


      const previousStatus = task.status;

      if (req.body.status) {

        task.status = req.body.status;
      }


      if (
        req.body.status === "completed" &&
        previousStatus !== "completed" &&
        req.user.role !== "admin"
      ) {

        task.submittedBy = req.user.id;

        task.submittedAt = new Date();

        task.adminSeen = false;
      }


      if (
        typeof req.body.adminSeen === "boolean" &&
        req.user.role === "admin"
      ) {

        task.adminSeen = req.body.adminSeen;
      }


      const updatedTask =
        await task.save();


      const populatedTask =
        await Task.findById(updatedTask._id)

          .populate(
            "assignedTo",
            "name email"
          )

          .populate(
            "project",
            "title deadline"
          )

          .populate(
            "createdBy",
            "name"
          )

          .populate(
            "submittedBy",
            "name email"
          );


      res.json(populatedTask);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ======================================
// DELETE TASK
// ======================================

router.delete(
  "/:id",

  protect,

  authorizeRoles("admin"),

  async (req, res) => {

    try {

      const task = await Task.findById(
        req.params.id
      );

      if (!task) {

        return res.status(404).json({
          message: "Task not found",
        });
      }


      await task.deleteOne();


      res.json({
        message:
          "Task deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;

const express = require("express");

const Project = require("../models/Project");

const Task = require("../models/Task");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================
// CREATE PROJECT
// ADMIN ONLY
// ======================================

router.post(
  "/",
  protect,
  authorizeRoles("admin"),

  async (req, res) => {

    try {

      const {

        title,
        description,
        deadline,
        members,

      } = req.body;

      if (!deadline) {

        return res.status(400).json({
          message: "Project deadline is required",
        });
      }


      if (!members || members.length === 0) {

        return res.status(400).json({
          message:
            "Add at least one member to the project",
        });
      }


      const project = await Project.create({

        title,
        description,
        deadline,
        members: members || [],

        createdBy: req.user.id,

      });


      res.status(201).json(project);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ======================================
// GET ALL PROJECTS
// ======================================

router.get(
  "/",
  protect,

  async (req, res) => {

    try {

      const query =
        req.user.role === "admin"
          ? {}
          : {
              members: req.user._id,
            };


      const projects = await Project.find(query)

        .populate(
          "createdBy",
          "name email"
        )

        .populate(
          "members",
          "name email"
        )

        .sort({
          createdAt: -1,
        });


      res.json(projects);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ======================================
// DELETE PROJECT
// ADMIN ONLY
// ======================================

router.delete(
  "/:id",

  protect,

  authorizeRoles("admin"),

  async (req, res) => {

    try {

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({
          message: "Project not found",
        });
      }


      // DELETE ALL PROJECT TASKS

      await Task.deleteMany({
        project: project._id,
      });


      // DELETE PROJECT

      await project.deleteOne();


      res.json({
        message:
          "Project and related tasks deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
  type: String,
  enum: ["pending", "in-progress", "completed", "done"],
  default: "pending",
},

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    submittedAt: {
      type: Date,
    },

    adminSeen: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);

import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";


function ProjectDetailsModal({

  project,
  tasks,
  fetchTasks,
  closeModal,
  user,

}) {

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const isCompleted = (task) =>
    task.status === "completed" ||
    task.status === "done";


  // ==========================
  // PROJECT TASKS
  // ==========================

  const projectTasks = tasks.filter(
    (task) =>
      task.project?._id === project._id
  );


  const completedTasks =
    projectTasks.filter(
      isCompleted
    );


  const progress =
    projectTasks.length > 0
      ? Math.round(
          (completedTasks.length /
            projectTasks.length) *
            100
        )
      : 0;


  // ==========================
  // CREATE TASK
  // ==========================

  const createTask = async (e) => {

    e.preventDefault();

    try {

      await API.post("/tasks", {

        ...taskData,

        project: project._id,

        assignedTo:
          user?.role === "admin"
            ? taskData.assignedTo
            : user?._id,

      });

      toast.success("Task created");

      fetchTasks();

      setTaskData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });

    } catch (error) {

      toast.error("Failed to create task");
    }
  };


  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateTaskStatus = async (
    taskId,
    newStatus
  ) => {

    try {

      await API.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      toast.success(
        newStatus === "completed"
          ? "Task submitted"
          : "Task updated"
      );

      fetchTasks();

    } catch (error) {

      toast.error("Failed to update task");
    }
  };


  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">

      <div className="w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-[#0F172A] border border-slate-800 rounded-2xl p-6">

        {/* HEADER */}

        <div className="flex justify-between items-start mb-6 gap-4">

          <div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-2">

              {project.title}

            </h1>

            <p className="text-slate-400">

              {project.description}

            </p>

          </div>


          <button
            onClick={closeModal}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
          >

            Close

          </button>

        </div>


        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


          {/* TOTAL */}

          <div className="bg-slate-900 p-4 rounded-xl">

            <p className="text-slate-400 mb-2">

              Total Tasks

            </p>

            <h2 className="text-4xl font-bold">

              {projectTasks.length}

            </h2>

          </div>


          {/* COMPLETED */}

          <div className="bg-slate-900 p-4 rounded-xl">

            <p className="text-slate-400 mb-2">

              Completed

            </p>

            <h2 className="text-4xl font-bold text-green-400">

              {completedTasks.length}

            </h2>

          </div>


          {/* PROGRESS */}

          <div className="bg-slate-900 p-4 rounded-xl">

            <p className="text-slate-400 mb-2">

              Progress

            </p>

            <h2 className="text-4xl font-bold text-blue-400">

              {progress}%

            </h2>

          </div>

        </div>


        {/* PROGRESS BAR */}

        <div className="mb-6">

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

            <div
              style={{
                width: `${progress}%`,
              }}
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            ></div>

          </div>

        </div>


        {/* ADD TASK */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

          <h2 className="text-2xl font-bold mb-5">

            Add Task

          </h2>


          <form
            onSubmit={createTask}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                })
              }
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 outline-none"
              required
            />


            <textarea
              placeholder="Task Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 outline-none h-24"
            ></textarea>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {user?.role === "admin" && (

                <select
                  value={taskData.assignedTo}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      assignedTo: e.target.value,
                    })
                  }
                  className="bg-[#0F172A] border border-slate-700 rounded-xl p-3 outline-none"
                  required
                >

                  <option value="">

                    Assign Member

                  </option>

                  {(project.members || []).map((member) => (

                    <option
                      key={member._id}
                      value={member._id}
                    >

                      {member.name}

                    </option>

                  ))}

                </select>

              )}

              <select
                value={taskData.priority}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    priority: e.target.value,
                  })
                }
                className="bg-[#0F172A] border border-slate-700 rounded-xl p-3 outline-none"
              >

                <option value="low">

                  Low Priority

                </option>

                <option value="medium">

                  Medium Priority

                </option>

                <option value="high">

                  High Priority

                </option>

              </select>


              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    dueDate: e.target.value,
                  })
                }
                className="bg-[#0F172A] border border-slate-700 rounded-xl p-3 outline-none"
                required
              />

            </div>


            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-xl font-semibold"
            >

              Add Task

            </button>

          </form>

        </div>


        {/* TASKS */}

        <div>

          <h2 className="text-3xl font-bold mb-5">

            Project Tasks

          </h2>


          <div className="space-y-4">

            {projectTasks.length === 0 ? (

              <p className="text-slate-500">

                No tasks available.

              </p>

            ) : (

              projectTasks.map((task) => (

                <div
                  key={task._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                >

                  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">

                    <div>

                      <h3 className="text-2xl font-semibold mb-2">

                        {task.title}

                      </h3>

                      <p className="text-slate-400">

                        {task.description}

                      </p>

                    </div>


                    <span className={`px-5 py-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>

                      {task.priority}

                    </span>

                  </div>


                  <div className="flex justify-between items-center flex-wrap gap-4">

                    <div className="text-slate-500">

                      Due:
                      {" "}
                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "No due date"}

                    </div>


                    {/* STATUS */}

                    {user?.role === "admin" ||
                    !isCompleted(task) ? (

                      <select
                        value={
                          isCompleted(task)
                            ? "completed"
                            : task.status
                        }
                        onChange={(e) =>
                          updateTaskStatus(
                            task._id,
                            e.target.value
                          )
                        }
                        className="bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2 outline-none"
                      >

                        <option value="pending">

                          Pending

                        </option>

                        <option value="in-progress">

                          In Progress

                        </option>

                        <option value="completed">

                          Completed

                        </option>

                      </select>

                    ) : (

                      <span className="rounded-xl bg-green-500/20 px-4 py-2 font-semibold text-green-400">

                        Completed

                      </span>

                    )}

                  </div>

                </div>

              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetailsModal;

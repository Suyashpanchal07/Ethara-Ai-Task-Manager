import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

import CreateTaskModal from "../components/CreateTaskModal";


function TasksPage({

  tasks,
  projects,
  user,
  fetchTasks,

}) {

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const isCompleted = (task) =>
    task.status === "completed" ||
    task.status === "done";

  const today = new Date();

  today.setHours(0, 0, 0, 0);


  // ==========================
  // UPDATE TASK STATUS
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

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

        <div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">

            Tasks

          </h1>

          <p className="text-slate-400">

            Manage all project tasks.

          </p>

        </div>


        {/* ADD TASK */}

        {user?.role === "admin" && (

          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all"
          >

            + Add Task

          </button>

        )}

      </div>


      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">

        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 outline-none"
        >

          <option value="all">All Statuses</option>

          <option value="pending">Pending</option>

          <option value="in-progress">In Progress</option>

          <option value="completed">Completed</option>

          <option value="overdue">Overdue</option>

        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 outline-none"
        >

          <option value="all">All Priorities</option>

          <option value="high">High Priority</option>

          <option value="medium">Medium Priority</option>

          <option value="low">Low Priority</option>

        </select>

      </div>


      {/* EMPTY STATE */}

      {projects.length === 0 ? (

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center">

          <h2 className="text-3xl font-bold mb-3">

            No Projects Found

          </h2>

          <p className="text-slate-400">

            Create a project first to manage tasks.

          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {projects.map((project) => {

            const projectTasks = tasks.filter(
              (task) =>
                task.project?._id === project._id
            );

            const filteredProjectTasks =
              projectTasks.filter((task) => {

                const dueDate = task.dueDate
                  ? new Date(task.dueDate)
                  : null;

                if (dueDate) {

                  dueDate.setHours(0, 0, 0, 0);
                }

                const isOverdue =
                  dueDate &&
                  dueDate < today &&
                  !isCompleted(task);

                const normalizedStatus = isCompleted(task)
                  ? "completed"
                  : task.status;

                const matchesSearch =
                  task.title
                    ?.toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    ) ||
                  task.description
                    ?.toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    ) ||
                  project.title
                    ?.toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    );

                const matchesStatus =
                  statusFilter === "all" ||
                  (statusFilter === "overdue"
                    ? isOverdue
                    : normalizedStatus ===
                      statusFilter);

                const matchesPriority =
                  priorityFilter === "all" ||
                  task.priority === priorityFilter;

                return (
                  matchesSearch &&
                  matchesStatus &&
                  matchesPriority
                );
              });


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


            return (

              <div
                key={project._id}
                className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5"
              >

                {/* PROJECT HEADER */}

                <div className="flex justify-between items-center mb-5 flex-wrap gap-4">

                  <div>

                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">

                      {project.title}

                    </h2>

                    <p className="text-slate-400">

                      {project.description}

                    </p>

                  </div>


                  {/* PROJECT STATS */}

                  <div className="bg-slate-900 px-4 py-3 rounded-xl">

                    <p className="text-slate-400 text-sm mb-1">

                      Progress

                    </p>

                    <h3 className="text-2xl font-bold">

                      {progress}%

                    </h3>

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


                {/* TASK LIST */}

                {filteredProjectTasks.length === 0 ? (

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center">

                    <h3 className="text-xl font-bold mb-2">

                      No Tasks Yet

                    </h3>

                    <p className="text-slate-500">

                      No tasks match this view.

                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {filteredProjectTasks.map((task) => (

                      <div
                        key={task._id}
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-5"
                      >

                        {/* TOP */}

                        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">

                          <div>

                            <h3 className="text-2xl font-semibold mb-2">

                              {task.title}

                            </h3>

                            <p className="text-slate-400">

                              {task.description}

                            </p>

                          </div>


                          {/* PRIORITY */}

                          <span className={`px-5 py-2 rounded-full text-sm ${
                            task.priority === "high"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}>

                            {task.priority}

                          </span>

                        </div>


                        {/* FOOTER */}

                        <div className="flex justify-between items-center flex-wrap gap-4">

                          <div>

                            <p className="text-slate-500 mb-1">

                              Due Date

                            </p>

                            <p className="font-semibold">

                              {task.dueDate
                                ? new Date(
                                    task.dueDate
                                  ).toLocaleDateString()
                                : "No due date"}

                            </p>

                            {(() => {

                              const dueDate = task.dueDate
                                ? new Date(
                                    task.dueDate
                                  )
                                : null;

                              if (dueDate) {

                                dueDate.setHours(
                                  0,
                                  0,
                                  0,
                                  0
                                );
                              }

                              const isOverdue =
                                dueDate &&
                                dueDate < today &&
                                !isCompleted(task);

                              return isOverdue ? (

                                <p className="mt-2 text-sm text-red-400">

                                  Overdue

                                </p>

                              ) : null;
                            })()}

                          </div>


                          {/* STATUS */}

                          <div className="text-right">

                            <p className="text-slate-500 mb-1">

                              Status

                            </p>

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
                                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none"
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

                              <span className="inline-flex rounded-xl bg-green-500/20 px-4 py-2 font-semibold text-green-400">

                                Completed

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>
            );
          })}

        </div>

      )}


      {/* TASK MODAL */}

      {showTaskModal && (

        <CreateTaskModal
  closeModal={() =>
    setShowTaskModal(false)
  }
  fetchTasks={fetchTasks}
  projects={projects}
  user={user}
/>

      )}

    </div>
  );
}

export default TasksPage;

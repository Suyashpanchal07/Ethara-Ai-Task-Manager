import { useEffect, useRef, useState } from "react";

import API from "../services/api";

import {

  FaTasks,
  FaFolderOpen,
  FaCheckCircle,
  FaSignOutAlt,
  FaClock,
  FaExclamationTriangle,
  FaUsers,

} from "react-icons/fa";

import toast, { Toaster } from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import ProjectsPage from "./ProjectsPage";

import TasksPage from "./TasksPage";


function Dashboard() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [user, setUser] = useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const notifiedSubmissionCount = useRef(0);

  const [projectData, setProjectData] =
    useState({
      title: "",
      description: "",
      deadline: "",
      members: [],
    });


  // ==========================
  // FETCH USER
  // ==========================

  const fetchUser = async () => {

    try {

      const res = await API.get("/auth/me");

      setUser(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  // ==========================
  // FETCH PROJECTS
  // ==========================

  const fetchProjects = async () => {

    try {

      const res = await API.get("/projects");

      setProjects(res.data);

    } catch (error) {

      toast.error("Failed to fetch projects");
    }
  };


  // ==========================
  // FETCH TASKS
  // ==========================

  const fetchTasks = async () => {

    try {

      const res = await API.get("/tasks");

      setTasks(res.data);

    } catch (error) {

      toast.error("Failed to fetch tasks");
    }
  };


  // ==========================
  // CREATE PROJECT
  // ==========================

  const createProject = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/projects",
        projectData
      );

      toast.success("Project created");

      fetchProjects();

      setShowModal(false);

      setProjectData({
        title: "",
        description: "",
        deadline: "",
        members: [],
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create project"
      );
    }
  };


  // ==========================
  // LOGOUT
  // ==========================

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };


  useEffect(() => {

    fetchProjects();

    fetchTasks();

    fetchUser();

  }, []);


  useEffect(() => {

    if (user?.role === "admin") {

      fetchUsers();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  useEffect(() => {

    if (user?.role !== "admin") {

      return;
    }

    const refreshAdminSubmissions = setInterval(
      fetchTasks,
      5000
    );

    return () =>
      clearInterval(refreshAdminSubmissions);

  }, [user]);


  // ==========================
  // ANALYTICS
  // ==========================

  const isCompleted = (task) =>
    task.status === "completed" ||
    task.status === "done";

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const completedTasks = tasks.filter(
    isCompleted
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !isCompleted(task)
  ).length;

  const overdueTasks = tasks.filter((task) => {

    if (!task.dueDate || isCompleted(task)) {

      return false;
    }

    const dueDate = new Date(task.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  });

  const upcomingTasks = tasks.filter((task) => {

    if (!task.dueDate || isCompleted(task)) {

      return false;
    }

    const dueDate = new Date(task.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    const differenceInDays =
      (dueDate - today) / 86400000;

    return (
      differenceInDays >= 0 &&
      differenceInDays <= 3
    );
  });

  const memberPerformance = users
    .filter((member) => member.role === "member")
    .map((member) => {

      const memberTasks = tasks.filter(
        (task) =>
          task.assignedTo?._id === member._id
      );

      const completed = memberTasks.filter(
        isCompleted
      ).length;

      const overdue = memberTasks.filter((task) => {

        if (!task.dueDate || isCompleted(task)) {

          return false;
        }

        const dueDate = new Date(task.dueDate);

        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
      }).length;

      return {
        ...member,
        total: memberTasks.length,
        completed,
        overdue,
      };
    });

  const memberSubmissions = tasks
    .filter((task) => task.submittedAt)
    .sort(
      (a, b) =>
        new Date(b.submittedAt) -
        new Date(a.submittedAt)
    );

  const newMemberSubmissions =
    memberSubmissions.filter(
      (task) => !task.adminSeen
    );


  useEffect(() => {

    if (
      user?.role === "admin" &&
      newMemberSubmissions.length >
        notifiedSubmissionCount.current
    ) {

      toast.success(
        `${newMemberSubmissions.length} member task submission${
          newMemberSubmissions.length > 1 ? "s" : ""
        } received`
      );

      notifiedSubmissionCount.current =
        newMemberSubmissions.length;
    }

  }, [user, newMemberSubmissions.length]);


  const markSubmissionReviewed = async (taskId) => {

    try {

      await API.put(`/tasks/${taskId}`, {
        adminSeen: true,
      });

      toast.success("Submission reviewed");

      fetchTasks();

    } catch (error) {

      toast.error("Failed to update notification");
    }
  };


  const fetchUsers = async () => {

    try {

      const res = await API.get("/users");

      setUsers(res.data);

    } catch (error) {

      if (user?.role === "admin") {

        toast.error("Failed to fetch members");
      }
    }
  };


  return (

    <div className="h-screen overflow-hidden bg-[#020617] text-white flex">

      <Toaster />


      {/* SIDEBAR */}

      <div className="w-60 bg-[#0F172A] border-r border-slate-800 p-5 hidden lg:flex flex-col justify-between">

        <div>

          <h1 className="text-3xl font-bold mb-10">

            Ethara Ai Task Manager

          </h1>


          {/* NAVIGATION */}

          <div className="space-y-3">

            <button
              onClick={() =>
                setActivePage("dashboard")
              }
              className={`w-full py-3 rounded-xl text-left px-4 transition-all ${
                activePage === "dashboard"
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >

              Dashboard

            </button>


            <button
              onClick={() =>
                setActivePage("projects")
              }
              className={`w-full py-3 rounded-xl text-left px-4 transition-all ${
                activePage === "projects"
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >

              Projects

            </button>


            <button
              onClick={() =>
                setActivePage("tasks")
              }
              className={`w-full py-3 rounded-xl text-left px-4 transition-all ${
                activePage === "tasks"
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >

              <span className="flex items-center justify-between">

                Tasks

                {user?.role === "admin" &&
                  newMemberSubmissions.length > 0 && (

                    <span className="ml-3 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">

                      {newMemberSubmissions.length}

                    </span>

                  )}

              </span>

            </button>

          </div>

        </div>


        {/* USER */}

        <div>

          <div className="mb-4 p-3 bg-slate-900 rounded-xl">

            <h3 className="font-semibold">

              {user?.name}

            </h3>

            <p className="text-slate-400 capitalize">

              {user?.role}

            </p>

          </div>


          {/* LOGOUT */}

          <button
            onClick={logout}
            className="flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 px-4 rounded-xl transition-all w-full"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">


        {/* DASHBOARD PAGE */}

        {activePage === "dashboard" && (

          <div>

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

              <div>

                <h1 className="text-3xl lg:text-4xl font-bold mb-2">

                  Dashboard

                </h1>

                <p className="text-slate-400">

                  Track projects and productivity.

                </p>

              </div>


              {/* ADMIN ONLY */}

              {user?.role === "admin" && (

                <button
                  onClick={() =>
                    setShowModal(true)
                  }
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all"
                >

                  + New Project

                </button>

              )}

            </div>


            {/* ANALYTICS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">


              {/* TOTAL PROJECTS */}

              <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">

                <FaFolderOpen className="text-3xl text-blue-400 mb-4" />

                <h3 className="text-slate-400 mb-2">

                  Total Projects

                </h3>

                <h2 className="text-4xl font-bold">

                  {projects.length}

                </h2>

              </div>


              {/* TOTAL TASKS */}

              <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">

                <FaTasks className="text-3xl text-purple-400 mb-4" />

                <h3 className="text-slate-400 mb-2">

                  Total Tasks

                </h3>

                <h2 className="text-4xl font-bold">

                  {tasks.length}

                </h2>

              </div>


              {/* COMPLETED */}

              <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">

                <FaCheckCircle className="text-3xl text-green-400 mb-4" />

                <h3 className="text-slate-400 mb-2">

                  Completed Tasks

                </h3>

                <h2 className="text-4xl font-bold">

                  {completedTasks}

                </h2>

              </div>


              {/* PENDING */}

              <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">

                <FaClock className="text-3xl text-yellow-400 mb-4" />

                <h3 className="text-slate-400 mb-2">

                  Pending Tasks

                </h3>

                <h2 className="text-4xl font-bold">

                  {pendingTasks}

                </h2>

              </div>


              {/* OVERDUE */}

              <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">

                <FaExclamationTriangle className="text-3xl text-red-400 mb-4" />

                <h3 className="text-slate-400 mb-2">

                  Overdue Tasks

                </h3>

                <h2 className="text-4xl font-bold">

                  {overdueTasks.length}

                </h2>

              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">

              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">

                <h2 className="text-2xl font-bold mb-4">

                  Overdue Work

                </h2>

                <div className="space-y-3">

                  {overdueTasks.length === 0 ? (

                    <p className="text-slate-400">

                      No overdue tasks.

                    </p>

                  ) : (

                    overdueTasks.slice(0, 5).map((task) => (

                      <div
                        key={task._id}
                        className="rounded-xl bg-red-500/10 p-4 text-red-200"
                      >

                        <p className="font-semibold">

                          {task.title}

                        </p>

                        <p className="text-sm text-red-300">

                          Due{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}

                        </p>

                      </div>

                    ))

                  )}

                </div>

              </div>


              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">

                <h2 className="text-2xl font-bold mb-4">

                  Upcoming Deadlines

                </h2>

                <div className="space-y-3">

                  {upcomingTasks.length === 0 ? (

                    <p className="text-slate-400">

                      No upcoming deadlines.

                    </p>

                  ) : (

                    upcomingTasks.slice(0, 5).map((task) => (

                      <div
                        key={task._id}
                        className="rounded-xl bg-yellow-500/10 p-4 text-yellow-100"
                      >

                        <p className="font-semibold">

                          {task.title}

                        </p>

                        <p className="text-sm text-yellow-300">

                          Due{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}

                        </p>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </div>


            {user?.role === "admin" &&
              memberPerformance.length > 0 && (

                <div className="mt-6 bg-[#0F172A] border border-slate-800 rounded-2xl p-5">

                  <div className="mb-4 flex items-center gap-3">

                    <FaUsers className="text-blue-400" />

                    <h2 className="text-2xl font-bold">

                      Member Work Tracking

                    </h2>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

                    {memberPerformance.map((member) => (

                      <div
                        key={member._id}
                        className="rounded-xl bg-slate-900 p-4"
                      >

                        <h3 className="font-semibold">

                          {member.name}

                        </h3>

                        <p className="mt-2 text-sm text-slate-400">

                          {member.completed} of{" "}
                          {member.total} tasks completed

                        </p>

                        <p className="text-sm text-red-300">

                          {member.overdue} overdue

                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              )}


            {user?.role === "admin" &&
              memberSubmissions.length > 0 && (

                <div className="mt-6 bg-[#0F172A] border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-4 gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">

                        Member Submissions

                      </h2>

                      <p className="text-slate-400">

                        Tasks submitted by members for admin review.

                      </p>

                    </div>

                    {newMemberSubmissions.length > 0 && (

                      <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-300">

                        {newMemberSubmissions.length} New

                      </span>

                    )}

                  </div>


                  <div className="space-y-3">

                    {memberSubmissions
                      .slice(0, 5)
                      .map((task) => (

                        <div
                          key={task._id}
                          className="flex items-center justify-between gap-4 rounded-xl bg-slate-900 p-4"
                        >

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              {!task.adminSeen && (

                                <span className="h-2 w-2 rounded-full bg-red-400"></span>

                              )}

                              <h3 className="truncate font-semibold">

                                {task.title}

                              </h3>

                            </div>

                            <p className="mt-1 text-sm text-slate-400">

                              {task.submittedBy?.name ||
                                "Member"}{" "}
                              submitted this task
                              {task.project?.title
                                ? ` in ${task.project.title}`
                                : ""}
                            </p>

                          </div>

                          <div className="flex shrink-0 items-center gap-3">

                            <span className="hidden text-sm text-slate-500 sm:inline">

                              {new Date(
                                task.submittedAt
                              ).toLocaleString()}

                            </span>

                            {!task.adminSeen && (

                              <button
                                onClick={() =>
                                  markSubmissionReviewed(
                                    task._id
                                  )
                                }
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                              >

                                Review

                              </button>

                            )}

                          </div>

                        </div>

                      ))}

                  </div>

                </div>

              )}

          </div>

        )}


        {/* PROJECTS PAGE */}

        {activePage === "projects" && (

          <ProjectsPage
            projects={projects}
            tasks={tasks}
            user={user}
            fetchProjects={fetchProjects}
            fetchTasks={fetchTasks}
          />

        )}


        {/* TASKS PAGE */}

        {activePage === "tasks" && (

          <TasksPage
            tasks={tasks}
            projects={projects}
            user={user}
            fetchTasks={fetchTasks}
          />

        )}

      </div>


      {/* CREATE PROJECT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-[#0F172A] border border-slate-800 rounded-2xl p-6">

            <h2 className="text-3xl font-bold mb-6">

              Create Project

            </h2>


            <form
              onSubmit={createProject}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Project Title"
                value={projectData.title}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    title: e.target.value,
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
                required
              />


              <textarea
                placeholder="Project Description"
                value={projectData.description}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none h-28"
                required
              ></textarea>


              <input
                type="date"
                value={projectData.deadline}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    deadline: e.target.value,
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
                required
              />


              {users.filter((member) => member.role === "member").length > 0 && (

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">

                  <p className="mb-3 text-slate-400">

                    Add Members

                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    {users
                      .filter(
                        (member) =>
                          member.role === "member"
                      )
                      .map((member) => (

                        <label
                          key={member._id}
                          className="flex items-center gap-2 rounded-lg bg-[#0F172A] p-2"
                        >

                          <input
                            type="checkbox"
                            checked={projectData.members.includes(
                              member._id
                            )}
                            onChange={(e) => {

                              const members = e.target.checked
                                ? [
                                    ...projectData.members,
                                    member._id,
                                  ]
                                : projectData.members.filter(
                                    (id) =>
                                      id !== member._id
                                  );

                              setProjectData({
                                ...projectData,
                                members,
                              });
                            }}
                          />

                          <span>{member.name}</span>

                        </label>

                      ))}

                  </div>

                </div>

              )}


              <div className="flex gap-4">

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-xl font-semibold"
                >

                  Create Project

                </button>


                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 bg-slate-800 py-3 rounded-xl"
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;

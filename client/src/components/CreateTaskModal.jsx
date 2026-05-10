import { useEffect, useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";


function CreateTaskModal({

  closeModal,
  fetchTasks,
  projects,
  user,

}) {

  const [users, setUsers] = useState([]);


  const [taskData, setTaskData] =
    useState({

      title: "",
      description: "",
      project: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",

    });

  const selectedProject = projects.find(
    (project) => project._id === taskData.project
  );

  const assignableUsers =
    selectedProject?.members?.length > 0
      ? selectedProject.members
      : users.filter((u) => u.role === "member");


  // ==========================
  // FETCH USERS
  // ==========================

  const fetchUsers = async () => {

    try {

      const res = await API.get("/users");

      setUsers(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    if (user?.role === "admin") {

      fetchUsers();
    }

  }, [user]);


  // ==========================
  // HANDLE CHANGE
  // ==========================

  const handleChange = (e) => {

    setTaskData({

      ...taskData,

      [e.target.name]:
        e.target.value,

    });
  };


  // ==========================
  // CREATE TASK
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/tasks",
        taskData
      );

      toast.success("Task Created");

      fetchTasks();

      closeModal();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Task creation failed"
      );
    }
  };


  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

      <div className="w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-[#0F172A] border border-slate-800 rounded-2xl p-6">

        <h2 className="text-3xl font-bold mb-6">

          Create Task

        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
            required
          />


          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Task Description"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none h-24"
          ></textarea>


          {/* PROJECT */}

          <select
            name="project"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
            required
          >

            <option value="">

              Select Project

            </option>

            {projects.map((project) => (

              <option
                key={project._id}
                value={project._id}
              >

                {project.title}

              </option>

            ))}

          </select>


          {/* ASSIGN MEMBER */}

          {user?.role === "admin" && (

            <select
              name="assignedTo"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
            >

              <option value="">

                Assign Member

              </option>

              {assignableUsers.map((u) => (

                  <option
                    key={u._id}
                    value={u._id}
                  >

                    {u.name}

                  </option>

              ))}

            </select>

          )}


          {/* PRIORITY */}

          <select
            name="priority"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
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


          {/* DUE DATE */}

          <input
            type="date"
            name="dueDate"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
            required
          />


          {/* BUTTONS */}

          <div className="flex gap-4">

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-xl font-semibold"
            >

              Create Task

            </button>


            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-slate-800 py-3 rounded-xl"
            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTaskModal;

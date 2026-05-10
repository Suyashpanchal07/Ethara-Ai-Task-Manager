import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

import {

  FaTrash,
  FaTasks,
  FaCheckCircle,

} from "react-icons/fa";

import ProjectDetailsModal from "../components/ProjectDetailsModal";


function ProjectsPage({

  projects,
  tasks,
  user,
  fetchProjects,
  fetchTasks,

}) {

  const [selectedProject, setSelectedProject] =
    useState(null);

  const isCompleted = (task) =>
    task.status === "completed" ||
    task.status === "done";


  // ==========================
  // DELETE PROJECT
  // ==========================

  const deleteProject = async (id) => {

    try {

      await API.delete(`/projects/${id}`);

      toast.success("Project deleted");

      fetchProjects();

    } catch (error) {

      toast.error("Failed to delete project");
    }
  };


  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">

            Projects

          </h1>

          <p className="text-slate-400">

            Manage active projects and track progress.

          </p>

        </div>

      </div>


      {/* PROJECT GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {projects.map((project) => {

          // ==========================
          // FILTER PROJECT TASKS
          // ==========================

          const projectTasks = tasks.filter(
            (task) =>
              task.project?._id === project._id
          );


          const completedTasks =
            projectTasks.filter(
              isCompleted
            );


          // ==========================
          // DYNAMIC PROGRESS
          // ==========================

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

              {/* TOP */}

              <div className="flex justify-between items-start mb-4 gap-4">

                <div>

                  <h2 className="text-2xl font-bold mb-2">

                    {project.title}

                  </h2>

                  <p className="text-slate-400">

                    {project.description}

                  </p>

                  {project.deadline && (

                    <p className="mt-2 text-sm text-slate-500">

                      Deadline:{" "}
                      {new Date(
                        project.deadline
                      ).toLocaleDateString()}

                    </p>

                  )}

                  {project.members?.length > 0 && (

                    <p className="mt-1 text-sm text-slate-500">

                      Members:{" "}
                      {project.members
                        .map((member) => member.name)
                        .join(", ")}

                    </p>

                  )}

                </div>


                {/* ADMIN DELETE */}

                {user?.role === "admin" && (

                  <button
                    onClick={() =>
                      deleteProject(project._id)
                    }
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-xl transition-all"
                  >

                    <FaTrash />

                  </button>

                )}

              </div>


              {/* STATS */}

              <div className="grid grid-cols-2 gap-3 mb-5">

                <div className="bg-slate-900 p-4 rounded-xl">

                  <FaTasks className="text-blue-400 text-xl mb-2" />

                  <p className="text-slate-400 text-sm">

                    Total Tasks

                  </p>

                  <h3 className="text-2xl font-bold">

                    {projectTasks.length}

                  </h3>

                </div>


                <div className="bg-slate-900 p-4 rounded-xl">

                  <FaCheckCircle className="text-green-400 text-xl mb-2" />

                  <p className="text-slate-400 text-sm">

                    Completed

                  </p>

                  <h3 className="text-2xl font-bold">

                    {completedTasks.length}

                  </h3>

                </div>

              </div>


              {/* PROGRESS */}

              <div className="mb-5">

                <div className="flex justify-between mb-2">

                  <span className="text-slate-400">

                    Progress

                  </span>

                  <span className="font-semibold">

                    {progress}%

                  </span>

                </div>


                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  ></div>

                </div>

              </div>


              {/* OPEN PROJECT */}

              <button
                onClick={() =>
                  setSelectedProject(project)
                }
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all"
              >

                Open Project

              </button>

            </div>
          );
        })}

      </div>


      {/* PROJECT DETAILS MODAL */}

      {selectedProject && (

        <ProjectDetailsModal

          project={selectedProject}

          tasks={tasks}

          fetchTasks={fetchTasks}

          closeModal={() =>
            setSelectedProject(null)
          }

          user={user}

        />

      )}

    </div>
  );
}

export default ProjectsPage;

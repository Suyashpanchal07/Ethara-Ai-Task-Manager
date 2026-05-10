Ethara Ai Task Manager

A modern full-stack Ethara Ai Task Manager web application where Admins can create projects, assign tasks, monitor progress, and manage team workflow while Members can work on assigned tasks and update task status.

---

# Features

## Authentication

* User Signup & Login
* JWT Authentication
* Secure Password Hashing
* Role-Based Access Control

## User Roles

### Admin

* Create Projects
* Delete Projects
* Create Tasks
* Assign Tasks to Members
* Monitor Project Progress
* View All Tasks
* Track Overdue Tasks

### Member

* View Assigned Tasks
* Update Task Status
* View Assigned Projects
* Track Deadlines

---

# Project Management

* Create Multiple Projects
* Dynamic Project Progress Calculation
* Project-wise Task Organization
* Real-time Progress Tracking
* Task Completion Percentage

---

# Task Management

* Create Tasks Inside Projects

* Assign Tasks to Team Members

* Update Task Status

* Priority Levels

  * Low
  * Medium
  * High

* Task Status Types

  * Pending
  * In Progress
  * Completed

* Overdue Task Detection

---

# Dashboard Features

* Total Projects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Dynamic Progress Bars
* Overdue Task Monitoring

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* React Icons
* Framer Motion
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

# Folder Structure

client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
└── public/

server/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js

---

# Installation Guide

## Clone Repository

git clone 

---

# Backend Setup

## Move to server folder

cd server

## Install dependencies

npm install

## Create .env file

PORT=5000
MONGO_URI=mongodb+srv://thesuyashpanchal_db_user:suyash@cluster0.yhbk8oo.mongodb.net/pfm_db?retryWrites=true&w=majority&authSource=admin
JWT_SECRET=mysecretkey

## Start backend

npm run dev

---

# Frontend Setup

## Move to client folder

cd client

## Install dependencies

npm install

## Start frontend

npm start

---

# API Endpoints

## Authentication

POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me

---

## Projects

GET /api/projects
POST /api/projects
DELETE /api/projects/:id

---

## Tasks

GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

---

## Users

GET /api/users

---

# Dynamic Project Progress Formula

Project Progress =
(Completed Tasks / Total Tasks) × 100

Example:

Total Tasks = 10
Completed Tasks = 7

Progress = 70%

---

# Deployment

* Railway



---

# Demo Workflow

## Admin Workflow

1. Login as Admin
2. Create Project
3. Add Tasks
4. Assign Tasks to Members
5. Monitor Progress
6. Track Overdue Tasks

## Member Workflow

1. Login as Member
2. View Assigned Tasks
3. Update Task Status
4. Complete Tasks
5. Track Deadlines

---

# Future Improvements

* Real-time Notifications
* Socket.IO Integration
* File Attachments
* Team Chat
* Activity Logs
* Dark/Light Theme Toggle
* Advanced Analytics
* Email Notifications

---

# Screenshots

Add screenshots of:

* Login Page
* Dashboard
* Projects Page
* Tasks Page
* Project Details

---

# Author

Suyash Panchal

---

# License

This Ethara Ai Task Manager project is created for educational and assignment purposes.

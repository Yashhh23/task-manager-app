import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};


  return (
    <div className="container">
      <h2 className="title">My Tasks</h2>

      <input
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>&nbsp;
      <button onClick={handleLogout}>
  Logout
</button>


      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <h3>{task.title}</h3>

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus(task._id, e.target.value)
            }
          >
            <option>Pending</option>
            <option>In-Progress</option>
            <option>Done</option>
          </select>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

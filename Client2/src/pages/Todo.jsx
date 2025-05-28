import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  addTodoRoute,
  getTodosRoute,
  deleteTodoRoute,
  markDoneTodoRoute,
  host, // Import host to send subscription to backend
} from "../utility/APIRouter";

import Navbar from "../components/Navbar";
import "../CSSFILES/todo.css";

// Helper to convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const Todo = () => {
  const Navigate = useNavigate();

  let [todoValues, setTodoValues] = useState({
    title: "",
    description: "",
    sendDate: "",
    sendTime: "",
  });

  let [Data, setData] = useState([]);

  // Fetch all todos from backend
  const fetchTodos = async () => {
    try {
      let { data } = await axios.get(getTodosRoute);
      setData(data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Setup Service Worker and Push Notifications
  useEffect(() => {
        fetchTodos();

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          if (Notification.permission === "granted") {
            // Permission already granted
            return registration;
          } else {
            // Request notification permission
            return Notification.requestPermission().then((permission) => {
              if (permission !== "granted") {
                alert("Notification permission denied");
                throw new Error("Notification permission denied");
              }
              return registration;
            });
          }
        })
        .then((registration) => {
          const vapidPublicKey =
            "BIrT1X8Ea7Vds-D7n8sWQd9OFlHLK7jHPE61j5sn3uGAnAU4k_IcMtGDttOPvZhSAVb7VOYXwkCPKTcImj3TZO4";
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          return registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) return subscription;

            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          });
        })
        .then(async (subscription) => {
          console.log("Push subscription:", JSON.stringify(subscription));

          // Send subscription object to backend to save it
          try {
            await axios.post(`${host}/save-subscription`, subscription);
            console.log("Subscription saved on server");
          } catch (error) {
            console.error("Failed to save subscription:", error);
          }
        })
        .catch((error) => {
          console.error("Service Worker or Push subscription error:", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }, []);

  // Fetch todos on component mount
  useEffect(() => {
  }, []);

  // Handle form input changes
  let handleChange = (event) => {
    setTodoValues({ ...todoValues, [event.target.name]: event.target.value });
  };

  // Handle form submission to add todo
  let handleSubmit = async (event) => {
    event.preventDefault();

    const { title, description, sendDate, sendTime } = todoValues;

    const dateString = `${sendDate}T${sendTime}:00`;
    const sendDateTime = new Date(dateString);

    try {
      const { data } = await axios.post(addTodoRoute, {
        title,
        description,
        sendDateTime,
      });

      if (data.status) {
        alert("Message Scheduled");
      }

      setTodoValues({ title: "", description: "", sendDate: "", sendTime: "" }); // Clear form
      fetchTodos();
      Navigate("/todo");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to schedule message.");
    }
  };

  // Delete todo by id
  let deleteTodo = async (id) => {
    try {
      await axios.post(deleteTodoRoute, { id });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Mark todo as done or undone
  let DoneTodo = async (id, doneVal) => {
    try {
      await axios.post(markDoneTodoRoute, { id, doneVal });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  return (
    <div id="Todo-Top">
      <Navbar current="Todo" />

      <div className="AddTodoContainer">
        <form onSubmit={handleSubmit} className="AddTodoForm">
          <p>Add Reminder / Tasks</p>

          <input
            className="feedback-input"
            placeholder="Enter Title"
            name="title"
            id="title"
            onChange={handleChange}
            value={todoValues.title}
            required
          />

          <input
            className="todo-textarea"
            placeholder="Add description"
            name="description"
            id="description"
            onChange={handleChange}
            value={todoValues.description}
          />

          <label htmlFor="sendDate" className="label1">
            Date :{" "}
          </label>

          <input
            type="date"
            id="sendDate"
            name="sendDate"
            className="feedback-input"
            value={todoValues.sendDate || ""}
            onChange={handleChange}
          />

          <label htmlFor="sendTime" className="label2">
            Time :{" "}
          </label>
          <input
            type="time"
            id="sendTime"
            name="sendTime"
            className="feedback-input"
            value={todoValues.sendTime || ""}
            onChange={handleChange}
          />

          <button className="todo-button" type="submit">
            Submit
          </button>
        </form>
      </div>

      <p className="TodoListP"> Reminders </p>

      {Data.map((item) => {
        const dateObj = new Date(item.time);

        const date1 = dateObj.toLocaleDateString();
        const time1 = dateObj.toLocaleTimeString();

        return (
          <div key={item._id} className="TodoListContainer">
            <div className="TodoListBox">
              {item.MarkDone ? (
                <div className="TodoListTitle">
                  <strong>Title : </strong> <strike>{item.title}</strike>
                </div>
              ) : (
                <div className="TodoListTitle">
                  <strong>Title : </strong> {item.title}
                </div>
              )}

              {item.MarkDone ? (
                <div className="TodoListDes">
                  {" "}
                  <strong>Des : </strong>
                  <strike>{item.description}</strike>
                </div>
              ) : (
                <div className="TodoListDes">
                  {" "}
                  <strong>Des : </strong>
                  {item.description}
                </div>
              )}
              <div className="TodoListDate">{date1}</div>
              <div className="TodoListTime">{time1}</div>

              <button
                className="TodoListButtonDone"
                onClick={() => DoneTodo(item._id, item.MarkDone)}
              >
                Done
              </button>
              <button
                className="TodoListButtonDelete"
                onClick={() => deleteTodo(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      <a href="/todo#Todo-Top" className="topArrow">
        <i className="fa-solid fa-circle-up fa-lg" style={{ color: "#626060" }}></i>
      </a>
    </div>
  );
};

export default Todo;


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import axios from 'axios'
import {addTodoRoute} from "../utility/APIRouter";
import { getTodosRoute } from "../utility/APIRouter";
import { deleteTodoRoute } from "../utility/APIRouter";
import { markDoneTodoRoute } from "../utility/APIRouter";

import Navbar from "../components/Navbar";
import "../CSSFILES/todo.css";


const Todo = () =>{

    const Navigate = useNavigate();

   

    let [todoValues , setTodoValues] = useState({
        title:"",
        description:"",
     sendDate:"",
     sendTime:""
    })

    let [Data , setData] = useState([]);

    const fetchTodos = async () => {
        try {
            let { data } = await axios.get(getTodosRoute);
        
            setData(data.todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    let handleChange = (event) =>{

        setTodoValues({...todoValues , [event.target.name]:event.target.value})
        }
    
        let handleSubmit = async (event) =>{
            event.preventDefault();

            const { title, description, sendDate, sendTime } = todoValues;
  
           
              const dateString = `${sendDate}T${sendTime}:00`;
              const sendDateTime = new Date(dateString);
          
            
        

            const {data} = await axios.post(addTodoRoute,{
              title,description,sendDateTime
            });

       if(data.status){
        alert("message Scheduled");
       }

            setTodoValues({ title: " ", description: " " }); // Clear form
           fetchTodos(); 
           Navigate("/todo")
        }

let deleteTodo = async (id) =>{
    const {data} = await axios.post(deleteTodoRoute,{
      id
      });
      fetchTodos();
}

let DoneTodo = async (id,doneVal) =>{
    const {data} = await axios.post(markDoneTodoRoute,{
        id,doneVal
        });
        fetchTodos();
}



    return(
    <div id="Todo-Top">
      <Navbar current="Todo"/> 

    
    <div className="AddTodoContainer">

    <form onSubmit={(e)=> handleSubmit(e)}  className="AddTodoForm" >

    <p>Add Reminder / Tasks</p>

<input className="feedback-input"  placeholder="Enter Title" name="title" id="title" onChange={(e)=>handleChange(e)} value={todoValues.title} required/>

<input className="todo-textarea" placeholder="Add description" name="description" id="description" onChange={(e)=>handleChange(e)} value={todoValues.description} />

<label htmlFor="sendDate" className="label1">Date : </label>

<input
  type="date"
  id="sendDate"
  name="sendDate"
  className="feedback-input"
  value={todoValues.sendDate || ""}
  onChange={handleChange}
/>

<label htmlFor="sendTime" className="label2">Time : </label>
<input
  type="time"
  id="sendTime"
  name="sendTime"
  className="feedback-input"
  value={todoValues.sendTime || ""}
  onChange={handleChange}
/>

<button className="todo-button" type="submit">Submit</button>

</form>


    </div>

<p className="TodoListP"> Reminders </p>


{Data.map((item) => {
                    const dateObj = new Date(item.time);

                    // dateObj.setHours(dateObj.getHours() + 5);     // +5 hours
                    // dateObj.setMinutes(dateObj.getMinutes() + 30); // +30 minutes

                    const date1 = dateObj.toLocaleDateString();
                    const time1 = dateObj.toLocaleTimeString();

                    return (
                        <div key={item._id} className="TodoListContainer">

<div className="TodoListBox" >

                            {item.MarkDone ? (
                                <div className="TodoListTitle"><strong>Title : </strong> <strike>{item.title}</strike></div>

                            ) : (
                                <div className="TodoListTitle"><strong>Title : </strong> {item.title}</div>
                            )}

                            {item.MarkDone ? (
                                <div className="TodoListDes"> <strong>Des : </strong><strike>{item.description}</strike></div> 
                            ) : (
                                <div className="TodoListDes"> <strong>Des : </strong>{item.description}</div> 
                            )}
                      <div className="TodoListDate">{date1}</div>
                       <div className="TodoListTime">{time1}</div> 

                            <button  className="TodoListButtonDone" onClick={() => DoneTodo(item._id, item.MarkDone)}>Done</button>
                            <button className="TodoListButtonDelete" onClick={() => deleteTodo(item._id)}>Delete</button>

</div>

                        </div>
                    );

                    
                })}
   

    <a href="/todo#Todo-Top" className="topArrow"><i className="fa-solid fa-circle-up fa-lg" style={{color : "#626060"}}></i></a>

    </div>
    
    )
    }
    
    export default Todo;
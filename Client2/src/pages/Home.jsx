
import axios from "axios";
import Finance from "./Finance";
import Navbar from "../components/Navbar";
import "../CSSFILES/Home.css";

const Home = () =>{

    

return(
<div className="HomeContainer">
<Navbar current="Home"/> 

<div className="profileContainer">

<div className="profileLogo">
</div>


<div className="ProfileTitle"> <p> Sarthak Choudhari </p>
    <div className="profileLinks">

    <a href="https://www.instagram.com/sarthak_8898?igsh=am13MTl3ZmhobGNk"><i class="fa-brands fa-instagram"></i></a>

   <a href="https://www.linkedin.com/in/sarthak-choudhari-354b45286"><i class="fa-brands fa-linkedin"></i></a> 

    <a href="https://github.com/Sarthak-choudhari-8"><i class="fa-brands fa-github"></i></a>
     </div> 
 
 </div>


<div className="profileDescription">
RTL Tracker is a comprehensive personal productivity and finance management web application designed to streamline daily tasks, reminders, and financial tracking. Along with task scheduling and automated email reminders, RTL Tracker offers features to manage transactions, monitor balance details, and organize personal listings and wishlists.<br/>  <br/> RTL Tracker provides a smooth and secure user experience—helping individuals stay productive, financially aware, and well-organized in one unified platform.

</div>

</div>

</div>

)
}

export default Home;
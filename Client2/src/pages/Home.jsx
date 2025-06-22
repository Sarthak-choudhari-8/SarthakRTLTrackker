
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
Hey there, I am Sarthak , a dedicated developer with a passion for creating innovative solutions using the MERN stack . Through countless hours of learning and hands-on experience . <br/> I have honed my skills in building robust and scalable web applications that captivate and inspire.<br /> <br /> I am currently immersing myself in the world of Data Structures and Algorithm using Java. This journey of exploration fuels my curiosity and drives me to continually improve and expand my knowledge base .</div>

</div>

</div>

)
}

export default Home;
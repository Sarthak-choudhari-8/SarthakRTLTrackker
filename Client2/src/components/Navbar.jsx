
import { useNavigate } from "react-router-dom";
import "../CSSFILES/navbar.css";



export default function Navbar({current}){

    let Navigate = useNavigate();

    return (

<>

<div className="navbar">

<div className="logo "></div>

{ current == "Home" ?
<div className="Home navComp CurrentPage"> <button onClick={ ()=>Navigate('/home') }>Home</button></div>
:
<div className="Home navComp"> <button onClick={ ()=>Navigate('/home') }>Home</button></div>
}


{ current == "Todo" ?
<div className="Reminder navComp  CurrentPage"> <button onClick={ ()=>Navigate('/todo') }>Reminders</button></div>
:
<div className="Reminder navComp "> <button onClick={ ()=>Navigate('/todo') }>Reminders</button></div>
}

{ current == "Finance" ?
<div className="Transaction navComp CurrentPage"> <button onClick={ ()=>Navigate('/finance') }>Transaction</button></div>
:
<div className="Transaction navComp"> <button onClick={ ()=>Navigate('/finance') }>Transaction</button></div>
}  


{ current == "Secure" ?
<div className="Secure navComp CurrentPage"> <button onClick={ ()=>Navigate('/secure') }>Listings</button></div>
:
<div className="Secure navComp"> <button onClick={ ()=>Navigate('/secure') }>Listings</button></div>
}
</div>


</>

    )
}
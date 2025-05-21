

import axios from "axios";
import "../CSSFILES/finance.css";


import { getBalanceRoute } from "../utility/APIRouter";
import { setBalanceRoute } from "../utility/APIRouter";
import { setFinanceListRoute } from "../utility/APIRouter";
import { getFinanceListRoute } from "../utility/APIRouter";
import {deleteFinanceListRoute} from "../utility/APIRouter";
import { getPasswordRoute } from "../utility/APIRouter";


import Navbar from "../components/Navbar";

import { useState , useEffect } from "react";

const Finance = () =>{
 

  const [verified, setVerified] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [finList, setFinList] = useState([]);

const [balance , setBalance] = useState({

  NetCash:0,
  NetOnline:0,
  ExtraaCash:0,
  ExtraaOnline:0,
  TotalAmount:0

})

const [showForm, setShowForm] = useState(false);

const [ListAmount, setListAmount] = useState('');
const [ListDescription, setListDescription] = useState('');
const [transactionType, setTransactionType] = useState('topay');




  const fetchBalance = async () =>{
let {data} = await axios.get(getBalanceRoute);

setBalance(data.BalanceDB[0]);
  }

  const fetchFinanceList = async () =>{
    let {data} = await axios.get(getFinanceListRoute);
    
    setFinList(data.lists);
      }
    

const [formValues, setFormValues] = useState(balance);

  const postBalance = async () =>{
    const {data} = await axios.post(setBalanceRoute,{
   formValues
    });


      }
    
useEffect(() =>{

fetchBalance();
fetchFinanceList();

},[])

   
        const handleVerify = async() => {
             let {data} = await  axios.get(getPasswordRoute);

          if (inputPassword === data.pass.TransactionPass) {
            setVerified(true); 
          } else {
            alert("Incorrect Password!");
          }
        };

        const handleEditClick = () => {
          setFormValues(balance); // preload form with current values
          setShowForm(true);
        };


        const handleInputChange = (e) => {
          const { name, value } = e.target;
          setFormValues((prev) => ({
            ...prev,
            [name]: Number(value)
          }));
        };

        
        const handleFormSubmit = (e) => {
          e.preventDefault();
          const total = formValues.NetCash + formValues.NetOnline + formValues.ExtraaCash + formValues.ExtraaOnline;
      
          setBalance({
            ...formValues,
            TotalAmount: total
          });
      
          postBalance();
          setShowForm(false); // hide the form after submit
        };
      
        const FinanceListSubmit = async (e) => {
          e.preventDefault();
           
          let amt = ListAmount;
          let des = ListDescription;
          let type = transactionType;
          
          let {data} = await axios.post(setFinanceListRoute ,{
            amt , des , type
          })
fetchFinanceList();
        };

        let deleteFinList = async (id) =>{
          const {data} = await axios.post(deleteFinanceListRoute,{
            id
            });

            fetchFinanceList();

      }

        if (!verified) {
          return (
             <>
            <Navbar current="Finance"/> 

            <div className="passwordBox">
              <p className="passwordHeading">Enter Password to Access Transaction Page</p>
              <input
              className="passInput"
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Enter Password"
              />
              <button className="passButton" onClick={handleVerify}>Verify</button>
            </div>
            </>
          );
        }
        
      
        return (
          <div id="Finance-Top">
               <Navbar current="Finance"/> 

               <div className="BalanceText">Balance</div> 
        
          <div className="balanceBox">
<div className="NetCash balanceAttribute">{balance.NetCash}</div> +
<div className="NetOnline balanceAttribute">{balance.NetOnline}</div> +
<div className="ExtraaCash balanceAttribute ">{balance.ExtraaCash}</div> +
<div className="ExtraaOnline balanceAttribute">{balance.ExtraaOnline}</div> =
<div className="TotalAmount ">{balance.TotalAmount}</div>
<button onClick={handleEditClick} className="balanceButton"><i className="fas fa-edit"></i>
</button>         
<p className="balanceP balanceP1">Net Cash</p> <p className="balanceP">Net Online</p>  <p className="balanceP" >Extraa Cash</p>  <p className="balanceP">Extraa Online</p> 
<p className="balanceP">Total Amount</p>

 </div>

          {showForm && (
        <form onSubmit={handleFormSubmit} className="editForm">
          <p>Edit Balance</p>
          <input
            type="number"
            name="NetCash"
            value={formValues.NetCash}
            onChange={handleInputChange}
            placeholder="Net Cash"
            
          />
          <input
            type="number"
            name="NetOnline"
            value={formValues.NetOnline}
            onChange={handleInputChange}
            placeholder="Net Online"
          />
          <input
            type="number"
            name="ExtraaCash"
              value={formValues.ExtraaCash}
            onChange={handleInputChange}
            placeholder="Extraa Cash"
          />
          <input
            type="number"
            name="ExtraaOnline"
            value={formValues.ExtraaOnline}
            onChange={handleInputChange}
            placeholder="Extraa Online"
          />
          <button type="submit">Submit</button>
        </form>
      )}

   

<div >

   <form onSubmit={FinanceListSubmit} className="financeEntryBox" >
  <p>Transations Entry</p>

     
      <input 
        type="number" 
        value={ListAmount} 
        onChange={(e) => setListAmount(e.target.value)} 
        required 
        placeholder="Enter amount"
      />

 
      <input 
        type="text" 
        value={ListDescription} 
        onChange={(e) => setListDescription(e.target.value)} 
        required 
        placeholder="Enter description"
      />

      <div>
        <label>
          <input 
            type="radio" 
            value="topay" 
            checked={transactionType === "topay"} 
            onChange={(e) => setTransactionType(e.target.value)}
          />
          To Pay
        </label>
        <br />
        <label>
          <input 
            type="radio" 
            value="spend" 
            checked={transactionType === "spend"} 
            onChange={(e) => setTransactionType(e.target.value)}
          />
          Spend
        </label>
        <br />
        <label>
          <input 
            type="radio" 
            value="collect" 
            checked={transactionType === "collect"} 
            onChange={(e) => setTransactionType(e.target.value)}
          />
          Collect
        </label>
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>Submit</button>
    </form>


    </div>
 
    <p className="finListP">Transactions List</p>
{ finList.map((item) =>{

const dateObj = new Date(item.Date);
const date1 = dateObj.toLocaleDateString();
const time1 = dateObj.toLocaleTimeString();

return(
 
 
 <div>
 
 <div key={item._id} className="FinanceListContainer"> 


 {item.Topay === true ? 
   <div className="FinListBox" >
    <div className="finListHeading ToPay">To Pay</div>
     <div className="finListAmt"><strong>Amt : </strong> {item.Amount}</div>
    <div className="finListDes"> <strong>Des : </strong> {item.Description}</div> 
    <div className="finListDate">{date1}</div>
    <div className="finListTime">{time1}</div> 
    <button className="finListButton" onClick={() => deleteFinList(item._id)}>Delete</button>
</div>
    : null}

 {item.Collect === true ? 
     <div className="FinListBox" >
     <div className="finListHeading Collect">Collect</div>
      <div className="finListAmt"><strong>Amt : </strong> {item.Amount}</div>
     <div className="finListDes"> <strong>Des : </strong> {item.Description}</div> 
     <div className="finListDate">{date1}</div>
     <div className="finListTime">{time1}</div> 
     <button className="finListButton" onClick={() => deleteFinList(item._id)}>Delete</button>
 </div>
 
    : null}

{item.Spend === true ? 
      <div className="FinListBox" >
      <div className="finListHeading Spend">Spend</div>
       <div className="finListAmt"><strong>Amt : </strong> {item.Amount}</div>
      <div className="finListDes"> <strong>Des : </strong> {item.Description}</div> 
      <div className="finListDate">{date1}</div>
      <div className="finListTime">{time1}</div> 
      <button className="finListButton" onClick={() => deleteFinList(item._id)}>Delete</button>
  </div>
  
    : null}

    </div>
    


     
</div>


);

})}





<a href="/finance#Finance-Top" className="topArrow"><i className="fa-solid fa-circle-up fa-lg" style={{color : "#626060"}}></i></a>

          </div>
        );
      
      
    }
    
    export default Finance;

  


import axios from "axios";
import "../CSSFILES/secure.css";

import { useEffect, useState } from "react";
import { getSecureListRoute } from "../utility/APIRouter";
import { setSecureListRoute } from "../utility/APIRouter";
import { deleteSecureListRoute } from "../utility/APIRouter";
import { getPasswordRoute } from "../utility/APIRouter";
import Navbar from "../components/Navbar";
import "../CSSFILES/finance.css";


const Secure = () => {

  const [verified, setVerified] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [secureList, setSecureList] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    description: ""
  });

   // (hardcoded or better, fetch securely later)

  const fetchSecureList = async () => {

    let { data } = await axios.get(getSecureListRoute);
    setSecureList(data.lists);
  }


  const postSecureList = async () => {

    let { data } = await axios.post(setSecureListRoute, { formData });

    fetchSecureList();
  }


  const deleteSecureList = async (id) => {

    let { data } = await axios.post(deleteSecureListRoute, {id});

    fetchSecureList();
  }

  useEffect(() => {

    fetchSecureList();

  }, [])




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postSecureList();
  };

  const handleVerify = async () => {

   let {data} = await  axios.get(getPasswordRoute);

    if (inputPassword ===   data.pass.SecurePass) {
      setVerified(true);
    } else {
      alert("Incorrect Password!");
    }
  };

  if (!verified) {

    return (
      <>
      <Navbar current="Secure"/> 

     
      <div className="passwordBox">
              <p className="passwordHeading">Enter Password to Access Listings </p>
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
    <div id="Secure-Top">
            <Navbar current="Secure"/> 

      <form onSubmit={handleSubmit} className="SecureListingForm" >

      <p>Add Listings</p>
        <select name="type" value={formData.type} onChange={handleChange}  className="SecureListingFormSelect" required>
          <option value=""> Select Type  </option>
          <option value="To Watch">To Watch</option>
          <option value="Wishlist">Wishlist</option>
          <option value="Link">Link</option>
          <option value="Tip">Tip</option>
        </select>

        <br /><br />

   
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />

        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <p className="SecListP">Listings</p>

      {secureList.map((item) => {
        const dateObj = new Date(item.Date);
        const date1 = dateObj.toLocaleDateString();
        const time1 = dateObj.toLocaleTimeString();

        return (
          <div key={item._id} className="SecureListContainer" >

            {item.Type == "Wishlist" ?

              <div className="SecureListBox">
<div className="SecListHeading WishList">Wishlist</div>     
<div className="SecListDes"> <strong>Des : </strong> {item.Description}</div>     
<div className="SecListDate">{date1}</div>
<div className="SecListTime">{time1}</div>          
<button className="SecListButton" onClick={() => deleteSecureList(item._id)}>Delete</button>
       </div>
              : null}

          
{item.Type == "To Watch" ?

<div className="SecureListBox">
<div className="SecListHeading ToWatch">To Watch</div>     
<div className="SecListDes"> <strong>Des : </strong> {item.Description}</div>     
<div className="SecListDate">{date1}</div>
<div className="SecListTime">{time1}</div>          
<button className="SecListButton" onClick={() => deleteSecureList(item._id)}>Delete</button>
</div>
: null}

          
{item.Type == "Tip" ?

<div className="SecureListBox">
<div className="SecListHeading Tip">Tip</div>     
<div className="SecListDes"> <strong>Des : </strong> {item.Description}</div>     
<div className="SecListDate">{date1}</div>
<div className="SecListTime">{time1}</div>          
<button className="SecListButton" onClick={() => deleteSecureList(item._id)}>Delete</button>
</div>
: null}
          
          {item.Type == "Link" ?

<div className="SecureListBox">
<div className="SecListHeading Link">Link</div>     
<a href={item.Description} className="SecListDes"> <strong>Des : </strong> {item.Description}</a>     
<div className="SecListDate">{date1}</div>
<div className="SecListTime">{time1}</div>          
<button className="SecListButton" onClick={() => deleteSecureList(item._id)}>Delete</button>
</div>
: null}

          </div>

        )

      })}

<a href="/secure#Secure-Top" className="topArrow"><i className="fa-solid fa-circle-up fa-lg" style={{color : "#626060"}}></i></a>

    </div>
  );


}

export default Secure;
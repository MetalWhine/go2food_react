import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Cookies from 'universal-cookie';
import axios from 'axios';


let validateToken = async function () {
  const cookies = new Cookies();
  let token_cookies = cookies.get("jwt_auth");
  let token_session_storage = window.sessionStorage.getItem("jwt_auth")
  let token_value = "null"

  // check first if there are jwt values either in cookies or session storage
  if (token_cookies)
  {
    token_value = token_cookies;
  }
  else if (token_session_storage)
  {
    token_value = token_session_storage
  }

  // if both cookies and session storage have no jwt values just return false
  if (token_value === "null")
  {
    return false
  }

  let result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/validate_token/`, {
    token: token_value
  })
    .then(function (response) {
      if (response.data["detail"] === "Invalid Token") {
        return false
      }
      else if (response.data["detail"] === "Signature has expired") {
        return false
      }
      else {
        return true
      }
    })
    .catch(function (error) {
      console.log(error, 'error');
      return false
    });

  return result;
}

function RequireAuthWithNavbar({ children }) {
  const [initialCheckValue, setInitialCheckValue] = useState(true);
  const [actualCheckValue, setActualCheckValue] = useState(false);
  const navigate = useNavigate();

  const checkLogin = async () => {
    let login_valid = await validateToken();
    setInitialCheckValue(login_valid);
    setActualCheckValue(login_valid)
  }

  useEffect(() => {
    checkLogin();
  }, [])

  useEffect(() => {
    if (!initialCheckValue) {
      navigate("/login");
    }
  }, [initialCheckValue])


  if (actualCheckValue)
  {
    return (
      <div>
        <Navbar />
        {children}
      </div>
    )
  }

};

export default RequireAuthWithNavbar;
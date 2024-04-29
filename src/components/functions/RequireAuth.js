import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';


let validateToken = async function () {
  const cookies = new Cookies();
  let token_value = cookies.get("jwt_auth");

  let result = await axios.post('http://localhost:8000/validate_token/', {
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

function RequireAuth({ children }) {
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
    return children;
  }

};

export default RequireAuth;
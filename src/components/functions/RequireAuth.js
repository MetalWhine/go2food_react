import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
let token_value = cookies.get("jwt_auth")

let token_valid = await axios.post('http://localhost:8000/validate_token/', {
  token: token_value
})
.then(function (response) {
  console.log(token_value)
  if (response.data["detail"] === "Invalid Token") 
  {
    return false
  }
  else if (response.data["detail"] === "Signature has expired")
  {
    return false
  }
  else 
  { 
    return true
  }
})
.catch(function (error) {
  console.log(error, 'error');
  return false
});

const RequireAuth = ({ children }) => {
  
  if (!token_valid) {
    return <Navigate to="/login" replace />; // Redirect to login
  }

  return children;
};

export default RequireAuth;
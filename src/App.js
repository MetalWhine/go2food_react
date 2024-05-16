import {React, useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/pages/Dashboard";
import Messages from "./components/pages/Messages";
import Settings from "./components/pages/Settings";
import FoodOrder from "./components/pages/FoodOrder";
import Favorites from "./components/pages/Favorites";
import Bills from "./components/pages/Bills";
import Invalid from "./components/pages/Invalid";
import History from "./components/pages/History";
import Login from "./components/pages/Login";
import Restaurant from "./components/pages/Restaurants";
import Register from "./components/pages/Register";
import RequireAuthWithNavbar from "./components/wrappers/RequireAuthWithNavbar";

// non pages import
import { BackendURL } from "./components/configs/GlobalVar";
import axios from "axios";
import { UseUserInfo } from "./store";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  // toast functionabilities
  const notifyOrderAlreadyOrder = () => toast.error('You already have an active order');
  const notifyOrderRejected = () => toast.error('Your order is rejected by the restaurant! \n your money has been refunded');
  const notifyOrderSuccess = () => toast.success('Order is placed');
  const notifyOrderAccepted = () =>  toast.success("Your order has been accepted by the restaurant!")

  // global states
  const { user_id } = UseUserInfo((state) => ({
    user_id: state.user_id,
}));

// local states
const [ActiveOrderData, SetActiveOrderData] = useState(null)
const [previousOrderStatus, SetPreviousOrderStatus] = useState(null)

// functions

// delete a rejected order data
const DeleteActiveOrder = (id) => {
  axios.delete(`${BackendURL}/delete_active_order/${id}`)
  .then((response) => {
      if (response.data)
      {
        return response.data
      }
  })
  .catch((error) => {
      console.log(error, 'error');
      return null
  });
}

// get active order data on page load
const GetActiveOrderData = () => {
    axios.post(`${BackendURL}/get_active_order_by_user_id`, {
        id: user_id
    })
    .then((response) => {
        let status = response.data["status"]
        if (status === "accepted")
        {
          if (previousOrderStatus === "pending")
          {
            notifyOrderAccepted();
          }
        }

        if (status === "rejected")
        {
          notifyOrderRejected()
          SetActiveOrderData(DeleteActiveOrder(response.data["_id"]));
          SetPreviousOrderStatus(null);
          return;
        }

        SetActiveOrderData(response.data)
        SetPreviousOrderStatus(status);

    })
    .catch((error) => {
        console.log(error, 'error');
    });
}

// gets called after the next 3 seconds onwards to get update on the active order data
useEffect(() => {
    let timerId = setTimeout(GetActiveOrderData, 3000);
    return () => clearInterval(timerId)
})

  return (
    <BrowserRouter>
        <Toaster />
        <Routes>
          {/* with navbar*/}
          <Route exact path='/' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Dashboard /></RequireAuthWithNavbar>} />
          <Route exact path='/restaurant/:id' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Restaurant /></RequireAuthWithNavbar>} />
          <Route exact path='/orders' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><FoodOrder ActiveOrderData={ActiveOrderData}/></RequireAuthWithNavbar>} />
          <Route exact path='/messages' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Messages /></RequireAuthWithNavbar>} />
          <Route exact path='/settings' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Settings /></RequireAuthWithNavbar>} />
          <Route exact path='/Bills' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Bills /></RequireAuthWithNavbar>} />
          <Route exact path='/favorites' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Favorites /></RequireAuthWithNavbar>} />
          <Route exact path='/history' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><History /></RequireAuthWithNavbar>} />
          <Route exact path='/restaurant/:id' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess}><Restaurant /></RequireAuthWithNavbar>} />

          {/* without navbar */}
          <Route exact path='login' element={<Login />} />
          <Route exact path='register' element={<Register />} />
          <Route exact path='*' element={<Invalid />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

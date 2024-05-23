import {React, useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/pages/Dashboard";
import Settings from "./components/pages/Settings";
import FoodOrder from "./components/pages/FoodOrder";
import OrderHistory from "./components/pages/OrderHistory";
import Invalid from "./components/pages/Invalid";
import Login from "./components/pages/Login";
import Restaurant from "./components/pages/Restaurants";
import Register from "./components/pages/Register";
import RequireAuthWithNavbar from "./components/wrappers/RequireAuthWithNavbar";
import RequireAuth from "./components/wrappers/RequireAuth";

// non pages import
import { BackendURL } from "./components/configs/GlobalVar";
import axios from "axios";
import { UseUserInfo } from "./store";
import toast, { Toaster } from 'react-hot-toast';
import Location from "./components/pages/Location";
import { wait } from "./components/utils/Functionabilities";

// function NavbarWithAuthReq ({children}) {
//   return (
//     <RequireAuthWithNavbar notifyInsufficientBalance={notifyInsufficientBalance}>{children}</RequireAuthWithNavbar>
//   )
// }

function App() {
  // toast functionabilities
  const notifyOrderAlreadyOrder = () => toast.error('You already have an active order');
  const notifyOrderRejected = () => toast.error('Your order is rejected by the restaurant! \n your money has been refunded');
  const notifyInsufficientBalance = () => toast.error("You have insufficient balance, please top up your balance before making this purchase!")
  const notifyOrderSuccess = () => toast.success('Order is placed');
  const notifyPremiumUpdate = () => toast.success("You are now a premium member!")
  const notifyOrderAccepted = () =>  toast.success("Your order has been accepted by the restaurant!")
  const notifyOrderDelivering = () => toast('A courier is delivering your order!', {
    icon: '🛵',
  });
  const notifyOrderDelivered = () => toast('Your order has been delivered!', {
    icon: '🛵',
  });
  const notifyUnsubscribe = () => toast('You unsubscribed from go2food pro...', {
    icon: '😥',
  });
  const notifySuccessLocationUpdate = () => toast.success("Successfully updated location")
  const notifyFailedLocationUpdate = () => toast.error("Failed to update location due to server error")

  // global states
  const { user_id, balance, UpdateBalance } = UseUserInfo((state) => ({
    user_id: state.user_id,
    balance: state.balance,
    UpdateBalance: state.UpdateBalance,
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

const CompleteActiveOrder = async (id) => {
  await wait(15000)
  await axios.post(`${BackendURL}/complete_active_order`, {
    id: id
  })
  .then(async (response) => {
      if (response.data)
      {
        notifyOrderDelivered();
        SetActiveOrderData(response.data);
      }
  })
  .catch((error) => {
      console.log(error, 'error');
      return null
  });
}

// get active order data on page load
const GetActiveOrderData = async () => {
    axios.post(`${BackendURL}/get_active_order_by_user_id`, {
        id: user_id
    })
    .then(async (response) => {
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
          if (previousOrderStatus !== null)
          {
            var new_balance = balance + response.data["total_price"]
            UpdateBalance(Math.round(new_balance*100)/100)
          }
          notifyOrderRejected()
          SetPreviousOrderStatus(null);
          SetActiveOrderData(DeleteActiveOrder(response.data["_id"]));
          return;
        }

        if (status === "delivered")
          {
            if (previousOrderStatus === "accepted")
              {
                notifyOrderDelivering(status)
                SetActiveOrderData(response.data)
                SetPreviousOrderStatus(null)
              }
            
            SetPreviousOrderStatus(null);
            SetActiveOrderData(response.data)
            CompleteActiveOrder(response.data["_id"])
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
          <Route exact path='/' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><Dashboard notifyInsufficientBalance={notifyInsufficientBalance} notifyPremiumUpdate={notifyPremiumUpdate} /></RequireAuthWithNavbar>} />
          <Route exact path='/restaurant/:id' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><Restaurant /></RequireAuthWithNavbar>} />
          <Route exact path='/orders' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><FoodOrder ActiveOrderData={ActiveOrderData}/></RequireAuthWithNavbar>} />
          <Route exact path='/settings' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><Settings notifyInsufficientBalance={notifyInsufficientBalance} notifyPremiumUpdate={notifyPremiumUpdate} notifyUnsubscribe={notifyUnsubscribe} /></RequireAuthWithNavbar>} />
          <Route exact path='/order-history' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><OrderHistory /></RequireAuthWithNavbar>} />
          <Route exact path='/restaurant/:id' element={<RequireAuthWithNavbar notifyOrderAlreadyOrder={notifyOrderAlreadyOrder} notifyOrderSuccess={notifyOrderSuccess} notifyInsufficientBalance={notifyInsufficientBalance}><Restaurant /></RequireAuthWithNavbar>} />
          <Route exact path='/location' element={<RequireAuth> <Location notifySuccessLocationUpdate={notifySuccessLocationUpdate} notifyFailedLocationUpdate={notifyFailedLocationUpdate} /> </RequireAuth>} /> {/* TODO: Ganti biar harus ada auth dll */}

          {/* without navbar */}
          <Route exact path='login' element={<Login />} />
          <Route exact path='register' element={<Register />} />
          <Route exact path='*' element={<Invalid />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

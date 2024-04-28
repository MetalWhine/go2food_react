import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WithNavbar from "./components/router-elements/WithNavbar";
import WithoutNavbar from "./components/router-elements/WithoutNavbar";
import Dashboard from "./components/pages/Dashboard";
import Messages from "./components/pages/Messages";
import Settings from "./components/pages/Settings";
import FoodOrder from "./components/pages/FoodOrder";
import Favorites from "./components/pages/Favorites";
import Bills from "./components/pages/Bills";
import Invalid from "./components/pages/Invalid";
import History from "./components/pages/History";
import Login from "./components/pages/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route element={<WithNavbar />}>
              <Route exact path='/' element={<Dashboard />} />
              <Route exact path='/orders' element={<FoodOrder />} />
              <Route exact path='/messages' element={<Messages />} />
              <Route exact path='/settings' element={<Settings />} />
              <Route exact path='/Bills' element={<Bills />} />
              <Route exact path='/favorites' element={<Favorites />} />
              <Route exact path='/history' element={<History />} />
            </Route>
            <Route element={<WithoutNavbar />}>
              <Route exact path='login' element={<Login />} />
              <Route exact path='*' element={<Invalid />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

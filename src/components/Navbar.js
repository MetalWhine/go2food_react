import React from "react";
import Appbar from "./items/Appbar";
import BalanceBanner from "./items/BalanceBanner";
import NavSideBar from "./items/NavSideBar";
import OrderBar from "./items/OrderBar";

function Navbar () {
    return (
        <div>
            <Appbar />
            <NavSideBar />
            <BalanceBanner />
            <OrderBar />
        </div>
    )
}

export default Navbar;
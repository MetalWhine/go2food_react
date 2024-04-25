import React from "react";
import Appbar from "./items/Appbar";
import BalanceBanner from "./items/BalanceBanner";
import NavSideBar from "./items/NavSideBar";

function Navbar () {
    return (
        <div>
            <Appbar />
            <NavSideBar />
            <BalanceBanner />
        </div>
    )
}

export default Navbar;
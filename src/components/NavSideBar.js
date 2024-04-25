import React from "react";
import {useState, useEffect} from "react";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import TryOutlinedIcon from '@mui/icons-material/TryOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

function ListItemButton({IconImage, text}) {
    return (
        <button className="rounded-[10px] py-4 hover:bg-gray-300 w-full active:bg-green-900 active:text-white">
            < IconImage/>
            {text}
        </button>
    )
}

function Banner() {
    return (
        <div className="rounded-[12px] w-[90%] my-4 p-4 m-auto flex flex-col bg-green-800 shadow-md">
            <p className="py-4 px-2 text-white font-bold text-[18px]/[26px]">
                Upgrade your account to Get Free Voucher
            </p>
            <button className="py-2 px-4 flex items-start w-fit mt-4 bg-white rounded-md hover:bg-gray-300 active:bg-gray-600 active:text-white drop-shadow-md">
                Upgrade
            </button>
        </div>
    )
}

const list_buttons = [[RestaurantOutlinedIcon, "Dashboard"], 
                      [DeliveryDiningOutlinedIcon, "Food Order"],
                      [TryOutlinedIcon, "Favorite"],
                      [ChatOutlinedIcon, "Message"],
                      [HistoryOutlinedIcon, "Order History"],
                      [ReceiptLongOutlinedIcon, "Bills"],
                      [SettingsOutlinedIcon, "Settings"]]

function NavSideBar() {
    const [NavSideBarShown, SetNavSideBarShown] = useState(false);
    const navSideBarMenuSmall = document.getElementById('navSideBarMenuSmall');
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 640px)").matches
      )

    const navSideBarBurgerButtonCliked = () => {
        SetNavSideBarShown(!NavSideBarShown);
    }

    useEffect(() => {
        if (NavSideBarShown)
        {
            try 
            {
                navSideBarMenuSmall.classList.remove("hidden");
                navSideBarMenuSmall.classList.remove("sm-hidden");
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                navSideBarMenuSmall.classList.add("hidden");
                navSideBarMenuSmall.classList.remove("sm-hidden");
            }
            catch (e)
            {

            }
        }
    }, [NavSideBarShown]);
    
    // check if the screen changed from small screen to big screen
    useEffect(() => {
    window
    .matchMedia("(min-width: 640px)")
    .addEventListener('change', e => {
        setMatches( e.matches )});
    }, []);

    // automatically closes the navsidebar when switching to large screen
    useEffect(() => {
        if (matches)
        {
            SetNavSideBarShown(false);
        }
    }, [matches])

    
    return (
        <div className="z-[9]">
            <div id="navSideBarBurgerButton" onClick={navSideBarBurgerButtonCliked} className="bg-slate-50 ml-2 p-2 fixed mt-[72px] block sm:hidden rounded-[12px] hover:bg-gray-300 active:bg-gray-400 shadow-xl">
                <MenuOutlinedIcon />
            </div>

            <div id="navSideBarMenuLarge" className=" bg-white fixed mt-16 w-[250px] rounded-br-[20px] hidden sm:block shadow-xl">

                {/* nav bar buttons div container */}
                <div className="flex flex-col p-4">
                    {
                        list_buttons.map(e => {
                            return (
                                <ListItemButton IconImage={e[0]} text={e[1]}/>
                            )
                        })
                    }
                </div>

                {/* nav bar banner container? */}
                <Banner />
            </div>

            <div id="navSideBarMenuSmall" className=" bg-white fixed mt-[72px] left-[50%] -translate-x-[50%] w-[60%] rounded-[20px] animate-nav-bars-menu-popup hidden sm:hidden shadow-xl z-[7]">

                {/* nav bar buttons div container */}
                <div className="flex flex-col p-4">
                    {
                        list_buttons.map(e => {
                            return (
                                <ListItemButton IconImage={e[0]} text={e[1]}/>
                            )
                        })
                    }
                </div>

                {/* nav bar banner container? */}
                <Banner />
            </div>

        </div>
    )
}

export default NavSideBar;
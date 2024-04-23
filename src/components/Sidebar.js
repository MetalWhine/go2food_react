import React from "react";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import TryOutlinedIcon from '@mui/icons-material/TryOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';


function ListItemButton({IconImage, text}) {
    return (
        <button className="rounded-sm py-4 hover:bg-gray-300 w-full active:bg-green-900 active:text-white">
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
            <button className="py-2 px-4 flex items-start w-1/2 mt-4 bg-white rounded-md hover:bg-gray-300 active:bg-gray-600 active:text-white">
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

function Sidebar() {
    

    return (
        <div className="bg-white fixed mt-16 w-[250px] rounded-br-[20px]">

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
    )
}

export default Sidebar;
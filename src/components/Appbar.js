import React from "react";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import "./styles/Appbar.css"

function Appbar() {
    return (
        // main container
        <div className="bg-white flex justify-between items-center h-16 mx-auto px-4 w-full fixed shadow-md">
            <h1 className="w-full text-3xl font-bold">Go2Food</h1>

            {/* left most element (buttons and profile picture) main container */}
            <div className="flex">

                {/* buttons container */}
                <div className="flex items-center px-4">
                        <div className="p-2"><CommentOutlinedIcon /></div>
                        <div className="p-2"><NotificationsOutlinedIcon /></div>
                        <div className="p-2"><SettingsOutlinedIcon /></div>
                </div>

                <div className="p-2">
                    <img class="min-h-10 min-w-10 max-w-12 max-h-12 rounded-md" src={"images/profile_picture_default.jpg"} alt="Rounded avatar"></img>
                </div>
            </div>
        </div>
    )
}

export default Appbar;
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


function MenuCard ({id, pictureUrl, name, description, category, price}) {

    

    return (
        <div className="flex flex-row w-full bg-green-600 rounded-lg p-2 md:p-3 space-x-2 md:space-x-4">
            {/* menu image */}
            <img className="min-w-24 min-h-24 md:min-w-28 md:min-h-28 max-w-24 max-h-24 md:max-w-28 md:max-h-28 h-24 w-24 md:w-28 md:h-28  pointer-events-none rounded-lg" style={{objectFit:"cover"}} src={pictureUrl}></img>

            {/* menu info */}
            <div className="flex flex-col space-y-1 sm:space-y-2 w-full justify-between">
                <div>
                    <div className="flex flex-row sm:space-x-2 space-x-1 items-center">
                        <p className="text-base md:text-xl text-white font-bold line-clamp-1">{name}</p>
                    </div>
                    <p className="text-sm md:text-lg text-white line-clamp-2"> {description} </p>
                </div>
                <p className="text-sm md:text-lg text-white font-bold line-clamp-1"> Category: {category} </p>
            </div>

            {/* menu controls */}
            <div className="w-[80px] flex flex-col space-y-1 sm:space-y-1.5 my-auto">
                <div>
                    {/* plus and minus button */}
                    <div className="flex flex-row">
                        <button className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md">
                            <RemoveIcon />
                        </button>

                        {/* order count */}
                        <div className="text-black text-sm md:text-base mx-auto w-8 sm:w-8 px-1 sm:px-2 py-[2px] bg-white rounded-md none">
                            <div className="flex justify-center">
                                <p className="text-sm sm:text-base select-none">0</p>
                            </div>
                        </div>

                        <button className="text-white bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md">
                            <AddIcon />
                        </button>
                    </div>
                </div>

                {/* price */}
                <div className="flex justify-center">
                    <p className="text-sm md:text-base text-gray-200 font-bold">{price+"$"}</p>
                </div>
            </div>


        </div>
    )
}

export default MenuCard;
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { UseCartOrder } from "../../store";


function MenuCard ({restaurant_id, id, pictureUrl, name, description, category, price}) {
    // global states
    const {items, AddItems, Removeitems} = UseCartOrder((state) => ({
        items: state.items,
        AddItems: state.AddItems,
        Removeitems: state.Removeitems
    }));

    // functions
    const getItemAmount = (id) => {
        const item = items.find((e) => e[0] === id)
        if (item)
        {
            return item[1]
        }

        return 0
    }
    

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
                        <button onClick={() => {Removeitems(restaurant_id, id)}} className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-l-md">
                            <RemoveIcon />
                        </button>

                        {/* order count */}
                        <div className="text-black text-sm md:text-base mx-auto w-8 sm:w-8 px-1 sm:px-2 py-[2px] bg-white">
                            <div className="flex justify-center">
                                <p className="text-sm sm:text-base select-none">{getItemAmount(id)}</p>
                            </div>
                        </div>

                        <button onClick={() => {AddItems(restaurant_id, id)}} className="text-white bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-r-md">
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
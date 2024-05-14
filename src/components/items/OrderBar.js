import {React, useState, useEffect} from "react";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { UseCartOrder } from "../../store";

function OrderBar () {
    // global states
    const {items, totalPrice} = UseCartOrder((state) => ({
        items: state.items,
        totalPrice: state.totalPrice
    }));

    const [OrderBarShown, SetOrderBarShown] = useState(false);
    const OrderBar = document.getElementById('OrderBar');
    const OrderBarOverlay = document.getElementById('OrderBarOverlay');
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 1840px)").matches
      )

    const OrderBarButtonClicked = () => {
        SetOrderBarShown(!OrderBarShown);
    }

    useEffect(() => {
        if (OrderBarShown)
        {
            try 
            {
                OrderBarOverlay.classList.remove("hidden");
                OrderBar.classList.remove("hidden");
                OrderBar.classList.replace("right-[16px]", "left-[50%]");
                OrderBar.classList.add("-translate-x-[50%]")
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                OrderBarOverlay.classList.add("hidden");
                OrderBar.classList.add("hidden");
                OrderBar.classList.replace("left-[50%]", "right-[16px]");
                OrderBar.classList.remove("-translate-x-[50%]")
            }
            catch (e)
            {

            }
        }
    }, [OrderBarShown]);
    
    // check if the screen changed from small screen to big screen
    useEffect(() => {
    window
    .matchMedia("(min-width: 1840px)")
    .addEventListener('change', e => {
        setMatches( e.matches )});
    }, []);

    // automatically closes the navsidebar when switching to large screen
    useEffect(() => {
        if (matches)
        {
            SetOrderBarShown(false);
        }
    }, [matches])

    return (
        // main container
        <div className="z-[8]">

            <div onClick={OrderBarButtonClicked} id="OrderBarOverlay" className="hidden fixed w-full h-[100vh] bg-black bg-opacity-35"></div>
            {/* button to toggle balance bar while in small devices*/}
            <div onClick={OrderBarButtonClicked} className="bg-green-700 right-[8px] text-white p-2 fixed mt-[120px] block min-[1840px]:hidden rounded-[12px] hover:bg-green-800 active:bg-green-900 shadow-xl">
                <MenuBookIcon />
            </div>

            {/* order bar list */}
            <div id="OrderBar" className="min-[1840px]:flex flex-col space-y-2 w-[255px] bg-white hidden  p-2 right-[16px] fixed mt-[180px] rounded-md shadow-xl animate-nav-bars-menu-popup">
                <p className="text-center text-lg font-bold">Order Cart</p>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                {/* order list and order button*/}
                {
                    items.length === 0 ?
                    <div>
                        <p className="text-center text-base">you currently have no orders</p>
                        <p className="text-center text-sm text-gray-400">go to one of the restaurants and start odering!</p>
                    </div>
                    :
                    <div className="flex flex-col space-y-1 mx-2">
                        {
                            items.map((e, index) => {
                                return (
                                    <div key={index} className="flex flex-row justify-between">
                                        <p className="text-base">{e[1]}</p>
                                        <div className="flex flex-row items-center">
                                            <p> {e[3]} </p>
                                            <p className="text-black text-opacity-50 text-center text-xs">x</p>
                                            <p className="text-md text-opacity-80"> {e[2]}$ </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className="flex flex-row justify-between items-center pt-4 space-x-2">
                            <hr className="h-0 border-b border-solid border-grey-500 grow" />
                            <div className="flex flex-row space-x-2">
                                <p className="font-bold">total:</p>
                                <p>{totalPrice}$</p>
                            </div>
                        </div>
                        <div className="pt-6 w-full">
                            <button className="p-2 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg text-white text-lg font-bold w-full">ORDER</button>
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default OrderBar;
import {React, useState, useEffect} from "react";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoadingOverlay from "./LoadingOverlay";
import axios from "axios";
import { BackendURL } from "../configs/GlobalVar";
import { wait } from "../utils/Functionabilities";
import { UseCartOrder, UseUserInfo, UsePositionInfo } from "../../store";

function OrderBar ({notifyOrderAlreadyOrder = () => {}, notifyOrderSuccess = () => {}}) {
    // global states
    const {user_id, username} = UseUserInfo((state) => ({
        user_id: state.user_id,
        username: state.username,
      }));

    const {restaurant_id, items, totalPrice, RemoveCartItems} = UseCartOrder((state) => ({
        restaurant_id: state.restaurant_id,
        items: state.items,
        totalPrice: state.totalPrice,
        RemoveCartItems: state.RemoveCartItems
    }));

    const {latitude, longitude, UpdateLatitude, UpdateLongitude} = UsePositionInfo((state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        UpdateLatitude: state.UpdateLatitude,
        UpdateLongitude: state.UpdateLongitude
      }));

    // local states
    const [locUpdated, SetLocUpdated] = useState(false);
    const [Loading, SetLoading] = useState(false);
    const [OrderBarShown, SetOrderBarShown] = useState(false);
    const [OrderConfirmationShown, SetOrderConfirmationShown] = useState(false);
    const OrderBar = document.getElementById('OrderBar');
    const OrderBarOverlay = document.getElementById('OrderBarOverlay');
    const OrderConfirmation = document.getElementById('OrderConfirmation');
    const OrderConfirmationOverlay = document.getElementById('OrderConfirmationOverlay');

    // functions

    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 1840px)").matches
      )

    const OrderBarButtonClicked = () => {
        SetOrderBarShown(!OrderBarShown);
    }

    const OrderConfirmationOkClicked = async () => {
        SetLoading(true);
        let order_dict = []
        for (let i = 0; i < items.length; i++)
        {
            order_dict.push({
                "item_id": items[i][0],
                "name": items[i][1],
                "amount": items[i][3],
                "price": items[i][2]
            })
        }

        await axios.post(`${BackendURL}/add_active_order/`, {
            user_id: user_id,
            username: username,
            restaurant_id: restaurant_id,
            total_price: totalPrice,
            latitude: latitude,
            longitude: longitude,
            order: order_dict
        })
            .then(async (response) => {
                if (response.data["detail"] === "there is an active order already") {
                    await wait(300);
                    SetLoading(false);
                    SetOrderConfirmationShown(false)
                    SetOrderBarShown(false)
                    notifyOrderAlreadyOrder()
                }
                else if (response.data["detail"] === "active order added succesfully") {
                    await wait(300);
                    RemoveCartItems();
                    SetLoading(false);
                    SetOrderConfirmationShown(false)
                    SetOrderBarShown(false)
                    notifyOrderSuccess()
                }
            })
            .catch((error) => {
                SetLoading(false);
                console.log(error, 'error');
                SetOrderConfirmationShown(false)
            });
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

    useEffect(() => {
        if (OrderConfirmationShown)
        {
            try 
            {
                OrderConfirmationOverlay.classList.remove("hidden");
                OrderConfirmation.classList.remove("hidden");
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                OrderConfirmationOverlay.classList.add("hidden");
                OrderConfirmation.classList.add("hidden");
            }
            catch (e)
            {

            }
        }
    }, [OrderConfirmationShown]);

    // functions
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            UpdateLongitude(pos.coords.longitude);
            UpdateLatitude(pos.coords.latitude);
            SetLocUpdated(true)
        })
    }, [])
    
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
        <div className="z-[100]">
            {Loading ? <LoadingOverlay /> : <div/>}
            <div onClick={OrderBarButtonClicked} id="OrderBarOverlay" className="hidden fixed w-full h-[100vh] bg-black bg-opacity-35"></div>
            <div onClick={() => {SetOrderConfirmationShown(false)}} id="OrderConfirmationOverlay" className="hidden fixed w-full h-[100vh] bg-black bg-opacity-35 z-[100]"></div>

            {/* button to toggle balance bar while in small devices*/}
            <div onClick={OrderBarButtonClicked} className="bg-green-700 right-[8px] text-white p-2 fixed mt-[120px] block min-[1840px]:hidden rounded-[12px] hover:bg-green-800 active:bg-green-900 shadow-xl z-[9]">
                <MenuBookIcon />
            </div>

            {/* order bar list */}
            <div id="OrderBar" className="min-[1840px]:flex flex-col space-y-2 w-[255px] bg-white hidden p-2 right-[16px] fixed mt-[180px] rounded-md shadow-xl animate-nav-bars-menu-popup z-[100]">
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
                            <button onClick={() => {SetOrderConfirmationShown(true)}} className="p-2 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg text-white text-lg font-bold w-full">ORDER</button>
                        </div>
                    </div>
                }
            </div>

            {/* order confirmation popup */}
            <div id="OrderConfirmation" className="w-[255px] h-[200px] bg-white hidden p-2 fixed mt-[180px] rounded-md shadow-xl animate-nav-bars-menu-popup left-[50%] -translate-x-[50%] z-[101]">
                <div className="flex flex-col space-y-2 h-full justify-between">
                    <div className="space-y-2">
                        <p className="text-center text-xl font-bold"> Are you sure? </p>
                        <div>
                            <p className="text-center">please double check your order</p>
                            <p className="text-center">once the restaurant accepted the order, you can't cancel it</p>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-6 justify-between">
                        <button onClick={() => {SetOrderConfirmationShown(false)}} className="bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg p-2 text-white text-lg font-bold">CANCEL</button>
                        <button onClick={() => {OrderConfirmationOkClicked()}} className="bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg p-2 text-white text-lg font-bold w-[80px]">OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderBar;
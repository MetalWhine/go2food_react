import {React, useState, useEffect} from 'react';
import LoadingOverlay from '../items/LoadingOverlay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { BackendURL } from '../configs/GlobalVar';
import { UseUserInfo } from '../../store';
import CompletedOrderCard from '../items/CompletedOrderCard';
import { Pagination, Box } from '@mui/material';

// date picker library
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { wait } from '@testing-library/user-event/dist/utils';

function OrderHistory () {
    // global data
    const { user_id} = UseUserInfo((state) => ({
        user_id: state.user_id
      }));

    // local states
    const location = useLocation();
    const [CurrentSelectedOrderRateId, SetCurrentSelectedOrderRateId] = useState(null);
    const [CurrentSelectedRestaurantId, SetCurrentSelectedRestaurantId] = useState(null);
    const [CurrentSelectedRestaurantName, SetCurrentSelectedRestaurantName] = useState("");
    const [Loading, SetLoading] = useState(false);
    const [SelectedRating, SetSelectedRating] = useState(3);
    const [CompletedOrders, SetCompletedOrders] = useState(null);
    const [RatingPopupShown, SetRatingPopupShown] = useState(false);
    const [FilterByDate, SetFilterByDate] = useState(false)

    // pagination states
    const [totalPages, SetTotalPages] = useState(3);
    const [currentPage, SetCurrentPage] = useState(1);

    // date states
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // hardcoded element
    const RatingPopup = document.getElementById('RatingPopup');
    const RatingPopupOverlay = document.getElementById('RatingPopupOverlay');
    const itemperpage = 8;

    // paginations functions
    const handlePaginationChange = (event, value) =>
        { 
            SetCurrentPage(value); 
        };
    
    // date time picker functions
    const ToggleFilterByDate = () => {
        SetFilterByDate(!FilterByDate);
    }

    const SetStartDateInput = (val) => {
        if (val < endDate)
        {
            setStartDate(val)
        }
    }

    const SetEndDateInput = (val) => {
        if (val > startDate)
        {
            setEndDate(val)
        }
    }
    

    // functions
    const RatingPopupOpen = (order_id, restaurant_id, restaurant_name) => {
        SetRatingPopupShown(true);
        SetCurrentSelectedOrderRateId(order_id);
        SetCurrentSelectedRestaurantId(restaurant_id);
        SetCurrentSelectedRestaurantName(restaurant_name);
    }

    const RatingPopupClose = () => {
        SetRatingPopupShown(false);
        SetCurrentSelectedOrderRateId(null);
        SetCurrentSelectedRestaurantId(null);
        SetCurrentSelectedRestaurantName("");
        SetSelectedRating(3);
    }

    // get active order data on page load or later on current page changes on pagination
    const GetCompletedOrderData =  async () => {
        SetLoading(true)
        let startQuery = "null"
        let endQuery = "null"
        if (FilterByDate)
        {
            startQuery = startDate.toISOString().slice(0, -1);
            endQuery = endDate.toISOString().slice(0, -1);
        }
        await axios.post(`${BackendURL}/get_completed_orders_by_user_id_sorted?page=${currentPage}&item_per_page=${itemperpage}&startQuery=${startQuery}&endQuery=${endQuery}`, {
            id: user_id,
        })
        .then(async (response) => {
            await wait(300)
            SetTotalPages(response.data["max_page"])
            SetCompletedOrders(response.data["datas"])
            SetLoading(false)
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    // force data update
    const ForceUpdateCompleteOrderData = () => {
        if (currentPage === 1)
            {
                GetCompletedOrderData()
            }
            else
            {
                SetCurrentPage(1)
            }
    }

    // give rating to a specific restaurant
    const GiveRatingToRestaurant =  async () => {
        SetLoading(true)
        await axios.put(`${BackendURL}/update_restaurant_rating`, {
            id: CurrentSelectedRestaurantId,
            order_id: CurrentSelectedOrderRateId,
            rating: SelectedRating
        })
        .then(async (response) => {
            if (response.data["detail"] === "data updated")
            {
                await GetCompletedOrderData();
                RatingPopupClose();
                SetLoading(false)
            }
            else
            {
                SetLoading(false)
                // give warning toast
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    // gets called on first page load to get active order data or at currentpage change
    useEffect(() => {
        GetCompletedOrderData()
    }, [location, currentPage])

    // update the result when filter by date is toggled off
    useEffect(() => {
        if (FilterByDate === false)
        {
            // essentially this just force to get data again
            ForceUpdateCompleteOrderData()
        }
    }, [FilterByDate])

    // show rating popup
    useEffect(() => {
        if (RatingPopupShown)
        {
            try 
            {
                RatingPopupOverlay.classList.remove("hidden");
                RatingPopup.classList.remove("hidden");
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                RatingPopupOverlay.classList.add("hidden");
                RatingPopup.classList.add("hidden");
            }
            catch (e)
            {

            }
        }
    }, [RatingPopupShown]);

    return (
        <div className="pt-[72px] pb-[50px] flex flex-col mx-[12.5%] sm:mx-[15%] space-y-2 items-center">
            {Loading ? <div className="top-[-72px]"><LoadingOverlay/></div> : ""}
            <div onClick={() => {SetRatingPopupShown(false)}} id="RatingPopupOverlay" className="hidden fixed w-full h-[100vh] bg-black bg-opacity-35 z-[100]"></div>
            <h1 className="text-lg sm:text-xl text-black font-bold">ORDER HISTORY</h1>
            <div className="w-full">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            <div className="flex flex-row justify-start w-full">
                <div className="items-center">
                    {/* filter by date toggle */}
                    <label className="inline-flex items-center mr-3 cursor-pointer select-none h-full">
                        <input onChange={ToggleFilterByDate} type="checkbox" checked={FilterByDate} className="sr-only peer" />
                        <div className="ml-2 w-5 h-5 min-w-5 min-h-5 max-w-5 max-h-5 bg-white hover:bg-gray-300 border-2 rounded-sm border-gray-500 peer-checked:border-0 peer-checked:bg-green-600">
                            <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick" />
                        </div>
                        <span className="ml-3 text-sm font-normal text-gray-900 line-clamp-2">filter by date</span>
                    </label>
                </div>
                <div className={`${FilterByDate ? "flex flex-col sm:flex-row items-center " : "hidden"}`}>
                    <DatePicker className="border bg-black bg-opacity-5 hover:bg-opacity-15 rounded-md select-none" dateFormat={"dd/MM/yyyy"} selected={startDate} onChange={(date) => SetStartDateInput(date)} />
                    <DatePicker className='border bg-black bg-opacity-5 hover:bg-opacity-15 rounded-md select-none' dateFormat={"dd/MM/yyyy"} selected={endDate} onChange={(date) => SetEndDateInput(date)} />
                </div>
                <div className={`${FilterByDate ? "flex items-center": "hidden"}`}>
                    <button onClick={ForceUpdateCompleteOrderData} className="bg-green-600 hover:bg-green-700 active:bg-green-800 p-2 text-white font-bold rounded-md ml-2 ">APPLY</button>
                </div>
            </div>
            {
                CompletedOrders === null ?
                    <div className="top-[-72px]"><LoadingOverlay/></div>
                    :
                    CompletedOrders.length === 0 ?
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold text-black text-opacity-50">You haven't had an order yet...</h1>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            {
                                CompletedOrders.map((e, index) => { 
                                    return (
                                    <CompletedOrderCard key={index} order_id={e["_id"]} restaurant_name={e["restaurant_name"]} restaurant_id={e["restaurant_id"]} total_price={e["total_price"]} distance={e["distance"]} order_data={e["order"]} completed={e["completed"]} status={e["status"]} rating={e["rating"]} RatingPopupOpen={RatingPopupOpen} />
                                    )
                                })
                            }
                        </div>
            }

            <Box justifyContent={"center"} alignItems="center" display={"flex"} sx={{ marginTop:"25px", marginBottom:"15px",}}>
                <Pagination
                    count={totalPages}
                    color='primary'
                    page={currentPage}
                    onChange={handlePaginationChange}
                    shape="rounded"
                    sx={{
                        '& .MuiPaginationItem-root': { // Base styles (optional)
                            color: '#00000',
                            '&.Mui-selected': {
                                backgroundColor: '#16A34A',
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#15803D',
                            },
                        },
                    }}
                />
                </Box>

            {/* rating give popup */}
            <div id="RatingPopup" className="w-[255px] h-[200px] bg-white hidden p-2 fixed mt-[180px] rounded-md shadow-xl animate-nav-bars-menu-popup left-[50%] -translate-x-[50%] z-[101]">
                <div className="flex flex-col space-y-2 h-full justify-between">
                    <div className="space-y-2">
                        <p className="text-center text-xl font-bold"> Rate this restaurant </p>
                        <p className="text-center text-xl text-black text-opacity-75"> {CurrentSelectedRestaurantName} </p>
                        <div className="flex justify-center">
                            <div className="flex items-center">
                                <button onClick={() => {SetSelectedRating(1)}}>
                                    <svg className={`w-6 h-6 ${SelectedRating >= 1 ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400" } ms-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </button>
                                <button onClick={() => {SetSelectedRating(2)}}>
                                    <svg className={`w-6 h-6 ${SelectedRating >= 2 ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400" } ms-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </button>
                                <button onClick={() => {SetSelectedRating(3)}}>
                                    <svg className={`w-6 h-6 ${SelectedRating >= 3 ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400" } ms-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </button>
                                <button onClick={() => {SetSelectedRating(4)}}>
                                    <svg className={`w-6 h-6 ${SelectedRating >= 4 ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400" } ms-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </button>
                                <button onClick={() => {SetSelectedRating(5)}}>
                                    <svg className={`w-6 h-6 ${SelectedRating >= 5 ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400" } ms-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-6 justify-between">
                        <button onClick={RatingPopupClose} className="bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg p-2 text-white text-lg font-bold">CANCEL</button>
                        <button onClick={GiveRatingToRestaurant} className="bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg p-2 text-white text-lg font-bold w-[80px]">OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderHistory;
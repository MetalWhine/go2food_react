import { React, useState, useEffect } from 'react';
import LoadingOverlay from '../items/LoadingOverlay';
import axios from 'axios';
import { BackendURL } from '../configs/GlobalVar';
import { UseUserInfo } from '../../store';
import { useLocation } from 'react-router-dom';

function FoodOrder({ActiveOrderData}) {
    
    return (
        <div className="pt-[72px]">
            {
                !ActiveOrderData ?
                    <LoadingOverlay />
                    :
                    ActiveOrderData.length === 0 ?
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold">You have no active orders...</h1>
                            <h2 className="text-lg text-black text-opacity-80"> Go to a restaurant and start ordering!</h2>
                        </div>
                        :
                        ActiveOrderData["status"] === "pending" ?
                            <div>
                                <div className='flex flex-col space-y-3 sm:space-y-4 justify-center items-center bg-white'>
                                    <h1 className="text-lg sm:text-xl font-bold"> The restaurant is receiving your order</h1>
                                    <div className="flex flex-row space-x-1 sm:space-x-2 z-[0]">
                                        <div className='sm:h-4 sm:w-4 h-2 w-2 bg-black bg-opacity-50 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                        <div className='sm:h-4 sm:w-4 h-2 w-2 bg-black bg-opacity-50 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                        <div className='sm:h-4 sm:w-4 h-2 w-2 bg-black bg-opacity-50 rounded-full animate-bounce'></div>
                                    </div>
                                </div>
                            </div>
                            :
                            ActiveOrderData["status"] === "accepted" ?
                                <div>
                                    <div className='flex flex-col space-y-3 sm:space-y-4 justify-center items-center bg-white'>
                                        <div className="flex flex-col items-center justify-center">
                                            <h1 className="text-lg sm:text-xl font-bold"> The restaurant has accepted your order</h1>
                                            <h2 className="text-lg sm:text-xl font-bold text-black text-opacity-50"> Let the restaurant cook...</h2>
                                        </div>
                                        <div className="flex flex-row space-x-1 sm:space-x-2 z-[0]">
                                            <p className='text-base rounded-full animate-bounce [animation-delay:-0.3s]'>🔥</p>
                                            <p className='text-base rounded-full animate-bounce [animation-delay:-0.15s]'>🔥</p>
                                            <p className='text-base rounded-full animate-bounce'>🔥</p>
                                        </div>
                                    </div>
                                </div>
                                :
                                // status is delivered (malas refactor database gais}
                                <div>
                                    <div className='flex flex-col space-y-3 sm:space-y-4 justify-center items-center bg-white'>
                                        <div className="flex flex-col items-center justify-center">
                                            <h1 className="text-lg sm:text-xl font-bold"> The courier is delivering your order</h1>
                                            <h2 className="text-lg sm:text-xl font-bold text-black text-opacity-50"> hold tight! Your food is coming!</h2>
                                        </div>
                                        <div className="flex flex-row space-x-1 sm:space-x-2 z-[0]">
                                            <p className='text-base rounded-full animate-bounce [animation-delay:-0.3s]'>🛵</p>
                                            <p className='text-base rounded-full animate-bounce [animation-delay:-0.15s]'>💨</p>
                                            <p className='text-base rounded-full animate-bounce'>💨</p>
                                        </div>
                                    </div>
                                </div>
            }

        </div>
    )
}

export default FoodOrder;
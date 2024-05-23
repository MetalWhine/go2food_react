import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import { UseUserInfo } from '../../store';
import LoadingOverlay from '../items/LoadingOverlay';
import axios from 'axios';
import { BackendURL } from '../configs/GlobalVar';
import { wait } from '../utils/Functionabilities';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Settings ({notifyInsufficientBalance = () => {}, notifyPremiumUpdate = () => {}, notifyUnsubscribe = () => {}}) {
    // global states
    const { user_id, location, premium, balance, UpdateBalance, UpdatePremium } = UseUserInfo((state) => ({
        user_id: state.user_id,
        location: state.location,
        premium: state.premium,
        balance: state.balance,
        UpdateBalance: state.UpdateBalance,
        UpdatePremium: state.UpdatePremium
      }));
    

    // local states
    const [Loading, SetLoading] = useState(false)
    const navigate = useNavigate()

    // functions
    const navigateLogout = (e) => {
        e.preventDefault()
        cookies.remove('jwt_auth', { path: '/' });
        navigate("/login")
    }

    // upgrade user to premium
    const UpgradeToPremium = async () => {
        SetLoading(true)
        axios.post(`${BackendURL}/update_user_to_premium/`, {
            id: user_id,
        })
        .then(async (response) => {
            if (response.data["detail"] === "insufficient balance")
            {
                await wait(300)
                notifyInsufficientBalance()
                SetLoading(false)
            }
            else if (response.data["detail"] === "the user is now a premium user")
            {
                await wait(300)
                notifyPremiumUpdate()
                var new_balance = balance - 9.99
                UpdateBalance(Math.round(new_balance*100)/100)
                UpdatePremium(true)
                SetLoading(false)
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    const DowngradeFromPremium = async () => {
        SetLoading(true)
        axios.post(`${BackendURL}/downgrade_user_from_premium/`, {
            id: user_id,
        })
        .then(async (response) => {
            if (response.data["detail"] === "the user premium status is downgraded")
            {
                await wait(300)
                UpdatePremium(false)
                notifyUnsubscribe()
                SetLoading(false)
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    return (
        <div className="pt-[72px] pb-[50px] flex flex-col mx-[12.5%] sm:mx-[15%] space-y-3">
            {Loading ? <LoadingOverlay/> : ""}

            <div>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>

            <div className="flex flex-col space-y-1">
                <p className="text-xl font-bold">PREMIUM</p>
                {
                    premium !== null ?
                        premium === true ?
                        <div className="flex flex-row items-center space-x-2">
                            <button onClick={DowngradeFromPremium} className="bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md text-white font-bold p-2 h-full "> UNSUBSCRIBE </button>
                            <p className=""> Lose your premium benefits and unsubscribe from <strong>go2food pro</strong> membership </p>
                        </div>
                        :
                        <div className="flex flex-row items-center space-x-2">
                            <button onClick={UpgradeToPremium} className="bg-green-600 hover:bg-green-700 active:green-red-800 rounded-md text-white font-bold p-2"> SUBSCRIBE </button>
                            <p className=""> Enjoy benefits and subscribe to <strong>go2food pro</strong> for only 9.99$ </p>
                        </div>
                    :
                    <p>loading...</p>
                }
            </div>

            <div>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>

            <div className="flex flex-col ">
                <p className="text-xl font-bold">Location:</p>
                <p className="text-lg text-black text-opacity-75">{location}</p>
                <button onClick={() => {navigate("/location")}} className="text-green-600 hover:text-green-700 hover:underline w-fit"> change your location</button>
            </div>

            <div>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>

            <div className="pt-8">
                <button onClick={navigateLogout} className="text-white font-bold p-2 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md">LOGOUT</button>
            </div>
        </div>
    )
}

export default Settings;
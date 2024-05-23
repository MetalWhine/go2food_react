import {React, useState, useEffect} from "react";
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { BackendURL } from "../configs/GlobalVar";
import { wait } from "../utils/Functionabilities";
import axios from "axios";
import { UseUserInfo } from "../../store";

function BalanceBanner () {
    // global states
    const { user_id, balance, UpdateBalance } = UseUserInfo((state) => ({
        user_id: state.user_id,
        balance: state.balance,
        UpdateBalance: state.UpdateBalance
    }));

    const [BalanceBarShown, SetBalanceBarShown] = useState(false);
    const [Loading, SetLoading] = useState(false);
    const BalanceBar = document.getElementById('BalanceBar');
    const BalanceBarOverlay = document.getElementById('BalanceBarOverlay');

    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 1840px)").matches
      )

    const balanceBarToggleClicked = () => {
        SetBalanceBarShown(!BalanceBarShown);
    }

    const UpdateUserBalance = async (amount) => {
        SetLoading(true)
        await axios.put(`${BackendURL}/update_user_balance/`, {
            id: user_id,
            balance: amount
        })
        .then(async (response) => {
            if (response.data["detail"] === "the balance is updated")
            {
                await wait(200);
                SetLoading(false);
                UpdateBalance(balance + amount);
            }
            else
            {
                SetLoading(false);
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    useEffect(() => {
        if (BalanceBarShown)
        {
            try 
            {
                BalanceBarOverlay.classList.remove("hidden");
                BalanceBar.classList.remove("hidden");
                BalanceBar.classList.remove("xl-block");
                BalanceBar.classList.replace("right-[16px]", "left-[50%]");
                BalanceBar.classList.add("-translate-x-[50%]")
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                BalanceBarOverlay.classList.add("hidden");
                BalanceBar.classList.add("hidden");
                BalanceBar.classList.add("min-[1840px]:block");
                BalanceBar.classList.replace("left-[50%]", "right-[16px]");
                BalanceBar.classList.remove("-translate-x-[50%]")
            }
            catch (e)
            {

            }
        }
    }, [BalanceBarShown]);
    
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
            SetBalanceBarShown(false);
        }
    }, [matches])

    return (
        // main container
        <div className="z-[100]">

            <div onClick={balanceBarToggleClicked} id="BalanceBarOverlay" className="hidden fixed w-full h-[100vh] bg-black bg-opacity-35 z-[100]"></div>
            {/* button to toggle balance bar while in small devices*/}
            <div onClick={balanceBarToggleClicked} className="bg-green-700 right-[8px] text-white p-2 fixed mt-[72px] block min-[1840px]:hidden rounded-[12px] hover:bg-green-800 active:bg-green-900 shadow-xl">
                <AccountBalanceWalletRoundedIcon />
            </div>

            {/* balance banner container */}
            <div id="BalanceBar" className=" bg-green-700 hidden min-[1840px]:block p-1 right-[16px] fixed mt-[72px] rounded-[12px] shadow-xl animate-nav-bars-menu-popup z-[100]">
                <div className="flex flex-row">

                    {/* balance */}
                    <div className=" min-w-[125px] w-[150px] flex flex-col bg-white pl-[18px] pr-[36px] py-2 mx-4 my-4 rounded-md">
                        <div className="text-[17px]/[20px]">
                            <p> Balance </p>
                        </div>
                        <div className="sm:text-xl font-bold text-lg">
                            <p> {`${Loading ? "loading...": `${balance}$`}`} </p>
                        </div>
                    </div>

                    {/* buttons */}
                    <div className="flex flex-row">
                        {/* buttonn */}
                        <div className="flex flex-col">
                            <div className="flex flex-row flex-[1] items-center justify-center">
                                <button onClick={() => {UpdateUserBalance(100)}} disabled={Loading ? true : false} className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-500 p-1">
                                    <VerticalAlignTopOutlinedIcon /> 
                                </button>
                            </div>
                            <div className="flex flex-row flex-[1] items-center justify-center"> 
                                <div className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 p-1">
                                    <FileDownloadOutlinedIcon /> 
                                </div>
                            </div>
                        </div>

                        {/* button information */}
                        <div className="flex flex-col px-2 text-white">
                            <div className="flex flex-[1] items-center">
                                <p>Top-up</p>
                            </div>
                            <div className="flex flex-[1] items-center">
                                <p>Transfer</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default BalanceBanner;
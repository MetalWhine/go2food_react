import {React, useState, useEffect} from "react";
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

function BalanceBanner () {
    const [BalanceBarShown, SetBalanceBarShown] = useState(false);
    const BalanceBarSmallScreen = document.getElementById('BalanceBarSmallScreen');
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 1840px)").matches
      )

    const balanceBarToggleClicked = () => {
        SetBalanceBarShown(!BalanceBarShown);
    }

    useEffect(() => {
        if (BalanceBarShown)
        {
            try 
            {
                BalanceBarSmallScreen.classList.remove("hidden");
                BalanceBarSmallScreen.classList.remove("xl-hidden");
            }   
            catch (e)
            {

            }
        }
        else 
        {
            try 
            {
                BalanceBarSmallScreen.classList.add("hidden");
                BalanceBarSmallScreen.classList.remove("xl-hidden");
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
        <div>
            {/* button to toggle balance bar while in small devices*/}
            <div onClick={balanceBarToggleClicked} className="bg-green-700 right-[8px] text-white p-2 fixed mt-[72px] block min-[1840px]:hidden rounded-[12px] hover:bg-green-800 active:bg-green-900 shadow-xl">
                <AccountBalanceWalletRoundedIcon />
            </div>

            {/* visibe only on big screen*/}
            <div className="bg-green-700 hidden min-[1840px]:block p-1 right-[16px] fixed mt-[72px] rounded-[12px] shadow-xl animate-nav-bars-menu-popup">
                <div className="flex">

                    {/* balance */}
                    <div className="flex flex-col bg-white pl-[18px] pr-[36px] py-2 mx-4 my-4 rounded-md">
                        <div className="text-[17px]/[20px]">
                            <p> Balance </p>
                        </div>
                        <div className="text-xl font-bold">
                            <p> 50 $ </p>
                        </div>
                    </div>

                    {/* buttonn */}
                    <div className="flex flex-col">
                        <div className="flex flex-[1] items-center justify-center">
                            <div className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 p-1">
                                <VerticalAlignTopOutlinedIcon /> 
                            </div>
                        </div>
                        <div className="flex flex-[1] items-center justify-center"> 
                            <div className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 p-1">
                                <FileDownloadOutlinedIcon /> 
                            </div>
                        </div>
                    </div>

                    {/* buttonn */}
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

            {/* visible only on small screen*/}
            <div id="BalanceBarSmallScreen" className="bg-green-700 p-1 left-[50%] -translate-x-[50%] fixed mt-[72px] rounded-[12px] shadow-xl animate-nav-bars-menu-popup hidden min-[1840px]:hidden">
                <div className="flex">

                    {/* balance */}
                    <div className="flex flex-col bg-white pl-[18px] pr-[36px] py-2 mx-4 my-4 rounded-md">
                        <div className="text-[17px]/[20px]">
                            <p> Balance </p>
                        </div>
                        <div className="text-xl font-bold">
                            <p> 50 $ </p>
                        </div>
                    </div>

                    {/* buttonn */}
                    <div className="flex flex-col">
                        <div className="flex flex-[1] items-center justify-center">
                            <div className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 p-1">
                                <VerticalAlignTopOutlinedIcon /> 
                            </div>
                        </div>
                        <div className="flex flex-[1] items-center justify-center"> 
                            <div className="bg-white rounded-[8px] hover:bg-gray-300 active:bg-gray-400 p-1">
                                <FileDownloadOutlinedIcon /> 
                            </div>
                        </div>
                    </div>

                    {/* buttonn */}
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
    )
}

export default BalanceBanner;
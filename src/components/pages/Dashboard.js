import {React, useState, useEffect} from 'react';
import '../../index.css';
import axios from 'axios';
import HorizontalScroll from '../complex-items/HorizontalScroll';
import CategoryCard from '../items/CategoryCard';
import RestaurantCard from '../items/RestaurantCard';
import RestaurantCardSkeleton from '../items/RestaurantCardSkeleton';
import LoadingOverlay from '../items/LoadingOverlay';
import { wait } from '../utils/Functionabilities';
import { useLocation } from 'react-router-dom';
import { BackendURL } from '../configs/GlobalVar';
import { UseUserInfo, UsePositionInfo } from '../../store';
import { Skeleton } from '@mui/material';

const list_categories = [
                         ["burgers"], 
                         ["chickens"],
                         ["asians"],
                         ["seafood"],
                         ["pizzas"],
                         ["beverages"],
                        ]

const skeleton_amount = [ 1,
                          2,
                          3,
                          4,
                          5,
                          6
                        ]

function Dashboard ({notifyInsufficientBalance = () => {}}) {
    // global states
    const {user_id, username, premium, balance, UpdateBalance, UpdatePremium} = UseUserInfo((state) => ({
        user_id: state.user_id,
        username: state.username,
        premium: state.premium,
        balance: state.balance,
        UpdateBalance: state.UpdateBalance,
        UpdatePremium: state.UpdatePremium
      }));

    const {latitude, longitude, UpdateLatitude, UpdateLongitude} = UsePositionInfo((state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        UpdateLatitude: state.UpdateLatitude,
        UpdateLongitude: state.UpdateLongitude
      }));

    // local states
    let location = useLocation()
    const [Loading, SetLoading] = useState(false);
    const [locUpdated, SetLocUpdated] = useState(false);
    const [recommendedLoading, SetRecommendedLoading] = useState(false);
    const [recentRestaurantLoading, SetRecentRestaurantLoading] = useState(false);
    const [list_restaurants, SetListRestaurants] = useState([])
    const [list_recent_restaurants, SetListRecentRestaurants] = useState(null)

    // functions
    const recommendedAtEnd = () => {
        SetRecommendedLoading(true)
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            UpdateLongitude(pos.coords.longitude);
            UpdateLatitude(pos.coords.latitude);
            SetLocUpdated(true)
        })
    }, [location])

    // update the list of restaurants on intial page load
    useEffect(() => {
        if (locUpdated)
        {
            axios.post(`${BackendURL}/get_recommended_restaurants/`, {
                latitude: latitude,
                longitude: longitude
              })
                .then((response) => {
                  for (let index = 0; index < response.data.length; index++)
                  {
                    const arr = [[response.data[index]["_id"],
                                  response.data[index]['name'],
                                  response.data[index]['distance'],
                                  response.data[index]['rating'],
                                  response.data[index]['pictureURL']
                                ]]
                    SetListRestaurants(list_restaurants => [...list_restaurants, ...arr])
                  }
                })
                .catch((error) => {
                  console.log(error, 'error');
                });
        }
    }, [locUpdated])

    // update the list of restaurants on scroll end
    useEffect(() => {
        if (recommendedLoading)
        {
            axios.post(`${BackendURL}/get_recommended_restaurants/`, {
                latitude: latitude,
                longitude: longitude
              })
                .then((response) => {
                  for (let index = 0; index < response.data.length; index++)
                  {
                    const arr = [[response.data[index]["_id"],
                                  response.data[index]['name'],
                                  response.data[index]['distance'],
                                  response.data[index]['rating'],
                                  response.data[index]['pictureURL']
                                ]]
                    SetListRestaurants(list_restaurants => [...list_restaurants, ...arr])
                    SetRecommendedLoading(false)
                  }
                })
                .catch((error) => {
                  console.log(error, 'error');
                });
        }
    }, [recommendedLoading])

    // update the list of recent restaurants based on recent orders
    useEffect(() => {
        if (locUpdated)
        {
            axios.post(`${BackendURL}/get_recent_restaurants/`, {
                id: user_id,
                latitude: latitude,
                longitude: longitude
              })
                .then((response) => {
                  var restaurants = []
                  for (let index = 0; index < response.data.length; index++)
                  {
                    const arr = [ 
                                    response.data[index]["_id"],
                                    response.data[index]['name'],
                                    response.data[index]['distance'],
                                    response.data[index]['rating'],
                                    response.data[index]['pictureURL']
                                ]
                    restaurants.push(arr)
                  }
                  SetListRecentRestaurants(restaurants)
                })
                .catch((error) => {
                  console.log(error, 'error');
                });
        }
    }, [locUpdated])

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
                var new_balance = balance  - 9.99
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

    return (
        <div className="pt-[72px]">
            {Loading ? <LoadingOverlay/>: <div/>}
            {/* welcome message + search bar */}
            <div className="flex flex-col md:flex-row py-2 mx-[12.5%] sm:mx-[15%]">
                <div className='md:p-4 sm:p-2 flex flex-[1] items-center justify-center md:justify-start'>
                    <p className="text-center text-lg sm:text-xl md:text-2xl font-bold">Welcome, {username}!</p>
                </div>
                <div className='py-2 md:px-2 md:py-2 flex min-[810px]:flex-[2] min-[1560px]:flex-[3] min-[1300px]:flex-[4] items-center justify-center'> 
                    <input type="text" id="food_search" className="py-2 px-2 bg-white border w-full border-black text-md sm:text-xl md:text-2xl text-gray-900 rounded-[24px]" placeholder="🔍 search for food"/>
                </div>
            </div>
            
            {/* Discount info / Premium Indicator */}
            <div className="bg-green-600 text-white mx-[12.5%] sm:mx-[15%] px-4 py-3 m-2 rounded-lg space-y-3">
                {premium ?
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">You are a premium user!</h1>
                        <h2 className="mt-2 text-xs sm:text-sm md:text-base"> enjoy fee-less delivery and no service fee! <br/> what are you waiting for? Start ordering now! </h2>
                    </div>
                    :
                    <div className="flex flex-col space-y-2">
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Be a premium user!</h1>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">0$ delivery and service fees</h1>
                            <h2 className="text-xs sm:text-sm md:text-base"> be a premium member by paying {<strong>9.99$</strong>} for no service fees and no delivery fees </h2>
                        </div>
                        <button onClick={() => {UpgradeToPremium()}} className="z-[0] py-1.5 px-2 sm:py-2 sm:px-4 text-sm sm:text-base flex items-start text-black font-semibold w-fit bg-white rounded-md hover:bg-gray-300 active:bg-gray-600 active:text-white drop-shadow-md">
                            UPGRADE
                        </button>
                    </div>
                }
            </div>

            {/*Categories container*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Categories</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"} >
                    {
                        list_categories.map((e, index) => {
                            return (
                                <CategoryCard key={index} name={e[0]} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>
            
            {/*Recommended Foods container*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recommended Foods</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"} scrollEndFunc={recommendedAtEnd}>
                    {
                        locUpdated ? 
                            list_restaurants.length !== 0 ?
                            list_restaurants.map((e, index) => {
                                return (
                                    <RestaurantCard key={index} id={e[0]} name={e[1]} range={e[2]} rating={e[3]} img_url={e[4]} />
                                )
                            }) 
                            :
                            skeleton_amount.map((e, index) => {
                                return (
                                    <RestaurantCardSkeleton key={index} />
                                )
                            })
                        :
                        skeleton_amount.map((e, index) => {
                            return (
                                <RestaurantCardSkeleton key={index} />
                            )
                        })
                    }
                    <RestaurantCardSkeleton />
                </HorizontalScroll>
            </div>

            {/*Recent Orders*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recent Orders</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"}>
                    {
                        locUpdated ? 
                            list_recent_restaurants ?
                                list_recent_restaurants.length !== 0 ?
                                    list_recent_restaurants.map((e, index) => {
                                        return (
                                            <RestaurantCard key={index} id={e[0]} name={e[1]} range={e[2]} rating={e[3]} img_url={e[4]} />
                                        )
                                    })
                                    :
                                    <div className="p-2">
                                        <p className="text-lg text-black font-semibold">you have no recent orders...</p>
                                        <p className="text-base text-black text-opacity-75">go to a restaurant and start ordering!</p>
                                    </div>
                                :
                                skeleton_amount.map((e, index) => {
                                    return (
                                        <RestaurantCardSkeleton key={index} />
                                    )
                                })
                                :
                                skeleton_amount.map((e, index) => {
                                    return (
                                        <RestaurantCardSkeleton key={index} />
                                    )
                                })
                            }
                </HorizontalScroll>
            </div>

        </div>
    )
}

export default Dashboard;
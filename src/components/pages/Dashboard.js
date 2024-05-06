import {React, useState, useEffect} from 'react';
import '../../index.css';
import axios from 'axios';
import HorizontalScroll from '../complex-items/HorizontalScroll';
import CategoryCard from '../items/CategoryCard';
import RestaurantCard from '../items/RestaurantCard';
import RestaurantCardSkeleton from '../items/RestaurantCardSkeleton';
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

function Dashboard () {
    let location = useLocation()
    const [locUpdated, SetLocUpdated] = useState(false);
    const [recommendedLoading, SetRecommendedLoading] = useState(false);

    const recommendedAtEnd = () => {
        // if (recommendedLoading)
        // {
        //     SetRecommendedLoading(false)
        // }
        // else
        // {
        //     SetRecommendedLoading(true)
        // }

        SetRecommendedLoading(true)
    }
    
    const {username} = UseUserInfo((state) => ({
        username: state.username
      }));

    const {latitude, longitude, UpdateLatitude, UpdateLongitude} = UsePositionInfo((state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        UpdateLatitude: state.UpdateLatitude,
        UpdateLongitude: state.UpdateLongitude
      }));

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            UpdateLongitude(pos.coords.longitude);
            UpdateLatitude(pos.coords.latitude);
            SetLocUpdated(true)
        })
    }, [location])

    const [list_restaurants, SetListRestaurants] = useState([])

    const list_recent_orders = [
        ["1", "Legendary Laksa", 0.60, 4.6, "images/restaurant-templates/laksa.png"], 
        ["2", "Ayam Goreng Mas Ganjar", 1.60, 4.2, "images/restaurant-templates/ayam-goreng.png"],
        ["3", "Mie Bakso Pak Kumis", 0.83, 5.0, "images/restaurant-templates/mie-bakso.png"],
        ["4", "Nasi Lemak Uncle Ato", 2.50, 4.5, "images/restaurant-templates/nasi-lemak.png"],
        ["5", "Nasi Ayam Pak Jarwo", 0.69, 4.8, "images/restaurant-templates/nasi-ayam.png"],
        ["6", "Soto Ayam Madura Mas Tretan", 1.89, 4.1, "images/restaurant-templates/soto-ayam.png"],
        ]
    
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

    return (
        <div className="pt-[72px]">
            {/* welcome message + search bar */}
            <div className="flex flex-col md:flex-row py-2 mx-[12.5%] sm:mx-[15%]">
                <div className='md:p-4 sm:p-2 flex flex-[1] items-center justify-center md:justify-start'>
                    <p className="text-center text-lg sm:text-xl md:text-2xl font-bold">Welcome, {username}!</p>
                </div>
                <div className='py-2 md:px-2 md:py-2 flex min-[810px]:flex-[2] min-[1560px]:flex-[3] min-[1300px]:flex-[4] items-center justify-center'> 
                    <input type="text" id="food_search" className="py-2 px-2 bg-white border w-full border-black text-md sm:text-xl md:text-2xl text-gray-900 rounded-[24px]" placeholder="🔍 search for food"/>
                </div>
            </div>
            
            {/* Discount info*/}
            <div className="bg-green-600 text-white mx-[12.5%] sm:mx-[15%] p-2 m-2 rounded-lg">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Get Discount Voucher</h1>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Up to 20%</h1>
                <h2 className="text-xs sm:text-sm md:text-base"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. </h2>
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
                    }
                    <RestaurantCardSkeleton />
                </HorizontalScroll>
            </div>

            {/*Recent Orders*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recent Orders</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"}>
                    {
                        list_recent_orders.map((e, index) => {
                            return (
                                <RestaurantCard key={index} id={e[0]} name={e[1]} range={e[2]} rating={e[3]} img_url={e[4]} />
                            )
                        })
                    }
                    <RestaurantCardSkeleton />
                </HorizontalScroll>
            </div>

        </div>
    )
}

export default Dashboard;
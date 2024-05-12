import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../items/LoadingOverlay";
import { BackendURL } from "../configs/GlobalVar";
import { UsePositionInfo } from "../../store";
import MenuCard from "../items/MenuCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CategoryImage ({category}) {
    return (
        <img className="h-6 w-6 sm:w-8 sm:h-8 md:w-10 md:h-10 " src={`/images/food-categories/${category}.png`}></img>
    )
}

function Restaurant () {
    // global states
    const {latitude, longitude, UpdateLatitude, UpdateLongitude} = UsePositionInfo((state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        UpdateLatitude: state.UpdateLatitude,
        UpdateLongitude: state.UpdateLongitude
      }));

    // local states
    let location = useLocation()
    const restaurant_id = useParams()
    const [loading, SetLoading] = useState(false)
    const [restaurantData, SetRestaurantData] = useState([])
    const [menuData, SetMenuData] = useState([])
    const [locUpdated, SetLocUpdated] = useState(false)


    // functions
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            UpdateLongitude(pos.coords.longitude);
            UpdateLatitude(pos.coords.latitude);
            SetLocUpdated(true)
        })
    }, [location])

    const GetRestaurantData = () => {
        SetLoading(true)
        if (locUpdated)
        {

            axios.post(`${BackendURL}/get_restaurant_byId/`, {
                id: restaurant_id["id"],
                latitude: latitude,
                longitude: longitude
            })
            .then((response) => {
                SetRestaurantData(response.data)
            })
            .catch((error) => {
                console.log(error, 'error');
            });

            SetLoading(false)
        }
    }

    const GetMenuData = () => {
        axios.post(`${BackendURL}/get_menu_restaurant/`, {
            id: restaurant_id["id"]
        })
        .then((response) => {
            SetMenuData(response.data)
        })
        .catch((error) => {
            console.log(error, 'error');
        });
    }

    useEffect(() => {
        GetRestaurantData()
        GetMenuData()
    }, [restaurant_id, locUpdated])


    

    if (restaurantData.length !== 0)
    {
        return (
            <div className="pt-[72px] flex flex-col mx-[12.5%] sm:mx-[15%] space-y-4">

                {/* restaurant banner (restaurant info) */}
                <div className="bg-green-600 flex flex-row space-x-4 rounded-lg w-full p-2 sm:p-3">

                    {/* restaurant name and restaurant picture */}
                    <img className="md:w-44 md:h-44 sm:w-32 sm:h-32 w-28 h-28 rounded-lg  pointer-events-none" style={{objectFit:"cover"}} src={restaurantData.pictureURL}></img>
                    <div className="flex flex-col w-full text-white space-y-0.5 md:space-y-1.5">
                        <div>
                            <h3 className="md:text-2xl sm:text-xl text-lg font-bold line-clamp-1">{restaurantData.name}</h3>
                        </div>

                        {/* ratings distance and categories information*/}
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-row space-x-1 items-center">
                                <img className="md:w-4 md:h-4 w-3 h-3 my-auto pointer-events-none" src="/images/food-categories/star_rating.png" alt="Star rating icon"></img>
                                <p className="md:text-sm text-xs">{restaurantData.rating}</p>
                                <p className="md:text-sm text-xs text-gray-300 font-bold pl-2">{restaurantData.distance + "km"}</p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                {
                                    restaurantData.categories ? 
                                    restaurantData.categories.map((e, index) => {
                                        return (
                                            <CategoryImage key={index} category={e}/>
                                        )
                                    })
                                    :
                                    <div/>
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* separator visual from banner and menu */}
                <div className="flex flex-row items-center space-x-2 md:space-x-4 ">
                    <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>

                {/* div scroll container for the menus list*/}
                <div className="flex flex-col h-full space-y-2 md:space-y-3">
                    {
                        menuData !== 0 ? 
                        menuData.map((e, index) => {
                            return (
                                <MenuCard key={index} restaurant_id={restaurant_id["id"]} id={e["_id"]} pictureUrl={e["pictureURL"]} name={e["name"]} description={e["description"]} category={e["category"]} price={e["price"]}/>
                            )
                        })
                        :
                        <div/>
                    }
                </div>

                
            </div>
        )
    }
    else
    {
        return (
            <LoadingOverlay />
        )
    }
}

export default Restaurant;
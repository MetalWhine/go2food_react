import {React, useState, useEffect} from 'react';
import '../../index.css';
import axios from 'axios';
import HorizontalScroll from '../complex-items/HorizontalScroll';
import CategoryCard from '../items/CategoryCard';
import RestaurantCard from '../items/RestaurantCard';
import RestaurantCardSkeleton from '../items/RestaurantCardSkeleton';
import LoadingOverlay from '../items/LoadingOverlay';
import SearchIcon from '@mui/icons-material/Search';
import { wait } from '../utils/Functionabilities';
import { useNavigate } from 'react-router-dom';
import { BackendURL } from '../configs/GlobalVar';
import { UseUserInfo, UsePositionInfo } from '../../store';
import { Pagination, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Skeleton } from '@mui/material';

const list_categories = [
                         "burgers", 
                         "chickens",
                         "asians",
                         "seafood",
                         "pizzas",
                         "beverages",
                        ]

const skeleton_amount = [ 1, 2, 3, 4, 5, 6, 7, 8 ]

function Dashboard ({notifyInsufficientBalance = () => {}, notifyPremiumUpdate = () => {}}) {
    // global states
    const {user_id, username, premium, balance, location, latitude, longitude, UpdateBalance, UpdatePremium} = UseUserInfo((state) => ({
        user_id: state.user_id,
        username: state.username,
        premium: state.premium,
        balance: state.balance,
        location: state.location,
        latitude: state.latitude,
        longitude: state.longitude,
        UpdateBalance: state.UpdateBalance,
        UpdatePremium: state.UpdatePremium
      }));

    // local states
    const [RatingInputNotFloat, SetRatingInputNotFloat] = useState(false);
    const [DistanceInputNotFloat, SetDistanceInputNotFloat] = useState(false);
    const [FilterDropDownOpen, SetFilterDropDownOpen] = useState(false);
    const [totalPages, SetTotalPages] = useState(3);
    const [currentPage, SetCurrentPage] = useState(1);
    const [searchInput, SetSearchInput] = useState("");
    const [searchTerm, SetSearchTerm] = useState("");
    const [TagSearchTerms, SetTagSearchTerms] = useState([]);
    const [RatingInput, SetRatingInput] = useState("");
    const [RatingTreshold, SetRatingTreshold] = useState(-1);
    const [DistanceInput, SetDistanceInput] = useState("");
    const [DistanceTreshold, SetDistanceTreshold] = useState(-1);
    const [FetchingData, SetFetchingData] = useState(false);
    const [Loading, SetLoading] = useState(false);
    const [recommendedLoading, SetRecommendedLoading] = useState(false);
    const [list_restaurants, SetListRestaurants] = useState([]);
    const [list_restaurants_queried, SetListRestaurantsQueried] = useState([]);
    const [list_recent_restaurants, SetListRecentRestaurants] = useState(null);

    // hardcoded component
    const navigate = useNavigate();
    const itemperpage = 12;

    // functions
    const SearchEnter = (event) => {
        if (event.key === "Enter")
        {
            SetSearchTerm(searchInput);
        }
    }

    const RatingInputEnter = (event) => {
        if (event.key === "Enter")
        {
            SetRatingInputNotFloat(false)
            let parsed = parseFloat(RatingInput);
            if (!isNaN(parsed) && parsed.toString() === RatingInput)
            {
                SetRatingTreshold(RatingInput);
            }
            else
            {
                SetRatingInputNotFloat(true)
            }
        }
    }

    const DistanceInputEnter = (event) => {
        if (event.key === "Enter")
        {
            SetDistanceInputNotFloat(false);
            let parsed = parseFloat(DistanceInput);
            if (!isNaN(parsed) && parsed.toString() === DistanceInput)
            {
                SetDistanceTreshold(DistanceInput);
            }
            else
            {
                SetDistanceInputNotFloat(true)
            }
        }
    }

    const handlePaginationChange = (event, value) =>
    { 
        SetCurrentPage(value); 
    };

    const recommendedAtEnd = () => {
        SetRecommendedLoading(true)
    }

    const FilterDropdownToggle = () => {
        SetFilterDropDownOpen(!FilterDropDownOpen);
    }

    // useEffect(() => {
    //     navigator.geolocation.getCurrentPosition((pos) => {
    //         UpdateLongitude(pos.coords.longitude);
    //         UpdateLatitude(pos.coords.latitude);
    //         SetLocUpdated(true)
    //     })
    // }, [location])

    // update the restaurant list based on query by user
    useEffect(() => {
        SetFetchingData(true);
        axios.post(`${BackendURL}/get_restaurants_based_on_query/`, {
            latitude: latitude,
            longitude: longitude,
            search_name: searchTerm,
            tags: TagSearchTerms,
            currentpage: currentPage,
            radius: DistanceTreshold,
            rating_treshold: RatingTreshold,
            itemperpage: itemperpage
            })
            .then(async (response) => {
                let res = []
                for (let index = 0; index < response.data["datas"].length; index++)
                {
                const arr = [ response.data["datas"][index]["_id"],
                                response.data["datas"][index]['name'],
                                response.data["datas"][index]['distance'],
                                response.data["datas"][index]['rating'],
                                response.data["datas"][index]['pictureURL']
                            ]
                res.push(arr)
                }
                await wait(250)
                SetTotalPages(response.data["max_page"])
                SetListRestaurantsQueried(res)
                SetFetchingData(false);
            })
            .catch((error) => {
                console.log(error, 'error');
                SetFetchingData(false);
            });
    }, [TagSearchTerms, searchTerm, RatingTreshold, DistanceTreshold])

    // update the list of restaurants on intial page load
    useEffect(() => {
        if (latitude)
        {
            SetFetchingData(true);
            axios.post(`${BackendURL}/get_recommended_restaurants_sorted/`, {
                latitude: latitude,
                longitude: longitude
                })
                .then((response) => {
                    let res = []
                    for (let index = 0; index < response.data.length; index++)
                    {
                    const arr = [response.data[index]["_id"],
                                 response.data[index]['name'],
                                 response.data[index]['distance'],
                                 response.data[index]['rating'],
                                 response.data[index]['pictureURL']
                                ]
                    res.push(arr)
                    }
                    console.log(res)
                    SetListRestaurants(res);
                    SetFetchingData(false);
                })
                .catch((error) => {
                    console.log(error, 'error');
                    SetFetchingData(false);
                });
        }
    }, [latitude])

    // update the list of restaurants on scroll end
    useEffect(() => {
        if (recommendedLoading)
        {
            SetFetchingData(true);
            axios.post(`${BackendURL}/get_recommended_restaurants_sorted/`, {
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
                  SetFetchingData(false);
                });
        }
    }, [recommendedLoading])

    // update the list of recent restaurants based on recent orders
    useEffect(() => {
        if (latitude)
        {
            SetFetchingData(true);
            axios.post(`${BackendURL}/get_recent_restaurants_sorted/`, {
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
                    SetFetchingData(false);
                })
                .catch((error) => {
                    console.log(error, 'error');
                    SetFetchingData(false);
                })
        }
    }, [latitude])

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

    return (
        <div className="pt-[72px]">
            {Loading ? <LoadingOverlay/>: <div/>}
            {/* welcome message + search bar */}
            <div className="flex flex-col md:flex-row py-2 mx-[12.5%] sm:mx-[15%] min-[1840px]:mr-[20%]">
                <div className='md:p-4 sm:p-2 flex flex-[1] items-center justify-center md:justify-start'>
                    <p className="text-center text-lg sm:text-xl md:text-2xl font-bold">Welcome, {username}!</p>
                </div>
                <div className="flex flex-row w-full justify-center items-center">
                    <div className='py-2 md:px-2 md:py-2 flex min-[810px]:flex-[2] min-[1560px]:flex-[3] min-[1300px]:flex-[4] items-center justify-center'> 
                        <div className="relative w-full">
                            <input type="text" onKeyUp={SearchEnter} onChange={(e) => {SetSearchInput(e.target.value)}} className="pl-9 py-2 bg-white border w-full border-black text-md sm:text-xl md:text-2xl text-gray-900 rounded-[24px]" placeholder="search for food"/>
                            <SearchIcon className={`absolute left-2 -translate-y-[50%] top-[50%] text-black`} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <button onClick={FilterDropdownToggle} className="p-1 bg-white hover:bg-black hover:bg-opacity-20 active:bg-black active:bg-opacity-30 rounded-lg">
                            <MoreVertIcon />
                        </button>
                        <div className="relative">
                            {/* container of drop down filter input */}
                            <div className={`p-2 space-y-2 rounded-[12px] right-0 absolute bg-gray-100 shadow-xl text-sm md:text-base ${FilterDropDownOpen ? "flex flex-col translate-y-0 opacity-100" : "hidden -translate-y-1 opacity-0"} transition-all`}>
                                <p className="font-bold"> Rating Treshold </p>
                                <input type="text" onKeyUp={RatingInputEnter} onChange={(e) => {SetRatingInput(e.target.value)}} className="pl-5 py-2 bg-white border  border-black text-gray-900 rounded-md" placeholder="rating"/>
                                <p className={`text-pink-600 ${RatingInputNotFloat ? "block" : "hidden"}`}> input must be a number! </p>
                                <p className="font-bold"> Distance Treshold </p>
                                <input type="text" onKeyUp={DistanceInputEnter} onChange={(e) => {SetDistanceInput(e.target.value)}} className="pl-5 py-2 bg-white border  border-black text-gray-900 rounded-md" placeholder="distance"/>
                                <p className={`text-pink-600 ${DistanceInputNotFloat ? "block" : "hidden"}`}> input must be a number! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center py-2 mx-[12.5%] sm:mx-[15%] space-x-1 sm:space-x-1.5 text-sm sm:text-base">
                <p className="font-bold">Delivering To:</p>
                <p>{location}</p>
                <button onClick={() => {navigate("/location")}} className="text-green-600 hover:text-green-700 hover:underline select-none"> not your location?</button>
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
                                <CategoryCard key={index} name={e} selectedTags={TagSearchTerms} SetSelectedTags={SetTagSearchTerms} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>
            
            {
                searchTerm === "" && TagSearchTerms.length === 0 && DistanceTreshold ===-1 && RatingTreshold === -1 ?
                    <div>
                        {/*Recommended Foods container*/}
                        <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                            <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recommended Foods</h1>
                            <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg space-x-4"} scrollEndFunc={recommendedAtEnd}>
                                {
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
                                }
                                <RestaurantCardSkeleton />
                            </HorizontalScroll>
                        </div>

                        {/*Recent Orders*/}
                        <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                            <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recent Orders</h1>
                            <HorizontalScroll className={"no-scrollbar select-none my-4 space-x-4 rounded-lg"}>
                                {
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
                                        }
                            </HorizontalScroll>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col justify-center mx-[12.5%] sm:mx-[15%]">
                        <div className="grid grid-cols-2 min-[900px]:grid-cols-3 min-[1400px]:grid-cols-4 gap-y-4 justify-between w-full">
                            {
                                !FetchingData ? 
                                        list_restaurants_queried.length !== 0 ?
                                        list_restaurants_queried.map((e, index) => {
                                            return (
                                                <RestaurantCard key={index} id={e[0]} name={e[1]} range={e[2]} rating={e[3]} img_url={e[4]} />
                                            )
                                        }) 
                                        :
                                        <div className="w-[500px]">
                                            <p className="md:text-lg text-base font-bold text-black text-opacity-80">no results found</p>
                                            <p className="md:text-lg text-base text-black text-opacity-50">no restaurants found with your search parameters...</p>
                                        </div>
                                    :
                                    skeleton_amount.map((e, index) => {
                                        return (
                                            <RestaurantCardSkeleton key={index} />
                                        )
                                    })
                            }
                        </div>
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
                    </div>
            }

        </div>
    )
}

export default Dashboard;
import React from 'react';
import '../../index.css';
import HorizontalScroll from '../complex-items/HorizontalScroll';
import CategoryCard from '../items/CategoryCard';
import RestaurantCard from '../items/RestaurantCard';
import { UseUserInfo } from '../../store';

const list_categories = [
                         ["Burgers"], 
                         ["Chickens"],
                         ["Asians"],
                         ["Seafoods"],
                         ["Pizzas"],
                         ["Beverages"],
                        ]

const list_restaurants = [
    ["Legendary Laksa", 0.60, 4.6, "images/restaurant-templates/laksa.png"], 
    ["Ayam Goreng Mas Ganjar", 1.60, 4.2, "images/restaurant-templates/ayam-goreng.png"],
    ["Mie Bakso Pak Kumis", 0.83, 5.0, "images/restaurant-templates/mie-bakso.png"],
    ["Nasi Lemak Uncle Ato", 2.50, 4.5, "images/restaurant-templates/nasi-lemak.png"],
    ["Nasi Ayam Pak Jarwo", 0.69, 4.8, "images/restaurant-templates/nasi-ayam.png"],
    ["Soto Ayam Madura Mas Tretan", 1.89, 4.1, "images/restaurant-templates/soto-ayam.png"],
    ]

function Dashboard () {
    const {username} = UseUserInfo((state) => ({
        username: state.username
      }));

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
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"}>
                    {
                        list_categories.map(e => {
                            return (
                                <CategoryCard name={e[0]} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>
            
            {/*Recommended Foods container*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recommended Foods</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"}>
                    {
                        list_restaurants.map(e => {
                            return (
                                <RestaurantCard name={e[0]} range={e[1]} rating={e[2]} img_url={e[3]} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>

            {/*Recent Orders*/}
            <div className="mx-[12.5%] sm:mx-[15%] py-2 m-2">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">Recent Orders</h1>
                <HorizontalScroll className={"no-scrollbar select-none my-4 rounded-lg"}>
                    {
                        list_restaurants.map(e => {
                            return (
                                <RestaurantCard name={e[0]} range={e[1]} rating={e[2]} img_url={e[3]} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>

        </div>
    )
}

export default Dashboard;
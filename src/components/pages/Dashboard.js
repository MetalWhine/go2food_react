import React from 'react';
import '../../index.css';
import HorizontalScroll from '../complex-items/HorizontalScroll';

function CategoryCard ({name}) {
    return (
        <div className='flex justify-center items-center bg-green-600 text-white p-3 mr-2 rounded-md hover:bg-green-700 active:bg-green-800 md:min-w-[100px] md:min-h-[100px] sm:min-w-[90px] sm:min-h-[90px] min-w-[80px] min-h-[80px]'>
            <div className="items-center justify-center m-auto">
                <img className="md:h-12 md:w-12 sm:h-11 sm:w-11 h-10 w-10 mx-auto pointer-events-none" src={`images/food-categories/${name}.png`} alt="Category Icons"></img>
                <p className="text-center text-xs sm:text-sm md:text-base">{name}</p>
            </div>
        </div>
    )
}

const list_categories = [
                         ["Burgers"], 
                         ["Chickens"],
                         ["Asians"],
                         ["Seafoods"],
                         ["Pizzas"],
                         ["Beverages"],
                        ]

function Dashboard () {
    const first_name = 'user';

    return (
        <div className="pt-[72px]">
            {/* welcome message + search bar */}
            <div className="flex flex-col md:flex-row py-2 mx-[12.5%] sm:mx-[15%]">
                <div className='md:p-4 sm:p-2 flex flex-[1] items-center justify-center md:justify-start'>
                    <p className="text-center text-lg sm:text-xl md:text-2xl font-bold">Welcome, {first_name}!</p>
                </div>
                <div className='py-2 md:px-2 md:py-2 flex flex-[2.5] items-center justify-center'> 
                    <input type="text" id="food_search" class="py-2 px-2 bg-white border w-full border-black text-md sm:text-xl md:text-2xl text-gray-900 rounded-[24px]" placeholder="🔍 search for food"/>
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
                <HorizontalScroll className={"no-scrollbar select-none py-4"}>
                    {
                        list_categories.map(e => {
                            return (
                                <CategoryCard name={e[0]} />
                            )
                        })
                    }
                </HorizontalScroll>
            </div>
        </div>
    )
}

export default Dashboard;
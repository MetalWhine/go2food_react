import React from 'react';

function Dashboard () {
    const first_name = 'user';

    return (
        <div className="pt-[72px]">
            {/* welcome message + search bar */}
            <div className="flex flex-col md:flex-row py-2 px-[20%]">
                <div className='md:p-4 sm:p-2 flex flex-[1] items-center justify-center'>
                    <p className="text-center text-lg sm:text-xl md:text-2xl font-bold">Welcome, {first_name}!</p>
                </div>
                <div className='px-6 py-4 md:px-2 md:py-2 flex flex-[2.5] items-center justify-center'> 
                    <input type="text" id="food_search" class="p-2 bg-white border w-full border-black text-md sm:text-xl md:text-2xl text-gray-900 rounded-[24px]" placeholder="🔍 search for food"/>
                </div>
            </div>
            
            <div>
                
            </div>
        </div>
    )
}

export default Dashboard;
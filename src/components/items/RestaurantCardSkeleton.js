import React from "react";

function RestaurantCardSkeleton () {
    return (
        <div className="flex justify-center items-center bg-green-600 text-white p-2 mr-4 rounded-md hover:bg-green-700 active:bg-green-800 md:min-w-[200px] md:min-h-[200px] min-w-[150px] min-h-[150px]">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCardSkeleton;
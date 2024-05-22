import React from "react";

function CategoryCard ({name, selectedTags, SetSelectedTags = () => {}}) {

    const onClick = () => {
        if (selectedTags.includes(name))
        {
            let arr = selectedTags.filter(
                e => e !== name
            )
            SetSelectedTags(arr);
            
        }
        else
        {
            let arr = [...selectedTags];
            arr.push(name)
            SetSelectedTags(arr);
        }
        
    }

    return (
        <div onClick={onClick} className={`flex justify-center items-center p-3 mr-2 rounded-md md:min-w-[100px] md:min-h-[100px] sm:min-w-[90px] sm:min-h-[90px] min-w-[80px] min-h-[80px] font-bold ${selectedTags.includes(name) ? "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black": "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"}`}>
            <div className="items-center justify-center m-auto">
                <img className="md:h-12 md:w-12 sm:h-11 sm:w-11 h-10 w-10 mx-auto pointer-events-none" src={`/images/food-categories/${name}.png`} alt="Category Icons"></img>
                <p className="text-center text-xs sm:text-sm md:text-base">{name}</p>
            </div>
        </div>
    )
}

export default CategoryCard;
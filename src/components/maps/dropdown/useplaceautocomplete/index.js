import React from 'react'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import DropDownItems from '..';

// this is separated to its own functional component since google maps autis 
// si kontol variable "ready" ga mau jadi true kalo gmaps belom siap, harus remount
// dlu baru bisa
function AutoCompletePlaces({ setselectedLoc, setselectedLocName, setcenter }) {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setselectedLoc({ lat, lng });
        setselectedLocName(address);
        setcenter({ lat, lng });
        setValue("", false);
    };

    return (
        <form className='w-3/4 flex space-x-2 relative'>
            <input
                disabled={!ready}
                onChange={(e) => {
                    console.log("sdjksdj");
                    setValue(e.target.value)
                }}
                value={value}
                type='text'
                placeholder='Search for an address'
                className='border border-black/20 focus:border-black/60 transition-all w-full outline-none pl-4 py-2 pr-12 rounded-full'
            />
            <button
                type='submit'
                onClick={(e) => { e.preventDefault() }}
                className='p-2 rounded-full absolute -translate-y-1/2 top-1/2 right-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            <div className={`border ${data.length > 0 ? "translate-y-0 border-black/20 opacity-100" : "-translate-y-2 border-black/0 opacity-0 pointer-events-none"} z-[10] absolute transition-all top-full right-0 w-full min-h-10 h-fit bg-white mt-1 rounded-xl overflow-auto`}>
                {data.length > 0 && data.map(({ place_id, description }) => {
                    return <DropDownItems key={place_id} placeName={description} onSelected={handleSelect} />
                })}
            </div>
        </form>
    )
}

export default AutoCompletePlaces
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import AutoCompletePlaces from '../maps/dropdown/useplaceautocomplete';

export default function Location() {
    const [center, setcenter] = useState({ lat: -34.405714, lng: 150.877724 });
    const [selectedLoc, setselectedLoc] = useState({ lat: 0, lng: 0 });
    const [selectedLocName, setselectedLocName] = useState("");
    const [isLoading, setisLoading] = useState(false);
    
    // tinker with this to show loading and toast when saving/saving to db complete 
    // or something idk
    const [issavingToDb, setissavingToDb] = useState(false);

    const addressFormatting = {
        street_number: "long_name",
        route: "short_name",
        locality: "long_name",
        administrative_area_level_1: "short_name",
        postal_code: "long_name",
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
        libraries: ["places"],
    });

    useEffect(() => {
        setisLoading(false);
    }, [selectedLocName])

    const onMapClicked = (event) => {
        const latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setselectedLoc(latLng);
        setisLoading(true);
        getLocName(latLng);
    }

    const getLocName = (my_location) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ 'latLng': my_location }, function (results, status) {
            if (status === window.google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    let adrsComp = results[0].address_components, loc_name, area_name;
                    let finalString = "";
                    for (let i = 0; i < adrsComp.length; i++) {
                        const currentType = adrsComp[i].types[0];
                        if (addressFormatting[currentType]) {
                            finalString += adrsComp[i][addressFormatting[currentType]];
                            if (!["street_number", "postal_code"].includes(currentType)) {
                                finalString += ", ";
                            } else {
                                finalString += " ";
                            }
                        }
                    }
                    setselectedLocName(finalString.trim());
                }
            }
        });
    }

    const saveToDb = async (e) => {
        e.preventDefault();
    }

    return (
        <div id='parent_container_location' className='p-5 flex flex-col items-center space-y-6'>
            <div className='space-y-0 w-3/4 p-2'>
                <h1 className='font-bold text-xl'>Set your address</h1>
                <p className='text-sm'>Set your address so we know where we should send your order to</p>
            </div>
            {isLoaded ?
                <AutoCompletePlaces
                    setselectedLoc={setselectedLoc}
                    setselectedLocName={setselectedLocName}
                    setcenter={setcenter}
                />
                :
                <div className='h-10 flex items-center'>
                    <p className='animate-pulse'>Initialising...</p>
                </div>
            }
            <div className='bg-white-600 border border-black/20 text-white w-3/4 h-96 rounded-2xl overflow-clip'>
                {!isLoaded ?
                    <div className='w-full h-full flex items-center justify-center outline-none'>
                        <p>Loading...</p>
                    </div>
                    : <GoogleMap
                        zoom={13}
                        center={center}
                        options={{ disableDefaultUI: true }}
                        mapContainerClassName="w-full h-full outline-none"
                        onClick={onMapClicked}
                    >
                        {selectedLoc && <MarkerF
                            position={selectedLoc}
                        />}
                    </GoogleMap>
                }
            </div>
            <div className='flex flex-col w-3/4'>
                <p className="text-left font-bold">Selected location:</p>
                <p className={`text-left ${isLoading ? "animate-pulse" : "animate-none"}`}>{isLoading ? "Getting location data..." : selectedLocName ? selectedLocName : "~"}</p>
            </div>
            <button
                onClick={saveToDb}
                disabled={selectedLoc.lat == 0 && selectedLoc.lng == 0 || isLoading}
                className='hover:bg-green-700 bg-green-600 rounded-lg text-white px-4 py-2 transition-all disabled:bg-gray-300'>
                Save changes
            </button>
        </div>
    )
}

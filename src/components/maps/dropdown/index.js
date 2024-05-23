import React from 'react'

function DropDownItems({ placeName, onSelected }) {
    return (
        <div
            onClick={() => { onSelected(placeName) }}
            className='hover:bg-black/10 py-2 px-4 cursor-pointer select-none'>
            {placeName}
        </div>
    )
}

export default DropDownItems
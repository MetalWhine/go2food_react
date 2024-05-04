import {create} from 'zustand';

export const UseUserInfo = create((set) => ({
    username: 'user',

    UpdateUserName: (username) => set(() => ({ username: username}))
}))

export const UsePositionInfo = create ((set) => ({
    latitude: 0,
    longitude: 0,
    
    UpdateLatitude: (latitude) => set(() => ({ latitude: latitude})),
    UpdateLongitude: (longitude) => set(() => ({ longitude: longitude}))
}))
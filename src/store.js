import {create} from 'zustand';

export const UseUserInfo = create((set) => ({
    username: 'user',

    UpdateUserName: (username) => set(() => ({ username: username}))
}))
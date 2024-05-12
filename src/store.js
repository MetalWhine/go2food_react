import {create} from 'zustand';
import { produce } from 'immer';

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

export const UseCartOrder = create((set, get) => ({
    restaurant_id: "null",
    items: [],

    UpdateRestaurantId: (restaurant_id) => set(() => ({ restaurant_id: restaurant_id})),

    AddItems: (restaurant, item_id) => {
        const {restaurant_id} = get()

        set(
            produce((state) => {
              const existingItemIndex = state.items.findIndex(
                ([existingItemId]) => existingItemId === item_id
              );
              
              // if there are items in the items list
              if (existingItemIndex !== -1) 
              {
                // only set the new data if restaurant_id is the same with menu_id
                if (restaurant === restaurant_id)
                {
                    state.items[existingItemIndex][1] += 1;
                }

              } 
              // if list is empty set the restaurant_id with menu restaurant_id and add the data
              else 
              {
                state.restaurant_id = restaurant
                // add a new item_id with count of one
                state.items.push([item_id, 1]);
              }
            })
          );
    },

    Removeitems: (restaurant, item_id) => {
        const {restaurant_id} = get()
        const {items} = get()
        console.log(items)

        set(
            produce((state) => {
              const existingItemIndex = state.items.findIndex(
                ([existingItemId]) => existingItemId === item_id
              );
              
              // if there are items in the items list
              if (existingItemIndex !== -1) 
              {
                // check if restaurant_id is the same with menu restaurant_id
                if (restaurant === restaurant_id)
                {
                    // reduce one count if the new count is not less than zero
                    if (state.items[existingItemIndex][1] - 1 >= 0)
                    {
                        state.items[existingItemIndex][1] -= 1;
                    }
                }
                else
                {
                    // filter the items list by removing the item (doesnt work for now i dont know how to fix this tbh)
                    const filteredItems = state.items.filter(
                        (e) => e[0] === item_id
                      );
                    
                    console.log(filteredItems)
                }
              } 
            })
          );
    }

}))
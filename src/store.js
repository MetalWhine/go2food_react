import {create} from 'zustand';
import { produce } from 'immer';

export const UseUserInfo = create((set) => ({
    user_id: "id",
    balance: null,
    username: 'user',
    premium: null,

    UpdateBalance: (balance) => set(() => ({ balance: balance})),
    UpdateUserId: (user_id) => set(() => ({ user_id: user_id})),
    UpdateUserName: (username) => set(() => ({ username: username})),
    UpdatePremium: (premium) => set(() => ({ premium: premium}))
}))

export const UsePositionInfo = create ((set) => ({
    latitude: 0,
    longitude: 0,
    
    UpdateLatitude: (latitude) => set(() => ({ latitude: latitude})),
    UpdateLongitude: (longitude) => set(() => ({ longitude: longitude}))
}))

function CalculateTotalPrice (items) {
  let total = 0
  for (let i = 0; i < items.length; i++)
  {
   var item = items[i]
   total += item[2] * item[3]
  }
  return Math.round(total*100)/100;
 }

 function CalculateServiceFee (total_price) {
    return Math.round((10 * total_price / 100)*100)/100;
 }

export const UseCartOrder = create((set, get) => ({
    restaurant_id: "null",
    items: [],
    totalPrice: 0,
    serviceFee: 0,

    UpdateRestaurantId: (restaurant_id) => set(() => ({ restaurant_id: restaurant_id})),

    AddItems: (restaurant, item_id, name, price) => {
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
                  state.items[existingItemIndex][3] += 1;
                }

              } 
              // if list is empty set the restaurant_id with menu restaurant_id and add the data
              else 
              {
                state.restaurant_id = restaurant
                // add a new item_id with count of one
                state.items.push([item_id, name, price, 1]);
              }
              var total_price = CalculateTotalPrice(state.items)
              state.totalPrice = total_price
              state.serviceFee = CalculateServiceFee(total_price)
            })
          );

    },

    Removeitems: (restaurant, item_id) => {
        const {restaurant_id} = get()

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
                    if (state.items[existingItemIndex][3] - 1 >= 1)
                    {
                        state.items[existingItemIndex][3] -= 1;
                    }
                    else
                    {
                        // filter the items list by removing the item (doesnt work for now i dont know how to fix this tbh)
                        const filteredItems = state.items.filter(
                            ([existingItemId]) => existingItemId !== item_id
                        );
                        state.items = filteredItems
                    }
                }
              }
              var total_price = CalculateTotalPrice(state.items)
              state.totalPrice = total_price
              state.serviceFee = CalculateServiceFee(total_price)
            })
          );

    },

    RemoveCartItems: () => {
      set(produce((state) => {
        state.items = []
      }))
    }

}))
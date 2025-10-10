import { MOCK_RESTAURANT_LIST } from "../mocks/restaurant.js";

const KEY_LOCAL_STORAGE = "restaurants";

export function getRestaurantList() {
  return JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE)) || [];
}

export function saveRestaurantList(list) {
  localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(list));
}

export function initRestaurantList() {
  if (getRestaurantList().length === 0) {
    saveRestaurantList(MOCK_RESTAURANT_LIST);
  }
}

export function removeRestaurant(restaurantName) {
  const removedRestaurantList = getRestaurantList().filter(
    (restaurant) => restaurant.name !== restaurantName
  );
  saveRestaurantList(removedRestaurantList);
  return removedRestaurantList;
}

export function toggleFavorite(restaurantName) {
  const restaurantList = getRestaurantList();
  const index = restaurantList.findIndex(
    (item) => item.name === restaurantName
  );

  if (index === -1) {
    return;
  }

  restaurantList[index].isFavorite = !restaurantList[index].isFavorite;
  saveRestaurantList(restaurantList);

  return restaurantList;
}

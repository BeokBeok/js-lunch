import {
  createCategoryItem,
  createNameItem,
  createDistanceItem,
  createDescriptionItem,
  createLinkItem,
} from "./components/restaurant-form.js";
import { createButtonContainer } from "./components/button-container.js";
import {
  getRestaurantList,
  initRestaurantList,
  removeRestaurant,
  saveRestaurantList,
  toggleFavorite,
} from "./services/restaurant-service.js";
import { createFavoriteButton } from "./components/favorite-button.js";
import {
  createRestaurantCategoryIcon,
  createRestaurantDescription,
  createRestaurantLink,
  createRestaurantTitle,
} from "./components/restaurant-item.js";
import {
  closeExistingModal,
  createModalContainer,
} from "./components/modal.js";
import { getRestaurantCategoryIcon } from "./utils/restaurant-utils.js";

function main() {
  document
    .getElementById("category-filter")
    .addEventListener("change", changeCategory);

  document
    .getElementById("sorting-filter")
    .addEventListener("change", changeSorting);

  document
    .querySelector(".gnb__add-button")
    .addEventListener("click", showNewRestaurantModal);
}

function changeCategory() {
  const selectedCategory = document.getElementById("category-filter").value;
  const restaurantList = getRestaurantList();
  const filteredRestaurants =
    selectedCategory === "전체"
      ? restaurantList
      : restaurantList.filter(
          (restaurant) => restaurant.category === selectedCategory
        );
  renderList(filteredRestaurants);
}

function changeSorting() {
  const selectedSorting = document.getElementById("sorting-filter").value;
  const sortedRestaurants = [...getRestaurantList()];
  if (selectedSorting === "name") {
    sortedRestaurants.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSorting === "distance") {
    sortedRestaurants.sort((a, b) => a.distance - b.distance);
  } else {
    sortedRestaurants;
  }
  renderList(sortedRestaurants);
}

function renderList(list) {
  const activeTab = document.querySelector(".tab-content.active");
  const restaurantList = activeTab.id.includes("favorite")
    ? list.filter((item) => item.isFavorite === true)
    : list;

  const ul = activeTab.querySelector(".restaurant-list");
  ul.innerHTML = "";

  const fragment = document.createDocumentFragment();

  restaurantList.forEach((restaurant) => {
    const li = document.createElement("li");
    li.className = "restaurant";
    li.addEventListener("click", showRestaurantDetailModal);

    const categoryIcon = createRestaurantCategoryIcon({
      icon: restaurant.icon,
      category: restaurant.category,
    });
    li.appendChild(categoryIcon);

    const infoDiv = document.createElement("div");
    infoDiv.className = "restaurant__info";

    const header = document.createElement("div");
    header.className = "restaurant__header";

    const title = createRestaurantTitle({
      name: restaurant.name,
      distance: restaurant.distance,
    });

    const favoriteButton = createFavoriteButton({
      restaurant: restaurant,
      onToggle: () => renderList(toggleFavorite(restaurant.name)),
    });

    const description = createRestaurantDescription({
      showFullDescription: false,
      description: restaurant.description,
    });

    li.dataset.icon = restaurant.icon;
    li.dataset.category = restaurant.category;
    li.dataset.name = restaurant.name;
    li.dataset.distance = restaurant.distance;
    li.dataset.description = restaurant.description;
    li.dataset.link = restaurant.link;
    li.dataset.isFavorite = restaurant.isFavorite;

    header.append(title, favoriteButton);
    infoDiv.append(header, description);
    li.appendChild(infoDiv);

    fragment.appendChild(li);
  });

  ul.appendChild(fragment);
}

function addRestaurant(formData) {
  const newRestaurant = {
    icon: getRestaurantCategoryIcon(formData.category),
    category: formData.category,
    name: formData.name,
    distance: parseInt(formData.distance),
    description: formData.description,
    link: formData.link,
    isFavorite: false,
  };

  const updatedList = [...getRestaurantList(), newRestaurant];
  saveRestaurantList(updatedList);
  renderList(updatedList);

  closeExistingModal();
}

function showNewRestaurantModal() {
  if (closeExistingModal()) {
    return;
  }

  const container = createModalContainer();

  const title = document.createElement("h3");
  title.className = "modal-title text-subtitle";
  title.textContent = "새로운 음식점";

  const categoryItem = createCategoryItem();
  const nameItem = createNameItem();
  const distanceItem = createDistanceItem();
  const descriptionItem = createDescriptionItem();
  const linkItem = createLinkItem();

  const handleAdd = (form) => {
    const formData = new FormData(form);
    const data = {
      category: formData.get("category"),
      name: formData.get("name").trim(),
      distance: formData.get("distance"),
      description: formData.get("description"),
      link: formData.get("link"),
    };

    if (!(data.category && data.name && data.distance)) {
      alert("카테고리, 이름, 거리가 모두 입력되어야 합니다.");
      return;
    }

    addRestaurant(data);
  };

  const form = document.createElement("form");

  const { buttonContainer, negativeButton, positiveButton } =
    createButtonContainer({
      negative: { type: "button" },
      positive: { text: "추가하기", type: "submit" },
    });

  negativeButton.addEventListener("click", () => {
    closeExistingModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleAdd(event.target);
  });

  form.append(
    title,
    categoryItem,
    nameItem,
    distanceItem,
    descriptionItem,
    linkItem,
    buttonContainer
  );
  container.appendChild(form);
}

function showRestaurantDetailModal(event) {
  if (closeExistingModal()) {
    return;
  }
  const target = event.currentTarget;
  const restaurant = {
    icon: target.dataset.icon,
    category: target.dataset.category,
    name: target.dataset.name,
    distance: target.dataset.distance,
    description: target.dataset.description,
    link: target.dataset.link,
    isFavorite: target.dataset.isFavorite === "true",
  };

  const container = createModalContainer();

  const detailContainer = document.createElement("div");
  detailContainer.className = "restaurant__detail";

  const categoryIcon = createRestaurantCategoryIcon({
    icon: restaurant.icon,
    category: restaurant.category,
  });

  const header = document.createElement("div");
  header.className = "restaurant__header";

  const favoriteButton = createFavoriteButton({
    restaurant: restaurant,
    onToggle: () => renderList(toggleFavorite(restaurant.name)),
  });

  const infoDiv = document.createElement("div");
  infoDiv.className = "restaurant__info";

  const title = createRestaurantTitle({
    name: restaurant.name,
    distance: restaurant.distance,
  });

  const description = createRestaurantDescription({
    showFullDescription: true,
    description: restaurant.description,
  });

  const link = createRestaurantLink(restaurant.link);

  const { buttonContainer, negativeButton, positiveButton } =
    createButtonContainer({
      negative: { text: "삭제하기" },
      positive: { text: "닫기" },
    });

  negativeButton.addEventListener("click", () => {
    const restaurantList = removeRestaurant(restaurant.name);
    closeExistingModal();
    renderList(restaurantList);
  });

  positiveButton.addEventListener("click", closeExistingModal);

  header.append(categoryIcon, favoriteButton);
  infoDiv.append(title, description, link);
  detailContainer.append(header, infoDiv);
  container.append(detailContainer, buttonContainer);
}

function createTabContents() {
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      tabs.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
      renderList(getRestaurantList());
    });
  });
}

addEventListener("load", main);

addEventListener("DOMContentLoaded", () => {
  initRestaurantList();
  createTabContents();
  renderList(getRestaurantList());
});

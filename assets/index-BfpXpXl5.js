(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function createFormItemLabel(labelText) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.classList.add("text-caption");
  return label;
}
function createFormItemSelect({ name, options }) {
  const select = document.createElement("select");
  select.name = name;
  const fragment = document.createDocumentFragment();
  options.forEach((option, index) => {
    const value = index === 0 ? "" : option;
    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.textContent = option;
    fragment.appendChild(optionElement);
  });
  select.appendChild(fragment);
  return select;
}
function createFormItemInput({ name, type }) {
  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  return input;
}
function createFormItemHelpText(text) {
  const helpText = document.createElement("p");
  helpText.classList.add("help-text");
  helpText.textContent = text;
  return helpText;
}
function createFormItem({ required = false } = {}) {
  const formItem = document.createElement("div");
  formItem.className = "form-item";
  if (required) {
    formItem.classList.add("form-item--required");
  }
  return formItem;
}
const restaurantData = [
  {
    icon: "category-etc.png",
    category: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    description: "맥시칸 캐주얼 그릴"
  },
  {
    icon: "category-western.png",
    category: "양식",
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다."
  },
  {
    icon: "category-japanese.png",
    category: "일식",
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은\n정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는\n잇쇼우는 고객 한분 한분께 최선을 다하겠습니다"
  },
  {
    icon: "category-chinese.png",
    category: "중식",
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과\n정성으로 정통 중식의 세계를 펼쳐갑니다"
  },
  {
    icon: "category-korean.png",
    category: "한식",
    name: "피앙콩할머니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩\n할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은\n평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선\n맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은\n건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만,\n할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의\n역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은\n만큼 덜어 먹을 수 있게 준비돼 있다."
  },
  {
    icon: "category-asian.png",
    category: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수"
  }
];
function main() {
  document.getElementById("category-filter").addEventListener("change", changeCategory);
  document.getElementById("sorting-filter").addEventListener("change", changeSorting);
  document.querySelector(".gnb__add-button").addEventListener("click", showNewRestaurantModal);
}
function changeCategory() {
  const selectedCategory = document.getElementById("category-filter").value;
  const filteredRestaurants = selectedCategory === "전체" ? restaurantData : restaurantData.filter(
    (restaurant) => restaurant.category === selectedCategory
  );
  renderList(filteredRestaurants);
}
function changeSorting() {
  const selectedSorting = document.getElementById("sorting-filter").value;
  const sortedRestaurants = [...restaurantData];
  if (selectedSorting === "name") {
    sortedRestaurants.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSorting === "distance") {
    sortedRestaurants.sort((a, b) => a.distance - b.distance);
  } else ;
  renderList(sortedRestaurants);
}
function renderList(list) {
  const ul = document.querySelector(".restaurant-list");
  ul.innerHTML = "";
  const fragment = document.createDocumentFragment();
  list.forEach((restaurant) => {
    const li = document.createElement("li");
    li.className = "restaurant";
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "restaurant__category";
    const image = document.createElement("img");
    image.className = "category-icon";
    image.src = `/js-lunch/assets/${restaurant.icon}`;
    image.alt = restaurant.category;
    categoryDiv.appendChild(image);
    li.appendChild(categoryDiv);
    const infoDiv = document.createElement("div");
    infoDiv.className = "restaurant__info";
    const name = document.createElement("h3");
    name.className = "restaurant__name text-subtitle";
    name.textContent = restaurant.name;
    const distance = document.createElement("span");
    distance.className = "restaurant__distance text-body";
    distance.textContent = `캠퍼스부터 ${restaurant.distance}분 내`;
    const description = document.createElement("p");
    description.className = "restaurant__description text-body";
    description.textContent = restaurant.description;
    infoDiv.appendChild(name);
    infoDiv.appendChild(distance);
    infoDiv.appendChild(description);
    li.appendChild(infoDiv);
    fragment.appendChild(li);
  });
  ul.appendChild(fragment);
}
function createCategoryItem() {
  const category = createFormItem({
    required: true
  });
  const categoryLabel = createFormItemLabel("카테고리");
  const categorySelect = createFormItemSelect({
    options: ["선택해주세요", "한식", "중식", "일식", "양식", "아시안", "기타"]
  });
  categorySelect.name = "category";
  category.append(categoryLabel, categorySelect);
  return category;
}
function createNameItem() {
  const name = createFormItem({
    required: true
  });
  const nameLabel = createFormItemLabel("이름");
  const nameInput = createFormItemInput({
    name: "name",
    type: "text"
  });
  name.append(nameLabel, nameInput);
  return name;
}
function createDistanceItem() {
  const distance = createFormItem({
    required: true
  });
  const distanceLabel = createFormItemLabel("거리(도보 이동 시간)");
  const distanceSelect = createFormItemSelect({
    name: "distance",
    options: ["선택해주세요", "5", "10", "15", "20", "30"]
  });
  distance.append(distanceLabel, distanceSelect);
  return distance;
}
function createDescriptionItem() {
  const description = createFormItem();
  const descriptionLabel = createFormItemLabel("설명");
  const descriptionTextArea = document.createElement("textarea");
  descriptionTextArea.name = "description";
  const descriptionHelpText = createFormItemHelpText(
    "메뉴 등 추가 정보를 입력해 주세요."
  );
  description.append(
    descriptionLabel,
    descriptionTextArea,
    descriptionHelpText
  );
  return description;
}
function createLinkItem() {
  const link = createFormItem();
  const linkLabel = createFormItemLabel("참고 링크");
  const linkInput = createFormItemInput({
    name: "link",
    type: "url"
  });
  const linkHelpText = createFormItemHelpText(
    "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
  );
  link.append(linkLabel, linkInput, linkHelpText);
  return link;
}
const addRestaurant = () => {
  if (!isRequired()) {
    return;
  }
  const modal = document.querySelector(".modal");
  const categorySelect = document.querySelector(
    '.modal select[name="category"]'
  );
  const nameInput = document.querySelector('.modal input[name="name"]');
  const distanceSelect = document.querySelector(
    '.modal select[name="distance"]'
  );
  const description = document.querySelector(
    '.modal textarea[name="description"]'
  );
  const newRestaurant = {
    icon: getCategoryIcon(categorySelect.value),
    category: categorySelect.value,
    name: nameInput.value,
    distance: parseInt(distanceSelect.value),
    description: description.value
  };
  const localData = JSON.parse(localStorage.getItem("newRestaurants")) || [];
  localData.push(newRestaurant);
  localStorage.setItem("newRestaurants", JSON.stringify(localData));
  renderList([...restaurantData, ...localData]);
  modal.remove();
};
function createButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const cancelButton = document.createElement("button");
  cancelButton.className = "button";
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "취소하기";
  const addButton = document.createElement("button");
  addButton.className = "button";
  addButton.classList.add("button--primary");
  addButton.textContent = "추가하기";
  cancelButton.addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    modal.remove();
  });
  addButton.addEventListener("click", addRestaurant);
  buttonContainer.append(cancelButton, addButton);
  return buttonContainer;
}
function getCategoryIcon(category) {
  const iconMap = {
    기타: "category-etc.png",
    양식: "category-western.png",
    일식: "category-japanese.png",
    중식: "category-chinese.png",
    한식: "category-korean.png",
    아시안: "category-asian.png"
  };
  return iconMap[category] ?? "category-etc.png";
}
function showNewRestaurantModal() {
  const prevModal = document.querySelector(".modal");
  if (prevModal) {
    prevModal.remove();
    return;
  }
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.classList.add("modal--open");
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const container = document.createElement("div");
  container.className = "modal-container";
  const title = document.createElement("h3");
  title.className = "modal-title text-subtitle";
  title.textContent = "새로운 음식점";
  const category = createCategoryItem();
  const name = createNameItem();
  const distance = createDistanceItem();
  const description = createDescriptionItem();
  const link = createLinkItem();
  const buttonContainer = createButtonContainer();
  container.append(
    title,
    category,
    name,
    distance,
    description,
    link,
    buttonContainer
  );
  modal.append(backdrop, container);
  document.body.appendChild(modal);
}
function isRequired() {
  const container = document.querySelector(".modal-container");
  const requiredFormItems = container.querySelectorAll(".form-item--required");
  for (const requiredFormItem of requiredFormItems) {
    const requiredElements = requiredFormItem.querySelectorAll("input , select");
    for (const requiredElement of requiredElements) {
      if (!requiredElement.value.trim()) {
        alert("카테고리, 이름, 거리가 모두 입력되어야 합니다.");
        return false;
      }
    }
  }
  return true;
}
addEventListener("load", main);
addEventListener("DOMContentLoaded", () => {
  const localData = JSON.parse(localStorage.getItem("newRestaurants")) || [];
  renderList([...restaurantData, ...localData]);
});

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
function createButtonContainer({
  negative: {
    text: negativeText = "취소하기",
    onClick: onNegativeClick = () => {
    }
  },
  positive: {
    text: positiveText = "확인하기",
    onClick: onPositiveClick = () => {
    }
  }
}) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const negativeButton = document.createElement("button");
  negativeButton.className = "button";
  negativeButton.classList.add("button--secondary");
  negativeButton.textContent = negativeText;
  const positiveButton = document.createElement("button");
  positiveButton.className = "button";
  positiveButton.classList.add("button--primary");
  positiveButton.textContent = positiveText;
  negativeButton.addEventListener("click", onNegativeClick);
  positiveButton.addEventListener("click", onPositiveClick);
  buttonContainer.append(negativeButton, positiveButton);
  return buttonContainer;
}
const KEY_LOCAL_STORAGE = "restaurants";
function getRestaurantList() {
  return JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE)) || [];
}
function saveRestaurantList(list) {
  localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(list));
}
const favoriteFilledIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAImSURBVHgB7ZZPchJBFMa/14wJIQsnpSTlDk5gcgKHhVXIRj2BeAKHE8ScIDlCvAFsCLtwA71BcGUVWJVZKKESpp/9qkRJmGF6mmSRKn5VFD399+vX771uYM1jZtjYbv5slN5iBTysgGL94W+xA0cIjpjd7yvwVymz1rVyb9KHAwquMIf/ylR4B0ecLHBZL1ZipS7mqqLCeKO6048i5MTJAjeqENyp8qel6xAOOAkg6MPFOnyCA7kFSOgRqJLQ5I/qxQA5WeoDP8xZy7+J1QrJj+ipJoQpAoRvxHzKoO/MOuI4juJCIXrRmwyQJeAy8P24dH1sJghYkQ+Gj/uEEJk5ByLSOGxr5rC3LCA79ojOzU4reADYCJiyrs1b5JYPSMOUuSYqcd8w939dbRzcPY5UHxg1tk8I7OTZi4vjy/OzcTOpKTUKyt3fIQNHWHltHKUtLmRmwuGbrVARHcMBzdzaPbs6WdbHKhVLfJNS58gD473ZeTurm/tllLW+yQM2/ewEKBUgL5ZjrASY5PQKObEdY2kB2kdeyG5MpgB5+SSlZclqsXE0rfVHZh4kDPWHr59kisi2AOtgocrEtmS1PePlu73Jqbe5eZCYMzwvwKoCTA74f5Ymnd5oXS13x5+rc6+fnXYUSZ20mc/23NiXWfNn5oFRY+sCbJ4gQGvPIq6FYb3YNBfaoRGAZ91xdVnfpRaQtx9YdWbmhiVyLHKpaVBn9qZYsyaNP7Nh02Yfw0qUAAAAAElFTkSuQmCC";
const favoriteLinedIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMvSURBVHgB7VYxb9pAFH53thMDqeSoTeSRbIwZGT21FHXImLFjf1LGjBkZqgZ18sjIyFa2oqQSVgW2Mfa9vmcMdRLZRo5UqRKfhO7Mvbv77r3vvTuAA/5nPPRbl7/eH3XgFdDhdbhUukFNNIGakFATdHpbALb597NntqEmahNAxO5uESEvoSZqEZhfgSUF7DbVhOj8cMCEGqhFYB212tySFzyVwAwBzRPzpAs1UC8EqJy0FdJFieNNF/8NAU49IYQlQIRLfzkJgmDMffZCHTGKssG5Y1lpxwwtkIm1Qt0kxt2UAML43b0/SEl9OO4JTWMPzBLE8bGIQ1Cat5ZaaPhGeOp6XtEeuzrAImo2mj1OKynQRJBmDFE2KtOflqOrBUcugJ996BSGNAQ2CbIXg5FOobUgbkbw2G9SX5GXpKcQZn7gDy9cCF94YH5lWevV6jOf8K+LVKiQXKxUSOnmKSFCGp+ef1uO83NnHxtdCoUtUG3mspdy6zBYtEZwfJv3yIsQMIkoiq7pAPbm8NI9+7pwoQYeP5kOKOlsOS7889sLdxrmbQo1kItrLRIkVg5nOj+vl+coFeFjj04gpbOxlJPFcjHYxq4IrKU3pCXcFipF5IfF5EsJMDi2LCzucwyXQXBTRIIrZBw1ryELn0Qcvr0PRmXrV9YBmxaIlbpN2ZKoWs2WVWydDqWbizi+q9p8LwKMbZHngkPqnxXZnQ48j224v5YyhD2wF4EYoM0tUvrl/3/ogz134GmqKZXa6KC3YQ/s9SBBqfG9D1IlU/5moVEoHFZ53GQiYmT4y9GpC14iYKoBdOiOaO+z9l4EuCYgtRHijO8CCUmPa/92nImsG43OQ1+6iUpmJBbY1ZEKVGZB9vL5wn0EMeVSnfYpI2SiD5WuTL4dt1XviQ2ImzLNMCo9oFC1KQ0ztplblXKXoT3aVjUKyeTENLtcM3Y2BI3mUvM6AhqSADM/scCM0Bxsavl0Z7OpC6FLZXwch6sevdHSlzJ5oDIMlQSootmQufvsu0+v3+Ls4jSk5o51wmHBLHvKUP4eoMqmglb39+rMfX6JVCG9WYOga6wao7L3wAEH/AHvIXBYnJG13wAAAABJRU5ErkJggg==";
function createFavoriteButton({ restaurant, onToggle }) {
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "restaurant__favorite-button";
  const favoriteIcon = createFavoriteIcon(restaurant.isFavorite);
  favoriteButton.appendChild(favoriteIcon);
  favoriteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    restaurant.isFavorite = !restaurant.isFavorite;
    changeFavoriteIcon({
      favoriteIcon,
      isFavorite: restaurant.isFavorite
    });
    onToggle(restaurant.name);
  });
  return favoriteButton;
}
function createFavoriteIcon(isFavorite) {
  const favoriteIcon = document.createElement("img");
  changeFavoriteIcon({ favoriteIcon, isFavorite });
  return favoriteIcon;
}
function changeFavoriteIcon({ favoriteIcon, isFavorite }) {
  favoriteIcon.src = isFavorite ? favoriteFilledIcon : favoriteLinedIcon;
}
const asianCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH8SURBVHgB7ZW7LwRRFMbPegeFRqPwaBARNh4JoRBK1UY0eqvzH1BpUZIQpYJEKRJKj0REJJJVoyDitbHescc32YOb2b2zO7MzsyJ+yS9zs+4998z97lqif3yAmVthkH4DaKQbnsFb2EG5BA20wVP+wWish3IBNm6BN5zMue/xKTHp8C++FDHp8D4+i5h0eBdfBjHpcD8+zjwmHe7Fx/Zj0pF9fOw8Jh3O4+PsY9JhPz52LyYdmcfH7sekI3187F1MOvTxsfcx6UiOj/2LScd3fAUYFOHZBJdSHFwLDMk4AlfJGcOyh8EaPE4xJ4hejqyKGCfXp7zFIQyQTbAmDx4odfrJKVhcBe+kkPFsIJtgTTOMSY0rWGk1Py9NvUu4I+MKGCb7jMAyGe/Da8oGvFHIdPlqbKytho/K+iHKFuPewF2l6Ha6Y5d1FaZ1e07uoK54F4wqxTdho8X8OrgF4zL/HnaSm6DgOPxQmrqAM7AdlsBSGU9JA1+8wTFyG4luFD5w5rzAsGtRaZoakHsUt2jklRP3p9ezZkyNlcNBuAKfTSeyzIlvZiE5IN3/oZQEAoEYHhswCouVPxk/Q09wHXPeyS/w9sVwVoktbhrPG3PIL+SbpDawCBdMn02SX2CzehiRjefkxPLhtHx2AmvJT7BhDZxQo8G4SE6vkf4Kn2z8zgoShJFuAAAAAElFTkSuQmCC";
const chineseCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANvSURBVHgB7ZdbSBVBGMfnVHSziO4XKSKiGxFFdCGiICiJinqIeugCJWQWRNhj9VIEUQ9B0QUipCgSpKcisB4EH6KLiWL2YFZiaSqKmaaVl6/fx86hdd09Z48eDaI//Jjdne+b+XZ25ptZY/4rtiKmHxKRBRQpUBGJRJrN3xKBbIYS+aNfcA0y4QG8hXzYByPMQIoOtkOLhFMXXIehJtmi0RRYB02SmDphS9h+InGCGEKRBYdgrgk352rhGVTa+7n22WHmmZi+imBGwVXoCDkStXAEJkPE09Z477O+BLQVukMGUw5zTBI0LEbdfhP/E9VBCRznc3ywL6I+qy1dUAivqf9J3QSulQbuv5pEhHNRwGjoqL2EXTDFzrOoj36uHGh32etKewKP4Qt8g09wSsKmBAxT4XtAQHchxcdnJORKeOmLXQgTzBp4F9DILXFNTq6HwxLYAfck/JyLqhVWxApmDlQGOL+HGS7bVfACfkj/dCNWQBdjOJ72BF4jyZFm/WXRtr35ooxikU+s3bCElVFm7XIpdppg1UAeFEELTIN1sN44m7FXmkjTaL/VO0IVAW/xESZaG01y1QF29XASpnp75NlQWAvFAb4b1G6Ix6/UJ/om2EP0jfZe88hYHzv13YjdOajzVvJMc1I5NBp/LTU+b7EN2lxRaw5Jc9VH4Kz0Xk26EKZ57JbDeciGYzAbnkuw0v0Cmg/NLqP7MMzW6RK/JL33Ns1Xa11t6CfVFNDusWsPjkWqINUvoN0ew02uuhPin2duis1NlGPEyciJSNPJSuMncSZkVJrmJ7k68stPelJc7PI/I+Gl0+EyjDNBojLd5fAGRtvnC8X/lFjsspkBnyW8dGR7be7eVfYQquy1GkePnh3G2bm9qmb1tNlrzV+pJpx0FWbh2xkzIAzqKTKsg24T0eVdqZ37NOxOZBNMOOmpMZO+WkxYMZSzxNlG1rieHfUZ9gKxxw/KeeIcLeIpW/r6JyI9d/YMn8b1wD/T1utPQGGcYPQcFXYk4waXE9CJjuRwWx/r+PEKJptkicbyAjrSxJgfIxhNiLeTGowN6IokrgY4YAZCNLwYGhMI5pHY+TVgEufPNUzyewpjzWCIjqbDQQk+O+nvzgIz2BJnf7sjPXOPTuC9ph/q3++tE5gerPR4qhm4AErJwt3mX9FvD0G9XmKQoe0AAAAASUVORK5CYII=";
const etcCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALdSURBVHgB7ZfPS1RRFMfPpEZSmpVoFrboB/0g3BSYtZHUCtrUpl2tWtQiCKGIltKynRUUZBD9AVG06ndIlrsQo8jIqMSSSjLzF3r6HO6bfI4z7z6dsdV84cObN+/ec8877957zhXJK6/slJB5SFVLuFTBVqiG0uDREHyGLviaSCSGZKGEE4tgD1yCHpjQzBqH19AGO62v5FIYbIIXMKXzUzs0SrbCSBlchGHNXiPQajZlPqLjWnigudfTOTtFh2J4qQunTliZbuxEGmfsv8twUjx+Qz90wHuYgk1QB6vFv4KvwQlWokaPotqgbpVEyeZDS7rQ818FnIc/Hhs2RqPPmSL1fypbacfFI9ocU/+q7IDCKCO71R+dLlgaw6Fl6vYr9USpNtwvdcNqgiLPWMMwJn5Zm2+eNjbWYYlwqEH82i4uXfi0EbbEaFeb8Qnh69N4sv2pOsJOFdyPaetLuG8ixdAIlyUSTx+gDe7AO3HR3gAH4LS45BtHoyz94lw4lCuN4dC/MVPn0E/5//oevkl16G3o97gsjGxXbw3d90iEQ52h35YS+iW3GoSDMl3QmR6FG6TOoV1cnonbH37BUXFL94e4PNUMmXfW2YPfgo9QDovhXnDfDpUwAfXMoedpLeBQobrtPKkb6pKtPSuAQ+rPUaZeqE9jf1FgMykr+qJfUGcmVytTz6Q8rwn2oQHohnOwDiphPxyBVRlsN+t06Wtj7BWfLCJwNfQWo3A2/CZBJMuhVGJIXdI+FdhK6koy+nEMrAjCmdQk3Ib1MkfRZxvc1ZmZ3wq04rkasnr6sc6Uhfl68FnLIvqW2OeAmzr7dPIQ1mTqm/A5xaUFrP4Jv9EkDMAr6BW3uZktK0stfWwGG7Qg1GdUXCV6gVU1KNkoiMgTnb+s6NsXe87EdMqW7A51h79ujT4o2jMrzuzYU6dzOChmc5SugBpxn2a5uKLfjs6f4A30wW9vEZ9XXjnWX/HsJCzK2xoUAAAAAElFTkSuQmCC";
const japaneseCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKqSURBVHgB7ZZvaE1hHMefu1lsWXf+TCvbG8tImDdq3ohXpDCNIkpeeCO8Iyu0lRTygvxJypQyvKCUksS76dorGiKtmYVZ/s4uof18fp3n2rPj3nPv7k4mnW99Ouee8zu/53uf5/ec3zEmUqRI/6FEpAbOQpUZS2GgEo7DB/F0zIyFGHgy7IePMlxvYbr5W2KwYtgNr31GBuEOLIaY+0xsBPl1gDiHaqiFcvt8L3TAk1gsNmDjSjk0QCPMNEPj/IB2OAo3iU+afMQAE2EbPLb/TtL844ewA9bA/TQxT2ELFJnRiAST4J7kr+ewCSbkMt64LGbGc7gMdalL0ANt0GV/z7D3dQu7JdAJZ6CFpekzYQhDy2RoiQZgF5SkiSuzy/XFmZl6E7bE26opnXKur4JeeK/nzvXTTvy+gLwFUAcndQz3XuCSoQLnvJaHpzD97zhPwAHj7ZqEHWQahwVOfKHPhI5VCetgI9RAMfRx7wh5v5psIrDJV6AdsB2qoUgLFebATuj0xTbZHHFYC9chKem1OhczFXBD8tdVOAefM9zXmTkPK6AgyIj2m0Z4KeFLzd2GrZKtZRBQKt5r/o2Er2fQDLNMriL4oC+Jbvek5K9XcAIWSdCSBBiqgn6bTIt3PRySkUm7+S3x2sdU8TXOXPR727PttGaaOdWGd4Hfam52DjkG4QFcgVboBu1XcXKICUMYKYF6aA+YjRd2BufbZ/RlNw8OQ4/YbT9aI5pUa6kbfqYxoQXfCivFaxeFdqm1i7fJ8JrbY8IQiS75TGhx3xXv86PCxuhLcTm0yJ9fgapPsNCEIRIttSYewV6Y69xLLUmXZNZ32Cx5FHQmQ9oOdKuWOde0prRx9mcxkoAloZnJYrQcNsA18fqW1ss38T7ALkKDeN9PkSJF+qf1C2o4P+BuTa5lAAAAAElFTkSuQmCC";
const koreanCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGXSURBVHgB7ZeLcYMwDIZFJvAIZIJ2gzACG6QbtJ0g6QRJJygjtBM03SCdgGzQbKDKDckJgakMxpfc8d3pYqKHf4TBADBxYyTgCSIa+rkny8kWZCmZqdxHsj3ZN9kuSZJ3GAsrhGxF9oN6yionhZBQwUdPIW3ClhACKrTpmCjnZ2/HZFlH/AaGQAXeWs70QkeeM8fWhD60dKbA0zryFWSq3P6dooQHUWDdNllHfiPG1hA1n0ApJhVt3v43mUZQ9T/vlL1JDCgErVhSKZMGCjLiZNegEMQTltrJtDF4ujN1XRLBpe9k2hisP9My7puJWO78gPF4ZeOcO6SgOzYebx+ifY6NF84o0UrjiAlxyVK+jrgvkYUuDsJRbNQYp6CYcEFyDR0gPkd+cA2C9vxACvqC+NQeL3INpfRTQlzmtIQO54NahyrHDuJRcDF/GmRE5C7NpSC5hs5deobxeZFiOsHmW15IttAHm4jhKWAI2Hz17IvdJ3WvrQpRdjMccgk/MfTHIhPmS+YzR59ve68N2LXbu5jBxMQwfgGoHl7dVfk3jQAAAABJRU5ErkJggg==";
const westernCategoryIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMVSURBVHgB7ZZNSFRRFMfPjIORfUkW0ndBiyKCKAqi6AsiIipoU5toEQSBtCx0EUVBBDUWaaYLjTApywqj6IsW7YKiRQuFAiUiKihRLCN1Tv/DO8Oc7lxl3sz4sfAPP+bNvffc+3/nvHvfI5rQhIiYeRV4BpbTWAsmNoPPHKgTLKGxEhZfA35ySr/BFhotYbGVoAUcB4VgGmhWM91guxkboZEWFrmpiydAtZqaCprA3qQJ/BaDRrCWRlJY4KSaSZqKgwIQNWPEzH0d8w1spHwKEy4Gm0BMF7/omKqVTOnYKHhsnqm/4CjlS5hsKfgOBsEVLVGhlivhKZ8YOq9tYqaM8ilMuIP/V6UxVeuYqtQMxtRUhX2wJVNgGeUiveNmzVBS18AkXfyCY6ouWT5nnnM6pp2zOTwRVKoP8HTNRoOTqSqTqSrH1FXzTEn/KdBnYmvCmpHnpk0nfw6KONg59Y6pS5qpQs2ar3zS12Ji3oCSMGbWg0/Owo/ALA6ejeHK5+6+Ok6dU7fBO8l8GDNzwHtO11ew2pSgwemvNpnylk9NhXvHIeC0x0wHWOGMK/aYihtT3t1HYaQTdTuLyJt7kRkzU7Mxm4Py3eX08sk8vvKVUxghYCun64npXwjeansrp3bfdSfG7j57eF6mMEJAmcdQFweH2Tbw2rT3yA1oXLHHVNyYOsZBCReENVTOmUnM7HJipXx32FM+ylYIPpGBmQGwz8REwAYOvol85ZNTPLtvIgSeycBQpxNzkIMTWL6lJ3N6+eQGdlM2QuC9DAzJAjs5OCTl3ZQwfQ85dXi2mnbZCFPCmikBHzkz9XNwUPZ7+ip0vrngi2lfF9bQIc5dL8EMM+ct03dkuPWjjpl5+DlLuekF2BOJRLpN2wdzXZqxISgO5lN26gP14ADM9Dp9g+a6IIyhFtBL4fQHyCm+H0YOgx+Ug2L2DyaTz4kBXN4Adjf8Aq/AU9ChJuRM6QLtiOuhPCnmNmBy2fIJXDaCItAKZMe0oY9phBXzNWLhB7ob5GuuBv8HaJQUG6oDJppoDBSlcaZxZ+gfa3lgNJSTvAIAAAAASUVORK5CYII=";
function createRestaurantTitle({ name, distance }) {
  const container = document.createElement("div");
  container.className = "restaurant__title";
  const nameItem = document.createElement("h3");
  nameItem.className = "restaurant__name text-subtitle";
  nameItem.textContent = name;
  const distanceItem = document.createElement("span");
  distanceItem.className = "restaurant__distance text-body";
  distanceItem.textContent = `캠퍼스부터 ${distance}분 내`;
  container.append(nameItem, distanceItem);
  return container;
}
function createRestaurantDescription({
  showFullDescription,
  description
}) {
  const container = document.createElement("p");
  container.className = showFullDescription ? "restaurant__description.no-clamp text-body" : "restaurant__description text-body";
  container.textContent = description;
  return container;
}
function createRestaurantLink(link) {
  const container = document.createElement("a");
  container.textContent = link;
  container.href = link;
  container.target = "_blank";
  return container;
}
function createRestaurantCategoryIcon({ icon, category }) {
  const container = document.createElement("div");
  container.className = "restaurant__category";
  const image = document.createElement("img");
  image.className = "category-icon";
  image.src = icon;
  image.alt = category;
  container.appendChild(image);
  return container;
}
function getRestaurantCategoryIcon(category) {
  const iconMap = {
    기타: etcCategoryIcon$1,
    양식: westernCategoryIcon$1,
    일식: japaneseCategoryIcon$1,
    중식: chineseCategoryIcon$1,
    한식: koreanCategoryIcon$1,
    아시안: asianCategoryIcon$1
  };
  return iconMap[category] ?? "category-etc.png";
}
function createModal() {
  const modal = document.createElement("div");
  modal.className = "modal modal--open";
  const backdrop2 = document.createElement("div");
  backdrop2.className = "modal-backdrop";
  const container = document.createElement("div");
  container.className = "modal-container";
  modal.append(backdrop2, container);
  document.body.appendChild(modal);
  return { modal, container };
}
function closeExistingModal() {
  const prevModal = document.querySelector(".modal");
  if (prevModal) {
    prevModal.remove();
    return true;
  }
  return false;
}
const addRestaurant = () => {
  if (!checkRequiredForms()) {
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
    icon: getRestaurantCategoryIcon(categorySelect.value),
    category: categorySelect.value,
    name: nameInput.value,
    distance: parseInt(distanceSelect.value),
    description: description.value
  };
  const restaurantList = getRestaurantList();
  restaurantList.push(newRestaurant);
  saveRestaurantList(restaurantList);
  renderList(restaurantList);
  modal.remove();
};
const removeRestaurant = (restaurantName) => {
  const removedRestaurantList = getRestaurantList().filter(
    (restaurant) => restaurant.name !== restaurantName
  );
  saveRestaurantList(removedRestaurantList);
  renderList(removedRestaurantList);
};
function main() {
  document.getElementById("category-filter").addEventListener("change", changeCategory);
  document.getElementById("sorting-filter").addEventListener("change", changeSorting);
  document.querySelector(".gnb__add-button").addEventListener("click", showNewRestaurantModal);
}
function changeCategory() {
  const selectedCategory = document.getElementById("category-filter").value;
  const restaurantList = getRestaurantList();
  const filteredRestaurants = selectedCategory === "전체" ? restaurantList : restaurantList.filter(
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
  } else ;
  renderList(sortedRestaurants);
}
function renderList(list) {
  const activeTab = document.querySelector(".tab-content.active");
  const restaurantList = activeTab.id.includes("favorite") ? list.filter((item) => item.isFavorite === true) : list;
  const ul = activeTab.querySelector(".restaurant-list");
  ul.innerHTML = "";
  const fragment = document.createDocumentFragment();
  restaurantList.forEach((restaurant) => {
    const li = document.createElement("li");
    li.className = "restaurant";
    li.addEventListener("click", showRestaurantDetailModal);
    const categoryIcon = createRestaurantCategoryIcon({
      icon: restaurant.icon,
      category: restaurant.category
    });
    li.appendChild(categoryIcon);
    const infoDiv = document.createElement("div");
    infoDiv.className = "restaurant__info";
    const header = document.createElement("div");
    header.className = "restaurant__header";
    const title = createRestaurantTitle({
      name: restaurant.name,
      distance: restaurant.distance
    });
    const favoriteButton = createFavoriteButton({
      restaurant,
      onToggle: () => toggleFavorite(restaurant.name)
    });
    const description = createRestaurantDescription({
      showFullDescription: false,
      description: restaurant.description
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
function showNewRestaurantModal() {
  if (closeExistingModal()) {
    return;
  }
  const { modal, container } = createModal();
  const title = document.createElement("h3");
  title.className = "modal-title text-subtitle";
  title.textContent = "새로운 음식점";
  const category = createCategoryItem();
  const name = createNameItem();
  const distance = createDistanceItem();
  const description = createDescriptionItem();
  const link = createLinkItem();
  const buttonContainer = createButtonContainer({
    negative: { onClick: closeExistingModal },
    positive: { text: "추가하기", onClick: addRestaurant }
  });
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
function checkRequiredForms() {
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
    isFavorite: target.dataset.isFavorite === "true"
  };
  const { modal, container } = createModal();
  const detailContainer = document.createElement("div");
  detailContainer.className = "restaurant__detail";
  const categoryIcon = createRestaurantCategoryIcon({
    icon: restaurant.icon,
    category: restaurant.category
  });
  const header = document.createElement("div");
  header.className = "restaurant__header";
  const favoriteButton = createFavoriteButton({
    restaurant,
    onToggle: () => toggleFavorite(restaurant.name)
  });
  const infoDiv = document.createElement("div");
  infoDiv.className = "restaurant__info";
  const title = createRestaurantTitle({
    name: restaurant.name,
    distance: restaurant.distance
  });
  const description = createRestaurantDescription({
    showFullDescription: true,
    description: restaurant.description
  });
  const link = createRestaurantLink(restaurant.link);
  const buttonContainer = createButtonContainer({
    negative: {
      text: "삭제하기",
      onClick: () => {
        removeRestaurant(restaurant.name);
        closeExistingModal();
      }
    },
    positive: {
      text: "닫기",
      onClick: closeExistingModal
    }
  });
  header.append(categoryIcon, favoriteButton);
  infoDiv.append(title, description, link);
  detailContainer.append(header, infoDiv);
  container.append(detailContainer, buttonContainer);
  modal.append(backdrop, container);
  document.body.appendChild(modal);
}
function toggleFavorite(restaurantName) {
  const restaurantList = getRestaurantList();
  const index = restaurantList.findIndex(
    (item) => item.name === restaurantName
  );
  if (index === -1) {
    return;
  }
  restaurantList[index].isFavorite = !restaurantList[index].isFavorite;
  saveRestaurantList(restaurantList);
  renderList(restaurantList);
}
function createTabContents() {
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      tabs.forEach((tab2) => tab2.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
      renderList(getRestaurantList());
    });
  });
}
addEventListener("load", main);
addEventListener("DOMContentLoaded", () => {
  if (getRestaurantList().length === 0) {
    const restaurantData = [
      {
        icon: etcCategoryIcon,
        category: "기타",
        name: "도스타코스 선릉점",
        distance: 5,
        description: "맥시칸 캐주얼 그릴",
        link: "https://naver.me/Gn0yLQ8K",
        isFavorite: false
      },
      {
        icon: westernCategoryIcon,
        category: "양식",
        name: "이태리키친",
        distance: 20,
        description: "늘 변화를 추구하는 이태리키친입니다.",
        link: "https://naver.me/5huapW2k",
        isFavorite: false
      },
      {
        icon: japaneseCategoryIcon,
        category: "일식",
        name: "잇쇼우",
        distance: 10,
        description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은\n정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는\n잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
        link: "https://naver.me/FLyTJ4dC",
        isFavorite: false
      },
      {
        icon: chineseCategoryIcon,
        category: "중식",
        name: "친친",
        distance: 5,
        description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과\n정성으로 정통 중식의 세계를 펼쳐갑니다",
        link: "https://naver.me/FV7Y4RTm",
        isFavorite: false
      },
      {
        icon: koreanCategoryIcon,
        category: "한식",
        name: "피앙콩할머니",
        distance: 10,
        description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩\n할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은\n평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선\n맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은\n건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만,\n할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의\n역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은\n만큼 덜어 먹을 수 있게 준비돼 있다.",
        link: "https://naver.me/5Rh0ttMw",
        isFavorite: false
      },
      {
        icon: asianCategoryIcon,
        category: "아시안",
        name: "호아빈 삼성점",
        distance: 15,
        description: "푸짐한 양에 국물이 일품인 쌀국수",
        link: "https://naver.me/5WOQLjn6",
        isFavorite: false
      }
    ];
    saveRestaurantList(restaurantData);
  }
  createTabContents();
  renderList(getRestaurantList());
});

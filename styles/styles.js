// Make list items draggable

const list = document.getElementById("list");
const items = document.querySelectorAll("#list li");
let draggedItem = null;

for (let item of items) {
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragover", dragOver);
  item.addEventListener("drop", drop);
  item.addEventListener("dragend", dragEnd);
}
function dragStart(e) {
  draggedItem = e.target;
  e.dataTransfer.setData("text/plain", null);
}
function dragOver(e) {
  e.preventDefault();
}
function drop(e) {
  e.preventDefault();
  const target = e.target.closest("li");
  if (target && target !== draggedItem) {
    const parent = target.parentNode;
    const nextSibling =
      target.nextSibling === draggedItem
        ? target.nextSibling.nextSibling
        : target.nextSibling;
    parent.insertBefore(draggedItem, nextSibling);
  }
}
function dragEnd(e) {
  draggedItem = null;
}

// Toggle theme between light & dark

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

// Load the user's preferred theme from localStorage
const preferredTheme = localStorage.getItem("theme") || "light";
htmlElement.classList.add(
  preferredTheme === "dark" ? "dark-theme" : "light-theme"
);
updateThemeIcon(preferredTheme);

themeToggle.addEventListener("click", () => {
  htmlElement.classList.toggle("light-theme");
  htmlElement.classList.toggle("dark-theme");

  // Save the new theme preference in localStorage
  const newTheme = htmlElement.classList.contains("dark-theme")
    ? "dark"
    : "light";
  localStorage.setItem("theme", newTheme);

  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const iconPath =
    theme === "dark" ? "./images/icon-moon.svg" : "./images/icon-sun.svg";
  themeIcon.src = iconPath;
}

// count number of items left to do

// Get the .items-left element
const itemsLeftElement = document.querySelector(".items-left");

// Function to update the items left count
function updateItemsLeftCount() {
  // Get all elements with the class 'uncompleted' inside the list
  const uncompletedItems = list.querySelectorAll(".uncompleted");

  // Get the count of uncompleted items
  const uncompletedItemsCount = uncompletedItems.length;

  // Update the text content of the .items-left element
  itemsLeftElement.textContent = `${uncompletedItemsCount} items left`;
}

// Function to save the checkbox and class states to localStorage
function saveStates() {
  const checkboxes = list.querySelectorAll('input[type="checkbox"]');
  const states = {};

  checkboxes.forEach((checkbox) => {
    const listItem = checkbox.closest("li");
    states[checkbox.id] = {
      checked: checkbox.checked,
      completed: listItem.classList.contains("completed"),
    };
  });

  localStorage.setItem("states", JSON.stringify(states));
}

// Function to load the checkbox and class states from localStorage
function loadStates() {
  const states = JSON.parse(localStorage.getItem("states")) || {};

  const checkboxes = list.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    const listItem = checkbox.closest("li");
    const state = states[checkbox.id] || { checked: false, completed: false };

    checkbox.checked = state.checked;
    listItem.classList.toggle("uncompleted", !state.completed);
    listItem.classList.toggle("completed", state.completed);
  });
}

// Call the loadStates function initially
loadStates();

// Call the updateItemsLeftCount function initially
updateItemsLeftCount();

// Add an event listener to the list element
list.addEventListener("click", (event) => {
  const target = event.target;

  // Check if the clicked element is a checkbox
  if (target.type === "checkbox") {
    // Get the parent <li> element
    const listItem = target.closest("li");

    // Toggle the 'uncompleted' and 'completed' classes based on the checkbox state
    listItem.classList.toggle("uncompleted");
    listItem.classList.toggle("completed");

    // Update the items left count after the checkbox state changes
    updateItemsLeftCount();

    // Save the checkbox and class states to localStorage
    saveStates();
  }
});

// Add new items to list

const newItemInput = document.getElementById("new-item-input");

// generate a unique ID for new items
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// create a new list item and all all info
function createNewItem(text) {
  const listItem = document.createElement("li");
  listItem.classList.add("uncompleted");
  listItem.draggable = true;

  const uniqueId = generateUniqueId();

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-checkbox");
  checkbox.id = uniqueId;

  const customCheckbox = document.createElement("span");
  customCheckbox.classList.add("custom-checkbox");

  const checkIcon = document.createElement("img");
  checkIcon.src = "./images/icon-check.svg";
  checkIcon.alt = "Check Icon";
  checkIcon.classList.add("check-icon");

  const label = document.createElement("label");
  label.textContent = text;
  label.htmlFor = uniqueId;

  const removeIcon = document.createElement("img");
  removeIcon.src = "./images/cross.svg";
  removeIcon.alt = "Remove List Item";
  removeIcon.classList.add("cross");

  listItem.appendChild(checkbox);
  listItem.appendChild(customCheckbox);
  listItem.appendChild(checkIcon);
  listItem.appendChild(label);
  listItem.appendChild(removeIcon);
  addEventListener("dragstart", dragStart);
  addEventListener("dragover", dragOver);
  addEventListener("drop", drop);
  addEventListener("dragend", dragEnd);

  return listItem;
}

// Add an event listener to the input field
newItemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const newItemText = newItemInput.value.trim();
    if (newItemText) {
      const newItem = createNewItem(newItemText);
      list.appendChild(newItem);
      newItemInput.value = "";
      updateItemsLeftCount();
      saveStates();
    }
  }
});

// Clear completed items

const clearCompletedLink = document.getElementById("clear-completed");

function removeCompletedItems() {
  const completedItems = list.querySelectorAll(".completed");
  completedItems.forEach((item) => {
    item.remove();
  });
  updateItemsLeftCount();
  saveStates();
}

clearCompletedLink.addEventListener("click", (event) => {
  event.preventDefault();
  removeCompletedItems();
});

// Show or hide the empty list element based on the number of uncompleted items

const listItems = list.querySelectorAll("li");
const emptyListElement = document.querySelector(".empty-list");

function toggleEmptyList() {
  const uncompletedItems = list.querySelectorAll(".uncompleted");
  const hasUncompletedItems = uncompletedItems.length > 0;

  emptyListElement.style.display = hasUncompletedItems ? "none" : "flex";
}

toggleEmptyList();

list.addEventListener("click", (event) => {
  const target = event.target;
  if (target.type === "checkbox") {
    toggleEmptyList();
  }
});

// Get the toggle links
const showAllLink = document.getElementById("show-all");
const showActiveLink = document.getElementById("show-active");
const showCompletedLink = document.getElementById("show-completed");

// filter and display list items
function filterListItems(filter) {
  const listItems = list.querySelectorAll("li");

  showAllLink.classList.remove("active");
  showActiveLink.classList.remove("active");
  showCompletedLink.classList.remove("active");

  switch (filter) {
    case "all":
      showAllLink.classList.add("active");
      break;
    case "active":
      showActiveLink.classList.add("active");
      break;
    case "completed":
      showCompletedLink.classList.add("active");
      break;
  }

  listItems.forEach((item) => {
    const isCompleted = item.classList.contains("completed");

    switch (filter) {
      case "all":
        item.style.display = "flex";
        break;
      case "active":
        item.style.display = isCompleted ? "none" : "flex";
        break;
      case "completed":
        item.style.display = isCompleted ? "flex" : "none";
        break;
    }
  });
}

// Add event listeners to the toggle links
showAllLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("all");
});

showActiveLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("active");
});

showCompletedLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("completed");
});

filterListItems("all");

// remove items by clicking on the cross icon
const listContainer = document.getElementById("list");

listContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("cross")) {
    const listItem = target.closest("li");
    if (listItem) {
      listItem.remove();
      updateItemsLeftCount();
    }
  }
});

updateItemsLeftCount();

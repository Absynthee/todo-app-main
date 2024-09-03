// Make list items draggable
const list = document.getElementById("list");
const items = document.querySelectorAll("#list li");
let draggedItem = null;

// Drag and Drop Functions
function dragStart(e) {
  // Store the dragged item and set the data transfer data
  draggedItem = e.target;
  e.dataTransfer.setData("text/plain", null);
}

function dragOver(e) {
  // Prevent the default behavior to allow drop
  e.preventDefault();
}

function drop(e) {
  // Prevent the default behavior and handle the drop event
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
  // Reset the dragged item
  draggedItem = null;
}

for (let item of items) {
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragover", dragOver);
  item.addEventListener("drop", drop);
  item.addEventListener("dragend", dragEnd);
}

// Helper Function
function updateThemeIcon(theme) {
  // Update the theme icon based on the current theme
  const iconPath =
    theme === "dark" ? "./images/icon-moon.svg" : "./images/icon-sun.svg";
  themeIcon.src = iconPath;
}

// Helper Function
function updateItemsLeftCount() {
  // Update the count of uncompleted items
  const uncompletedItems = list.querySelectorAll(".uncompleted");
  const uncompletedItemsCount = uncompletedItems.length;
  itemsLeftElement.textContent = `${uncompletedItemsCount} items left`;
}

// Save and Load Checkbox and Class States
function saveStates() {
  // Save the checkbox and class states to localStorage
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

function loadStates() {
  // Load the checkbox and class states from localStorage
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

// Helper Function
function generateUniqueId() {
  // Generate a unique ID for new list items
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Create a New List Item
function createNewItem(text) {
  // Create a new list item with the provided text
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

// Save and Load List Items
function saveListItems() {
  // Save the list items to localStorage
  const listItems = Array.from(list.querySelectorAll('li')).map(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const label = item.querySelector('label');
    return {
      text: label.textContent,
      checked: checkbox.checked,
      completed: item.classList.contains('completed')
    };
  });

  localStorage.setItem('listItems', JSON.stringify(listItems));
}

function loadListItems() {
  // Load the list items from localStorage
  const listItems = JSON.parse(localStorage.getItem('listItems')) || [];

  list.innerHTML = '';

  listItems.forEach(item => {
    const newItem = createNewItem(item.text);
    const checkbox = newItem.querySelector('input[type="checkbox"]');
    const listItem = checkbox.closest('li');

    checkbox.checked = item.checked;
    if (item.completed) {
      listItem.classList.remove('uncompleted');
      listItem.classList.add('completed');
    } else {
      listItem.classList.remove('completed');
      listItem.classList.add('uncompleted');
    }

    list.appendChild(newItem);
  });

  updateItemsLeftCount();
}

// Remove Completed Items
function removeCompletedItems() {
  const completedItems = list.querySelectorAll(".completed");
  const confettiContainers = [];

  // Add the fade-out animation to each completed item
  completedItems.forEach((item) => {
    item.classList.add("fade-out");

    const listItemRect = item.getBoundingClientRect();
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    confettiContainer.style.position = "absolute";
    confettiContainer.style.left = `${listItemRect.left}px`;
    confettiContainer.style.top = `${listItemRect.top}px`;
    confettiContainer.style.width = `${listItemRect.width}px`;
    confettiContainer.style.height = `${listItemRect.height}px`;
    document.body.appendChild(confettiContainer);
    confettiContainers.push(confettiContainer);

    for (let i = 0; i < 5; i++) { // Adjust the number of confetti pieces
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * listItemRect.width}px`;
      confetti.style.top = `0px`;
      const randomRotation = Math.floor(Math.random() * 360); // Random rotation between 0 and 359 degrees
      confetti.style.transform = `rotate(${randomRotation}deg)`;
      confettiContainer.appendChild(confetti);
    }
  });

  // Remove the completed items and confetti after the animation completes
  setTimeout(() => {
    completedItems.forEach((item) => {
      item.remove();
    });

    confettiContainers.forEach((container) => {
      container.remove();
    });

    updateItemsLeftCount();
    saveStates();
    saveListItems();
  }, 1000); // 1000ms = 1 second
}


// Toggle Empty List Element
function toggleEmptyList() {
  // Show or hide the empty list element based on the number of uncompleted items
  const uncompletedItems = list.querySelectorAll(".uncompleted");
  const hasUncompletedItems = uncompletedItems.length > 0;

  emptyListElement.style.display = hasUncompletedItems ? "none" : "flex";
}

// Filter and Display List Items
function filterListItems(filter) {
  // Filter and display list items based on the provided filter
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

// Toggle theme between light & dark
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const preferredTheme = localStorage.getItem("theme") || "light";
htmlElement.classList.add(
  preferredTheme === "dark" ? "dark-theme" : "light-theme"
);
updateThemeIcon(preferredTheme);

themeToggle.addEventListener("click", () => {
  htmlElement.classList.toggle("light-theme");
  htmlElement.classList.toggle("dark-theme");

  const newTheme = htmlElement.classList.contains("dark-theme")
    ? "dark"
    : "light";
  localStorage.setItem("theme", newTheme);

  updateThemeIcon(newTheme);
});

const itemsLeftElement = document.querySelector(".items-left");

loadStates();
updateItemsLeftCount();

const newItemInput = document.getElementById("new-item-input");

// Add a New Item
newItemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const newItemText = newItemInput.value.trim();
    if (newItemText) {
      const newItem = createNewItem(newItemText);
      list.appendChild(newItem);
      newItemInput.value = "";
      updateItemsLeftCount();
      saveStates();
      saveListItems();
    }
  }
});

const clearCompletedLink = document.getElementById("clear-completed");

// Clear Completed Items
clearCompletedLink.addEventListener("click", (event) => {
  event.preventDefault();
  removeCompletedItems();
});

const listItems = list.querySelectorAll("li");
const emptyListElement = document.querySelector(".empty-list");

toggleEmptyList();

// Toggle Completion State
list.addEventListener("click", (event) => {
  const target = event.target;

  if (target.type === "checkbox") {
    const listItem = target.closest("li");
    listItem.classList.toggle("uncompleted");
    listItem.classList.toggle("completed");
    updateItemsLeftCount();
    saveStates();
    saveListItems(); 
    toggleEmptyList();
  }
});

const showAllLink = document.getElementById("show-all");
const showActiveLink = document.getElementById("show-active");
const showCompletedLink = document.getElementById("show-completed");

// Show All Items
showAllLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("all");
});

// Show Active Items
showActiveLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("active");
});

// Show Completed Items
showCompletedLink.addEventListener("click", (event) => {
  event.preventDefault();
  filterListItems("completed");
});

filterListItems("all");

const listContainer = document.getElementById("list");

// Remove List Item
listContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("cross")) {
    const listItem = target.closest("li");
    if (listItem) {
      const listItemRect = listItem.getBoundingClientRect();
      const confettiContainer = document.createElement("div");
      confettiContainer.classList.add("confetti-container");
      confettiContainer.style.position = "absolute";
      confettiContainer.style.left = `${listItemRect.left}px`;
      confettiContainer.style.top = `${listItemRect.top}px`;
      confettiContainer.style.width = `${listItemRect.width}px`;
      confettiContainer.style.height = `${listItemRect.height}px`;
      document.body.appendChild(confettiContainer);

      for (let i = 0; i < 5; i++) { // Adjust the number of confetti pieces
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * listItemRect.width}px`;
        confetti.style.top = `0px`;
        const randomRotation = Math.floor(Math.random() * 360); // Random rotation between 0 and 359 degrees
        confetti.style.transform = `rotate(${randomRotation}deg)`;
        confettiContainer.appendChild(confetti);
      }

      listItem.classList.add("fade-out"); // Add the fade-out class

      // Remove the list item and confetti after the animation completes
      setTimeout(() => {
        listItem.remove();
        confettiContainer.remove();
        updateItemsLeftCount();
        saveListItems();
      }, 1000); // 1000ms = 1 second
    }
  }
});

loadListItems();


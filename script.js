const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
const filterInput = document.getElementById('filter');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach(item => {
    addItemToDOM(item);
  });
  checkUI();
  filterInput.value = '';
}


function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  // validate the input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  // check for edit mode
  if(isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    // remove it from the DOM
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkDuplicateItem(newItem)) {
      alert('Item already exists!');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
  filterInput.value = '';
}

function addItemToDOM(item) {
  // create new list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  // this button will take className as parameter
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // append the newly created item into the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();

  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkDuplicateItem(item) {
  const itemsFromStorage = getItemFromStorage();

  return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
  itemInput.focus();
}

function removeItem(item) {
  if(confirm('Are you sure?')){
    // remove item from DOM
    item.remove();

    // here we will remove item from localStorage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(itemText) {
  let itemsFromStorage = getItemFromStorage();

  // filter out the removed item
  itemsFromStorage = itemsFromStorage.filter((i) => i !== itemText);

  // update the localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // clear from localStorage
  localStorage.removeItem('items');
  checkUI();
}


function filterItems (e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => { 
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// this function will check if there is any items listed then it will show the filter textfield and clearall button and list is empty then those two will not show up after loading the page.
function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    filterInput.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    filterInput.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Initialize app
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  filterInput.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();
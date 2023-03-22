const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  // validate the input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // create new list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));

  // this button will take className as parameter
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // append the newly created item into the DOM
  itemList.appendChild(li);
  checkUI();
  itemInput.value = '';
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

function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if(confirm('Are you sure?')){
      e.target.parentElement.parentElement.remove();
      checkUI();
    }
  }
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
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
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    filterInput.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    filterInput.style.display = 'block';
  }
}

itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItems);
filterInput.addEventListener('input', filterItems);

checkUI();
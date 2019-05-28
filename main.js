const form = document.getElementById('addForm');
const ul = document.querySelector('ul');
const clearButton = document.getElementById('clear');
const input = document.getElementById('item');
const todoCount = document.getElementById('todoCount');
const bottomSection = document.getElementById('bottom');
const allFilter = document.getElementById('allFilter');
const activeFilter = document.getElementById('activeFilter');
const completedFilter = document.getElementById('completedFilter');
const mainDiv = document.getElementById('main');
const checkAll = document.getElementById('checkall');

let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
let countCompleted = 0;
let countAll = 0;
const countActive = () => countAll - countCompleted;
const countVisible = () => location.hash === "#active" ? countActive() : location.hash === "#completed" ? countCompleted : countAll;

function countItems() {
    let cc = 0;
    let ca = 0;
    itemsArray.forEach(todo => {
        if (todo.completed)
            ++cc;
        if (todo)
            ++ca;
    });
    countCompleted = cc;
    countAll = ca;
}

function updateActiveText() {
    countItems();
    todoCount.textContent = countActive();
}

function updateVisibility() {
    bottomSection.classList.toggle("hidden", countAll === 0);
    clearButton.hidden = countCompleted === 0;
    setCheckAllBtn(countCompleted === countAll);
    checkAll.classList.toggle("nonvisible", countAll === 0);
}

const nonEmptyItems = () => itemsArray.filter(item => item.text !== "");
const activeItems = () => itemsArray.filter(item => !item.completed);

function saveToStorage() {
    itemsArray = nonEmptyItems();
    localStorage.setItem('items', JSON.stringify(itemsArray));
}

function saveAndUpdate() {
    saveToStorage();
    updateActiveText();
    updateVisibility();
}

function liMaker(text, index, completed) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    const edit = document.createElement('input');
    const span = document.createElement('span');
    const times = document.createElement('i');
    li.id = "todo" + index;
    li.className = "todoGrid";
    if (completed)
        li.classList.add("todoCompleted");
    checkbox.className = "todoCheckbox";
    checkbox.checked = completed;
    span.textContent = text;
    edit.value = text;
    edit.className = "edit";
    edit.hidden = true;
    span.hidden = false;
    checkbox.type = "checkbox";
    times.className = "fas fa-times";
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(edit);
    li.appendChild(times);
    ul.appendChild(li);

    span.addEventListener('dblclick', () => {
        span.hidden = true;
        edit.hidden = false;
        edit.focus();
    });
    
    const removeItem = () => {
        itemsArray.splice(index, 1);
        saveAndUpdate();
        createList();
    };

    const editCompleted = () => {
        if (edit.value === "")
            removeItem();
        else {
            itemsArray[index].text = edit.value;
            saveToStorage();
            span.textContent = edit.value;
            span.hidden = false;
            edit.hidden = true;
        }
    }

    edit.addEventListener('focusout', editCompleted);
    edit.addEventListener('keyup', e => {
        if (e.key === "Enter")
            editCompleted();
        else if (e.key === "Escape") {
            // undo the entered text
            edit.value = span.textContent;
            editCompleted();
        }
    });

    times.addEventListener('click', removeItem);

    checkbox.addEventListener('click', () => {
        itemsArray[index].completed = checkbox.checked;
        li.classList.toggle("todoCompleted", checkbox.checked);
        saveAndUpdate();
    });
}

function createList() {
    ul.innerHTML = "";
    itemsArray.forEach((item, i) => {
        liMaker(item.text, i, item.completed);
    });
}

allFilter.addEventListener('click', () => {
    location.hash = 'all';
})

activeFilter.addEventListener('click', () => {
    location.hash = 'active'
})

completedFilter.addEventListener('click', () => {
    location.hash = 'completed'
})

window.onload = locationHashChanged;
window.onhashchange = locationHashChanged;

function locationHashChanged() {
    console.log(location.hash);
    if (location.hash === '#all') {
        ul.className = "";
        allFilter.className = "active";
        completedFilter.className = "";
        activeFilter.className = "";
    } else if (location.hash === '#completed') {
        ul.className = "completedFilter";
        allFilter.className = "";
        completedFilter.className = "active";
        activeFilter.className = "";
    } else if (location.hash === '#active') {
        ul.className = "activeFilter";
        allFilter.className = "";
        completedFilter.className = "";
        activeFilter.className = "active";
    }
    updateVisibility();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    itemsArray.push({
        completed: false,
        text: input.value
    });
    saveAndUpdate();
    liMaker(input.value, itemsArray.length - 1, false);
    bradness(input.value);
    input.value = '';
})

const bradness = text => {
    if (text.toLowerCase().includes("brad") && text.toLowerCase().includes("pitt")) {
        document.body.style.backgroundImage = "url('https://www.rollingstone.com/wp-content/uploads/2018/06/rs-18735-20140414-bradpitt-x1800-1397509559.jpg?crop=900:600&width=1910')"
        ul.style.opacity = "0.6";
        Array.from(document.getElementsByClassName("bradfix")).forEach(e => e.style.color = "white");
    }
}

clearButton.addEventListener('click', () => {
    itemsArray = activeItems();
    saveAndUpdate();
    createList();
    if (location.hash === '#completed')
        location.hash = 'all';
})

function toggleCheckAllBtn() {
    checkAll.classList.toggle('fa-angle-down');
    return checkAll.classList.toggle('fa-angle-up');
}

function setCheckAllBtn(bool) {
    checkAll.classList.toggle('fa-angle-down', !bool);
    checkAll.classList.toggle('fa-angle-up', bool);
}

checkAll.addEventListener('click', () => {
    let checked = toggleCheckAllBtn();
    itemsArray.forEach(item => item.completed = checked);
    saveAndUpdate();
    createList();
})

itemsArray = nonEmptyItems();
updateActiveText();
updateVisibility();
createList();
const form = document.getElementById('addForm');
const ul = document.querySelector('ul');
const button = document.getElementById('clear');
const input = document.getElementById('item');
const todoCount = document.getElementById('todoCount');
const bottomSection = document.getElementsByClassName('bottomGrid')[0];
const allFilter = document.getElementById('allFilter');
const doneFilter = document.getElementById('doneFilter');
const activeFilter = document.getElementById('activeFilter');
const mainDiv = document.getElementsByClassName('small-container')[0];
const pile = document.getElementsByClassName('pile')[0];
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

new Sortable(ul, {
	animation: 150,
    ghostClass: 'dragging',
    chosenClass: 'dragging',
    onUpdate: function () {
        // Gör en save function på ny sorterad list.
	},
});

const updateCount = () => {
    let countDone = 0;
    let countAll = 0;
    itemsArray.forEach(todo => {
        if (!todo.done)
            ++countDone;
        if (todo)
            ++countAll;
    })
    todoCount.textContent = countDone;

    if (countAll === 0)
        bottomSection.classList.add("hidden");
    else
        bottomSection.classList.remove("hidden");
}

const removeEmpty = () => itemsArray = itemsArray.filter(item => item.text !== "");

const save = () => {
    removeEmpty();
    localStorage.setItem('items', JSON.stringify(itemsArray));
    updateCount();
}

const liMaker = (text, index, done) => {
    //if (text != "") {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const edit = document.createElement('input');
        const span = document.createElement('span');
        const times = document.createElement('i');
        li.id = "todo" + index;
        li.className = "todoGrid";
        if (done)
            li.classList.add("todoDone");
        checkbox.className = "todoCheckbox";
        checkbox.checked = done;
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
            save();
            createList();
        };

        const editDone = () => {
            if (edit.value === "")
                removeItem();
            else {
                itemsArray[index].text = edit.value;
                save();
                span.textContent = edit.value;
                span.hidden = false;
                edit.hidden = true;
            }
        }

        edit.addEventListener('focusout', editDone);
        edit.addEventListener('keyup', e => {
            if (e.key === "Enter")
                editDone();
            else if (e.key === "Escape") {
                edit.value = span.textContent;
                editDone();
            }
        });

        times.addEventListener('click', removeItem);

        checkbox.addEventListener('click', () => {
            itemsArray[index].done = checkbox.checked;
            if (checkbox.checked)
                li.classList.add("todoDone");
            else
                li.classList.remove("todoDone");
            save();
        });
    //}
}

const createList = () => {
    ul.innerHTML = "";
    var i = 0;
    itemsArray.forEach(item => {
        liMaker(item.text, i++, item.done);
    });
}

allFilter.addEventListener('click', () => {
    ul.className = "";
    allFilter.className = "active";
    doneFilter.className = "";
    activeFilter.className = "";
})

doneFilter.addEventListener('click', () => {
    ul.className = "doneFilter";
    allFilter.className = "";
    doneFilter.className = "active";
    activeFilter.className = "";
})

activeFilter.addEventListener('click', () => {
    ul.className = "activeFilter";
    allFilter.className = "";
    doneFilter.className = "";
    activeFilter.className = "active";
})

function locationHashChanged() {
    if (location.hash === '#all') {
        ul.className = "";
        allFilter.className = "active";
        doneFilter.className = "";
        activeFilter.className = "";
    } else if (location.hash === '#done') {
        ul.className = "doneFilter";
        allFilter.className = "";
        doneFilter.className = "active";
        activeFilter.className = "";
    } else if (location.hash === '#active') {
        ul.className = "activeFilter";
        allFilter.className = "";
        doneFilter.className = "";
        activeFilter.className = "active";
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    itemsArray.push({
        done: false,
        text: input.value
    });
    save();
    liMaker(input.value, itemsArray.length - 1, false);
    bradness(input.value);
    input.value = '';
})

const bradness = text => {
    if (text.toLowerCase().includes("brad") && text.toLowerCase().includes("pitt")) {
        document.body.style.backgroundImage = "url('https://www.rollingstone.com/wp-content/uploads/2018/06/rs-18735-20140414-bradpitt-x1800-1397509559.jpg?crop=900:600&width=1910')"
        ul.style.opacity = "0.6";
    }
}

button.addEventListener('click', () => {
    localStorage.clear();
    itemsArray = [];
    ul.innerHTML = "";
    updateCount();
})

pile.addEventListener('click', () => {
    if (mainDiv.classList.contains("pappershog"))
        mainDiv.classList.remove("pappershog");
    else
        mainDiv.classList.add("pappershog");
})

window.onhashchange = locationHashChanged();

removeEmpty();
updateCount();
createList();
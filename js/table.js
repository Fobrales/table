var allHeaders = ['ID', 'First name', 'Last name', 'Phone', 'About', 'Eye color'];
var globalData = [];
var globalPage = 1;

// getting data from JSON file.
function getData(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.send();
    rawFile.onload = function() {
        if (rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
}

// parsing JSON data.
function loadData(text) {
    var data = JSON.parse(text);
    globalData = data;
    creatingTable(data);
}

// creating table and form for editing string of table.
function creatingTable(data) {
    makePanelForHide();
    makePageSelector(data);
    var tableContainer = document.createElement('div');
    tableContainer.id = "table_container";
    document.body.append(tableContainer);
    var editStringForm = document.createElement('div');
    editStringForm.id = "edit_string";
    editStringForm.style.display = 'none';
    document.body.append(editStringForm);
    if (tableContainer && editStringForm) {
        makeTable(data);
    }
}

// make string for each object in json file's array.
function makeString(string, table) {
    var entry = document.createElement('tr');
    entry.id = string.id;
    for (let field in string) {
        makeField(field, entry, string);
    }
    entry.addEventListener('click', editStringForm);
    entry.style.cursor = 'pointer';
    table.append(entry);
}

// creating new column for user's last name.
function makeLastName(lastName, string) {
    var column = document.createElement('td');
    string.append(column);
    column.innerHTML = lastName;
    column.className = "lastname";
}

// color's data will provide as color circle.
function makeColorCircle(color) {
    var div = document.createElement('div');
    div.className = 'color-circle';
    div.style.backgroundColor = color;
    return div;
}

// make field in table from string data, also
//  for field "name" make other column for last name,
//  for field "eyeColor" make color providing
function makeField(field, string, data) {
    var column = document.createElement('td');
    string.append(column);
    switch (field) {
        case 'name':
            var lastName = data.name.lastName;
            makeLastName(lastName, string);
            column.innerHTML = data.name.firstName;
            column.className = 'firstname';
            break;
        case 'eyeColor':
            column.style.backgroundColor = data.eyeColor;
            column.className = field.toLowerCase();
            break;
        default:
            column.className = field.toLowerCase();
            column.innerHTML = data[field];
    }
}

function sortByField() {
    let sortField = this.innerText.replace(' ', '').toLowerCase();
    let entries = document.getElementsByClassName(sortField);
    console.log(entries);
}

function hideColumn() {
    let field = this.name.replace(' ', '').toLowerCase();
    let columns = document.body.getElementsByClassName(field);
    if (this.checked) {
        for (let field of columns) {
            field.style = '';
        }
    } else {
        for (let field of columns) {
            field.style = 'display: none';
        }
    }
}

function editStringForm() {
    const form = document.getElementById('edit_string');
    form.innerHTML = '';
    form.style.top = this.offsetTop;
    form.style.display = '';
    for (let attr of allHeaders) {
        makeEditingInput(attr, form, this);
    }
    form.append(makeEditingButtons(form, this));
}

// make form for editing entry in table with autocompleting by field's value , also "eye color" field providing as text.
function makeEditingInput(attr, form, string) {
    let text = document.createTextNode(attr);
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-text';
    let field = string.querySelector("." + attr.replace(' ', ''));
    input.value = (attr == 'Eye color' ? field.style.backgroundColor : field.innerText);
    let cont = document.createElement('div');
    cont.append(text);
    cont.append(input);
    cont.className = 'form-input-editing';
    form.append(cont);
}

function makeEditingButtons(form, string) {
    cont = document.createElement('div');
    cont.className = 'func-editing-buttons';
    complete = document.createElement('button');
    complete.innerText = 'Edit';
    complete.name = string.id;
    complete.addEventListener('click', editString);
    cancel = document.createElement('button');
    cancel.innerText = 'Cancel';
    cancel.addEventListener('click', function () {
        form.style.display = 'none';
    })
    cont.append(complete);
    cont.append(cancel);
    return cont;
}


function editString() {
    const fields = document.getElementsByClassName('form-input-editing');
    findString = this.name;
    let entry = document.getElementById(findString);
    for (let field of fields) {
        let attr = field.firstChild.textContent.replace(' ', '').toLowerCase();
        let column = entry.querySelector("." + attr);
        let newValue = field.querySelector(".input-text").value;
        if (column.innerText != newValue) {
            switch (column.className) {
                case 'eyecolor':
                    column.style.backgroundColor = newValue;
                    break;
                default:
                    column.innerText = newValue;
            }
        }
    }
}
// make table header with function sorting on click concrete header
function makeHeadTable(table) {
    var head = document.createElement('tr');
    for (let field of allHeaders) {
        var header = document.createElement('td');
        header.innerHTML = field;
        header.className = field.replace(' ', '').toLowerCase();
        header.addEventListener('click', sortByField);
        header.style.cursor = 'pointer';
        head.append(header);
    }
    table.append(head);
}

function makePanelForHide() {
    let panel = document.createElement('div');
    panel.className = 'hide-panel';
    panel.append(document.createTextNode('Show columns: '));
    for (let header of allHeaders) {
        let cont = document.createElement('id');
        let showList = document.createElement('input');
        showList.type = 'checkbox';
        showList.name = header;
        showList.id = 'showHeader';
        showList.checked = true;
        showList.addEventListener('change', hideColumn);
        let label = document.createElement('label');
        label.for = 'showHeader';
        label.innerText = header;
        cont.append(showList);
        cont.append(label);
        panel.append(cont);
    }
    document.body.append(panel);
}

function setPage() {
    globalPage = this.value;
    makeTable(globalData, globalPage);
}

function makePageSelector(data) {
    let panel = document.createElement('div');
    panel.append(document.createTextNode('Show page: '));
    let selector = document.createElement('select');
    let pages = Math.ceil(data.length / 10);
    for (let i = 1; i <= pages; i++) {
        let page = document.createElement('option');
        page.innerText = i.toString();
        page.value = i.toString();
        selector.append(page);
    }
    selector.addEventListener('change', setPage);
    panel.append(selector);
    document.body.append(panel);
}

function pagination(input, size) {
    return input.reduce((arr, item, i) => {
        return (i % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]);
    }, []);
}

function getDataFromPage(page) {
    let pages = Math.ceil(globalData.length / 10);
    let paginated = pagination(globalData, 10);
    return paginated[page-1];
}

function makeTable(data = globalData, page = globalPage) {
    let tableContainer = document.getElementById('table_container');
    tableContainer.innerHTML = '';
    data = getDataFromPage(page);
    var table = document.createElement('table');
    tableContainer.append(table);
    makeHeadTable(table);
    for (let string of data) {
        makeString(string, table);
    }
}

getData("data.json", loadData);
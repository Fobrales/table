
// getting data from JSON file
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

// parsing JSON data
function loadData(text) {
    var data = JSON.parse(text);
    console.log(data);
    creatingPage(data);
}

function creatingPage(data) {
    var tableContainer = document.createElement('div');
    tableContainer.id = "table_container";
    document.body.append(tableContainer);
    var editStringForm = document.createElement('div');
    editStringForm.id = "edit_string";
    document.body.append(editStringForm);
    if (tableContainer && editStringForm) {
        makeTable(data, tableContainer);
    }
}

function makeString(string, table) {
    var entry = document.createElement('tr');
    entry.id = string.id;
    table.append(entry);
    for (let field in string) {
        makeField(field, entry, string);
    }
}

function makeLastName(lastName, string) {
    var column = document.createElement('td');
    string.append(column);
    column.innerHTML = lastName;
}

function makeColorCircle(color) {
    var div = document.createElement('div');
    div.className = 'color-circle';
    div.style.backgroundColor = color;
    return div;
}

function makeField(field, string, data) {
    var column = document.createElement('td');
    string.append(column);
    column.className = field;
    switch (field) {
        case 'name':
            var lastName = data.name.lastName
            makeLastName(lastName, string);
            data.name = data.name.firstName;
            column.innerHTML = data[field];
            break;
        case 'eyeColor':
            column.className = data.eyeColor;
            var color = makeColorCircle(data.eyeColor);
            column.append(color);
            break
        default:
            column.innerHTML = data[field];
    }
}

function makeHeadTable(table) {
    var head = document.createElement('tr');
    head.innerHTML = "<td>ID</td><td>First name</td><td>Last name</td><td>Number</td><td>About</td><td>Color of eye</td>";
    var func = document.createElement('tr');
    table.append(head);
}

function makeTable(data, tableContainer) {
    var table = document.createElement('table');
    tableContainer.append(table);
    makeHeadTable(table);
    for (let string of data) {
        makeString(string, table);
    }
}

getData("data.json", loadData);
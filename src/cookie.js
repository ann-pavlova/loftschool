/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let cookiesBl = [];
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

function loadCookies() {
    let currentCookies = document.cookie.split('; ');
    for(var i = 0; i< currentCookies.length; i++) {
        let nameValue = currentCookies[i].split('=');
        let cookieObject = {name: nameValue[0], value: nameValue[1]};
        cookiesBl.push(cookieObject);
    }
    addAllCookiesToTable();
}

function addAllCookiesToTable() {
    for(let j = 0; j < cookiesBl.length; j++) {
        addCookieToTable(cookiesBl[j].name, cookiesBl[j].value);
    }
}


function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function createOrUpdateCookie(name, value) {
    document.cookie = name + "=" + value;
}

function filterCookies() {
    let inputValue = filterNameInput.value;

    if (!inputValue) {
        addAllCookiesToTable();
    }

    listTable.innerHTML = '';

    for (let y = 0; y < cookiesBl.length; y++) {
        if (cookiesBl[y].name.indexOf(inputValue) === 0) {
            addCookieToTable(cookiesBl[y].name, cookiesBl[y].value);
        }
    }
}


function addCookieToTable(name, value) {
    if(!name) {
        return;
    }
    let deleteCookieBtn = document.createElement("BUTTON");
    deleteCookieBtn.innerText = 'Удалить';
    deleteCookieBtn.setAttribute("cookieName", name);
    let row = document.createElement("TR");
    listTable.appendChild(row);
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = value;
    row.insertCell(2).appendChild(deleteCookieBtn);
    deleteCookieBtn.addEventListener('click', deleteCookieClick);
}

function deleteCookieClick (e) {
    let cookieName = e.target.getAttribute('cookieName');
    let currentCookieRow = this.parentElement.parentElement;
    deleteCookie(cookieName);
    deleteCookieBl(cookieName);
    listTable.removeChild(currentCookieRow);
}

function addCookieEmptyFilter(cookie) {
    let isCookieUpdated = updateCookie(cookie.name, cookie.value);
    if (!isCookieUpdated) {
        cookiesBl.push(cookie);
    }

    createOrUpdateCookie(cookie.name, cookie.value);

    if (isCookieUpdated) {
        let deleteCell = document.querySelector('[cookieName=' + cookie.name + ']');
        if(!deleteCell){
            return;
        }

        let tableRow = deleteCell.parentElement.parentElement;
        tableRow.cells[1].innerHTML = cookie.value;
    } else {
        addCookieToTable(cookie.name, cookie.value);
    }
}

function addCookieNoEmptyFilter(cookie) {
    if(cookie.name.indexOf(filterNameInput.value) === 0) {
        let isCookieUpdated = updateCookie(cookie.name, cookie.value);
        if (!isCookieUpdated) {
            cookiesBl.push(cookie);
        }
        if (isCookieUpdated) {
            let deleteCell = document.querySelector('[cookieName=' + cookie.name + ']');
            if(!deleteCell){
                return;
            }

            let tableRow = deleteCell.parentElement.parentElement;
            tableRow.cells[1].innerHTML = cookie.value;
        } else {
            addCookieToTable(cookie.name, cookie.value);
        }
    } else {
        cookiesBl.push(cookie);
    }

    createOrUpdateCookie(cookie.name, cookie.value);
}

function addCookieClick() {
    let cookie = {name: addNameInput.value, value: addValueInput.value};
    if(filterNameInput.value === '') {
        addCookieEmptyFilter(cookie);
    } else {
        addCookieNoEmptyFilter(cookie);
    }
}

function deleteCookieBl(name) {
    for(let i = 0; i < cookiesBl.length; i++) {
        if(cookiesBl[i].name === name) {
            let index = cookiesBl.indexOf(cookiesBl[i]);
            cookiesBl.splice(index, 1);
            return;
        }
    }
}

function updateCookie(name, value) {
    for (let i = 0; i < cookiesBl.length; i++) {
        if (cookiesBl[i].name === name) {
            cookiesBl[i].value = value;
            return true;
        }
    }

    return false;
}

window.addEventListener('load', loadCookies);
window.addEventListener('load', () => {
    addButton.addEventListener('click', addCookieClick);
    filterNameInput.addEventListener('keyup', filterCookies);
});




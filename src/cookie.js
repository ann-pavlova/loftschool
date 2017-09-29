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
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');


filterNameInput.addEventListener('keyup', function() {
});

let createNewCookie = function () {
    document.cookie = addNameInput.value + "=" + addValueInput.value;
};

let deleteNewCookie = function () {
    document.cookie = addNameInput.value + "=" + addValueInput.value + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

addButton.addEventListener('click', () => {
    createNewCookie();
    let deleteCookieBtn = document.createElement("BUTTON");
    deleteCookieBtn.innerText = 'Удалить';

    let row = document.createElement("TR");
    listTable.appendChild(row);//добавили строку

    row.insertCell(0).innerHTML = addNameInput.value;//добавили имя куки
    row.insertCell(1).innerHTML = addValueInput.value;//добавили значение куки
    row.insertCell(2).appendChild(deleteCookieBtn);//добавили кнопку

    deleteCookieBtn.addEventListener('click', function () {
        deleteNewCookie();//удалили куку
        let test = this.parentElement.parentElement;
        listTable.removeChild(test);
    });
});


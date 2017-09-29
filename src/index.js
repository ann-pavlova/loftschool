import './main.css';
const friendsList = require('./list.hbs');

function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if(data.error) {
                reject(new Error(data.error.error_msq));
            } else {
                resolve(data.response);
            }
        })
    })
}

const promise = new Promise((resolve, reject) => {
    VK.init({
       apiId: 6201545
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 8);
});

promise
    .then(() => {
        return api('users.get', {v: 5.68, name_case: 'gen'});
    })
    .then(() => {
        return api('friends.get', {v: 5.68, fields: 'first_name, last_name, photo_50'});
    })
    .then(data => {
        const result = document.querySelector('.j-list-all');
        const temp = friendsList({list: data.items});
        result.innerHTML = temp;
    })
    .then(() => {
        let addBtn = document.querySelector('.b-main__list-right-part');
        addBtn.addEventListener('click', function () {
            let listNew = document.querySelector('.b-main__list_type_new');
            let currentItem = this.parentElement;
            listNew.appendChild(currentItem);
            this.classList.add('is-active');
        });
    })
    .then(() => {
        let removeBtn = document.querySelector('.b-main__list-right-part.is-active');
        removeBtn.addEventListener('click', function () {
            let listAll = document.querySelector('.b-main__list_type_all');
            let currentItem = this.parentElement;
            listAll.appendChild(currentItem);
            this.classList.remove('is-active');
        });
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });





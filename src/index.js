import './main.css';
const createFriendsView = require('./list.hbs');

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
    .then((data) => {
        pageController.init(data.items);
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });

let pageController = {
    source: [],
    target: [],
    sourceDomContent: document.querySelector('.b-main__list_type_all'),
    targetDomContent: document.querySelector('.b-main__list_type_new'),
    init(friends) {
        this.source = friends;
        this.renderSourceFriends();
    },
    renderSourceFriends() {
        this.sourceDomContent.innerHTML = createFriendsView({list: this.source, isTarget: false});
        this.addSourceFriendEvents();
    },
    renderTargetFriends() {
        this.targetDomContent.innerHTML = createFriendsView({list: this.target, isTarget: true});
    },
    addSourceFriendEvents() {
        let friendItems = document.getElementsByClassName('b-main__list-item');
        for(var i = 0; i < friendItems.length; i++) {
            friendItems[i].querySelector('.b-main__list-right-part').addEventListener('click', this.moveFriendFromSource);
        }
    },
    moveFriendFromSource(e) {
        let that = pageController;
        let target = e.currentTarget;
        let friendId = parseInt(target.parentElement.getAttribute('friendId'));

        let friend = that.searchAndGetFriendInArray(that.source, friendId);
        if (!friend) {
            return;
        }

        that.target.push(friend);
        that.sourceDomContent.removeChild(target.parentElement);
        that.renderTargetFriends();
    },
    searchAndGetFriendInArray(array, id) {
        for(var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                let friends = array.splice(i ,1);
                return friends[0];
            }
        }

        return null;
    }

};





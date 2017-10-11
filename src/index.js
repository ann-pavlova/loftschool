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
        document.querySelector('.b-main__list_type_new').addEventListener('dragover', this.handleDragOver, false);
        document.querySelector('.b-main__list_type_new').addEventListener('drop', this.handleDragDrop, false);
    },
    renderSourceFriends() {
        this.sourceDomContent.innerHTML = createFriendsView({list: this.source, isTarget: false});
        this.addSourceFriendEvents();
    },
    renderTargetFriends() {
        this.targetDomContent.innerHTML = createFriendsView({list: this.target, isTarget: true});
        this.addTargetFriendEvents();
    },
    addSourceFriendEvents() {
        let friendSourceItems = document.querySelector('.b-main__list_type_all').getElementsByClassName('b-main__list-item');
        for(var i = 0; i < friendSourceItems.length; i++) {
            friendSourceItems[i].querySelector('.b-main__list-right-part').addEventListener('click', this.moveFriendFromSource);
            friendSourceItems[i].addEventListener('dragstart', this.handleDragStart, false);
            friendSourceItems[i].addEventListener('dragend', this.handleDragEnd, false);
        }
    },
    addTargetFriendEvents() {
        let friendTargetItems = document.querySelector('.b-main__list_type_new').getElementsByClassName('b-main__list-item');
        for(var i = 0; i < friendTargetItems.length; i++) {
            friendTargetItems[i].querySelector('.b-main__list-right-part').addEventListener('click', this.moveFriendFromTarget);
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
    moveFriendFromTarget(e) {
        let that = pageController;
        let target = e.currentTarget;
        let friendId = parseInt(target.parentElement.getAttribute('friendId'));

        let friend = that.searchAndGetFriendInArray(that.target, friendId);
        if (!friend) {
            return;
        }

        that.source.push(friend);
        that.targetDomContent.removeChild(target.parentElement);
        that.renderSourceFriends();
    },
    searchAndGetFriendInArray(array, id) {
        for(var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                let friends = array.splice(i ,1);
                return friends[0];
            }
        }

        return null;
    },
    handleDragStart(e) {
        e.currentTarget.style.opacity = 0.4;
        e.dataTransfer.setData('friendId', this.getAttribute('friendid'));
    },
    handleDragOver(e) {
        e.preventDefault();
    },
    handleDragDrop(e) {
        e.preventDefault();
        if (e.target.classList.contains('b-main__list_type_new')) {
            let friendId = parseInt(e.dataTransfer.getData('friendId'));
            let friend = pageController.searchAndGetFriendInArray(pageController.source, friendId);
            pageController.target.push(friend);
            pageController.renderTargetFriends();
            pageController.renderSourceFriends();
        }
    },
    handleDragEnd(e) {
        e.currentTarget.style.opacity = 1;
    }
};





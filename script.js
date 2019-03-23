VK.init({
    apiId: 6909911
});

let objFriendsVk;
let save = document.querySelector('#js-save');
let vkFriends = document.querySelector('#js-vk-friends');
let dropBlock = document.querySelector('#js-dropBlock');
let searchVk = document.querySelector('#js-searchVk');
let searchFriends = document.querySelector('#js-searchFriends');
let currentDrag;

let objFriends = [];

let saveObjFriendsVk = localStorage.getItem('objFriendsVk');
let saveObjFriends = localStorage.getItem('objFriends');

let createItemVk = (data) => {

    let html = '';

    dropBlock.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        html += `<li class="windowItems__item" 
                    draggable="true"
                    data-photo_100="${data[i].photo_100}" 
                    data-first_name="${data[i].first_name}"  
                    data-last_name="${data[i].last_name}" ">
                <div class="windowItems__col">
                    <div class="windowItems__img">
                        <img src="${data[i].photo_100}" height="45" width="45"/>
                    </div>
                </div>
                <div class="windowItems__col">
                    <div class="windowItems__fio">${data[i].first_name} ${data[i].last_name}</div>
                </div>
                <div class="windowItems__col">
                    <img class="windowItems__close" src="images/close_grey.png" height="16" width="16"/>
                </div>
            </li>`;
    }

    dropBlock.innerHTML = html;
};

const filterFriends = () => {

    let array = [];

    for (let i = 0; i < objFriends.length; i++) {
        if (isMatching(objFriends[i].first_name, searchFriends.value) || isMatching(objFriends[i].last_name, searchFriends.value)) {
            array.push(objFriends[i]);
        }
    }

    createItemVk(array);
};

const filterVk = () => {

    let array = [];

    for (let i = 0; i < objFriendsVk.length; i++) {
        if (isMatching(objFriendsVk[i].first_name, searchVk.value) || isMatching(objFriendsVk[i].last_name, searchVk.value)) {
            array.push(objFriendsVk[i]);
        }
    }

    addFriends({ items: array });
};

let addFriends = (obj) => {
    let sourceVkFriends = document.getElementById("vk-friends").innerHTML;
    let templateVkFriends = Handlebars.compile(sourceVkFriends);
    let tmpText = templateVkFriends(obj);
    vkFriends.innerHTML = '';
    vkFriends.innerHTML = tmpText;
};

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        }, 2);
    });
}

if (saveObjFriendsVk && saveObjFriends) {
    saveObjFriendsVk = JSON.parse(saveObjFriendsVk);
    saveObjFriends = JSON.parse(saveObjFriends);

    objFriendsVk = saveObjFriendsVk;
    objFriends = saveObjFriends;

    createItemVk(objFriends);

    addFriends({ items: objFriendsVk});
} else {
    auth()
        .then(() => {
            return callAPI('friends.get', {fields: 'first_name, last_name, photo_100', count : 4 });
        })
        .then(me => {
            objFriendsVk = me.items;
            addFriends({ items: objFriendsVk});
        });
}

searchFriends.addEventListener('keyup', function() {
    filterFriends();
});

searchVk.addEventListener('keyup', function() {
    filterVk();
});

document.addEventListener('click', e => {
    let target = e.target;
    let objData = {};

    if (target.classList.contains('windowItems__add')) {
        let elem = target.closest('.windowItems__item');

        objData = { first_name : elem.dataset.first_name, last_name : elem.dataset.last_name, photo_100: elem.dataset.photo_100 };
        objFriends.push(objData);
        createItemVk(objFriends);
        removeItemVk(elem.dataset.first_name,elem.dataset.last_name);

        elem.remove();
    }
    
    if (target.classList.contains('windowItems__close')) {
        let elem = target.closest('.windowItems__item');

        objData = { first_name : elem.dataset.first_name, last_name : elem.dataset.last_name, photo_100: elem.dataset.photo_100 };

        objFriendsVk.push(objData);
        createItemFriends(objFriendsVk);
        removeItemFriends(elem.dataset.first_name,elem.dataset.last_name);

        elem.remove();
    }
});

document.addEventListener("drag", e => {

}, false);

document.addEventListener("dragstart", e => {
    let target = e.target;
    let zone = target.closest('.windowItems__item');

    if (zone) {
        currentDrag = { startZone: zone, node: zone };
        e.dataTransfer.setData('text/html', 'dragstart');
    }

}, false);

document.addEventListener("dragend", e => {
    //console.log("dragend", e);
}, false);

document.addEventListener("dragover", e => {
    e.preventDefault();
    //console.log("dragover", e);
}, false);

document.addEventListener("dragenter", e => {
    //console.log("dragenter", e);
}, false);

document.addEventListener("dragleave", e => {
    //console.log("dragleave", e);
}, false);

document.addEventListener("drop", e => {
    e.preventDefault();

    let target = e.target;
    let objData = {};

    currentDrag.startZone.remove();

    if (target.closest('#js-dropBlock')) {
        objData = {
            first_name : currentDrag.node.dataset.first_name,
            last_name : currentDrag.node.dataset.last_name,
            photo_100: currentDrag.node.dataset.photo_100
        };
        objFriends.push(objData);
        createItemVk(objFriends);

        removeItemVk(currentDrag.node.dataset.first_name, currentDrag.node.dataset.last_name);
    }

    if (target.closest('#js-vk-friends')) {
        objData = {
            first_name : currentDrag.node.dataset.first_name,
            last_name : currentDrag.node.dataset.last_name,
            photo_100: currentDrag.node.dataset.photo_100
        };
        objFriendsVk.push(objData); 
        createItemFriends(objFriendsVk);

        removeItemFriends(currentDrag.node.dataset.first_name, currentDrag.node.dataset.last_name);
    }

}, false);

let removeItemFriends = (first_name, last_name) => {
    for (let i = 0; i < objFriends.length; i++) {
        if (objFriends[i].first_name === first_name && objFriends[i].last_name === last_name) {
            objFriends.splice(i, 1);
        }
    }
};

let removeItemVk = (first_name, last_name) => {
    for (let i = 0; i < objFriendsVk.length; i++) {
        if (objFriendsVk[i].first_name === first_name && objFriendsVk[i].last_name === last_name) {
            objFriendsVk.splice(i, 1);
        }
    }
};

let createItemFriends = (data) => {

    let html = '';

    vkFriends.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        html += `<li class="windowItems__item" 
                    draggable="true" 
                    data-photo_100="${data[i].photo_100}" 
                    data-first_name="${data[i].first_name}"  
                    data-last_name="${data[i].last_name}" ">
                <div class="windowItems__col">
                    <div class="windowItems__img">
                        <img src="${data[i].photo_100}" height="45" width="45"/>
                    </div>
                </div>
                <div class="windowItems__col">
                    <div class="windowItems__fio">${data[i].first_name} ${data[i].last_name}</div>
                </div>
                <div class="windowItems__col">
                    <img class="windowItems__add" src="images/plus.png" height="16" width="16"/>
                </div>
            </li>`;
    }

    vkFriends.innerHTML = html;
};

const isMatching = (full, chunk) => {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) {
        return true;
    }
    return false;
};

save.addEventListener('click', e => {
    localStorage.setItem('objFriendsVk', JSON.stringify(objFriendsVk));
    localStorage.setItem('objFriends', JSON.stringify(objFriends));

    alert('Сохранено!');
});

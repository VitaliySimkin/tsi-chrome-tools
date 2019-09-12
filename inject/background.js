//блок подписки/отписки на открытый девтулс
var connections = {};
/**
 * Подписка на события хрома для определения открытия окна devtool
 */
chrome.runtime.onConnect.addListener(function (port) {
    /**
     * Callback функция обрабатывающая сообщение от страницы devtools.js
     * @param {Object} message Объект сообщения
     * @param {Object} sender Объект отправителя
     * @param {Object} sendResponse Response
     */
    var extensionListener = function (message, sender, sendResponse) {
        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name == "init") {
            connections[message.tabId] = port;
            return;
        }
        // other logic
        /********/
    }
    /**
     * Подписка на сообщения конкретного экземпляра окна devtool
     */
    port.onMessage.addListener(extensionListener);
    /**
     * Отписка при закрытии окна devtool
     */
    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener);
        var tabs = Object.keys(connections);
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]]
                break;
            }
        }
    });
});

/**
 * Receive message from content script and relay to the devTools page for the current tab
 * Слушает сообщения отправляемые из content - script.js и перенаправляет их в devtools.js
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
        var tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(request);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});

//блок работы с контекстным меню
var contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
/**
 * Отправка сообщения для открытия скрипта
 * @param {Integer} tabId Id активной вкладки
 * @param {Object} message Объект сообщения
 */
function openClickedElScript(tabId, message) {
    if (tabId) {
        connections[tabId].postMessage(message);
    }
};
/**
 * Получение названия Page
 * @param {String} pageUrl 
 */
function getPageName(pageUrl) {
    let pattern;
    if (pageUrl.indexOf('SectionModuleV2') !== -1) {
        pattern = 'SectionModuleV2';
    } else if (pageUrl.indexOf('CardModuleV2') !== -1) {
        pattern = 'CardModuleV2';
    } else if (pageUrl.indexOf('LookupSectionModule') !== -1) {
        pattern = 'LookupSectionModule';
    }
    let pageName;
    if (pattern) {
        let t1 = pageUrl.substr(pageUrl.indexOf(pattern));
        if (pageUrl.indexOf('/edit') !== -1) {
            t1 = t1.substr(0, t1.indexOf('/edit'));
        }
        pageName = pageName = t1.substr(t1.indexOf('/') + 1).split('/');
    }
    return pageName;
}
/**
 * Обработка нажатия контекстного меню
 * @param {Object} info 
 * @param {Object} tab 
 */
function onContextMenuClicked(info, tab) {
    let pageName = getPageName(info.pageUrl);
    if (pageName && pageName.length > 0) {
        for (let i = 0; i < pageName.length; i++) {
            const element = pageName[i];
            if (element) {
                openClickedElScript(tab.id, {
                    script: element + '.js',
                    name: 'tsi-chrome-tools-openscript'
                });
            }
        }
    }
}
/**
 * Создание контекстного меню
 */
chrome.contextMenus.create({
    title: "Open script",
    id: '987',
    contexts: contexts
});
/**
 * Подписка на событие клика в контекстном меню
 */
chrome.contextMenus.onClicked.addListener(onContextMenuClicked);
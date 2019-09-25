try {


    var message = [];
    /**
     * Открывает файл со скриптом по переданному url в окне devtool
     * @param {String} url Url адрес загружаемого скрипта
     */
    function openFile(url) {
        if (url) {
            chrome.devtools.panels.openResource(url, 0, function () {
                console.log("devtools.js load");
            });
        }
    };
    /**
     * Получает список ресурсов вкладки
     * @param {Array} res Массив с загруженными ресурсами страницы
     */
    function getPageResources(res) {
        if (this.message && this.message.length > 0) {
            for (let i = 0; i < this.message.length; i++) {
                const src = this.message[i];
                //Получаем данные о js файле по переданному названии
                let script = res.find(x => x.url.indexOf(src.script) !== -1);
                if (script && script.url) {
                    openFile((script.url));
                }
            }
            this.message = [];
        }
    }
    /**
     * Создание соединения с background.js
     */
    var backgroundPageConnection = chrome.runtime.connect({
        name: "panel"
    });
    /**
     * Передача сообщения об открытии окна devtool для вкладки
     */
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    /**
     * Подписка на сообщения посылаемые из background.js
     */
    backgroundPageConnection.onMessage.addListener(function (message) {
        this.message.push(message);
        chrome.devtools.inspectedWindow.getResources(getPageResources);
    });

} catch (error) {
    console.error(error);
}
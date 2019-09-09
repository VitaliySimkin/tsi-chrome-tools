export default [
	"dark-side",
	"bpm-column-info",
	"bpm-entity-info",
	"bpm-package-sort",
	"bpm-parent-name",
	"jira-epic-filter",
	"jira-resizable",
	"bpm-lookup-name-search"
];


/**
 * @typedef {object} NSFeatureConfig
 * @property {string} title заголовок фичи
 * @property {boolean} [enable=true] включена ли фича
 * 
 * @property {?object} inject налаштування скриптів та стилів які будуть додаватись на сторінку
 * @property {?boolean} inject.forBpmDev для конфігурації bpmonline
 * @property {?boolean} inject.forJira для Jira
 * @property {?boolean} inject.forBpm для bpmonline
 * @property {?string} inject.js назва файлу з скриптом для додавання на сторінку
 * @property {?string} inject.css назва файлу з стилями для додавання на сторінку
 * 
 * @property {object} description опис
 * @property {string} description.text текст
 * @property {string} description.code код для відображення
 * @property {string} description.screen файл з зображенням
 * 
 * @example
 * export default {
 *     title: "Додати кота",
 *     enable: false, // за замовчуванням вимкнено
 *     inject: {
 *         forBpm: true, // для сайтів bpmonline
 *         js: "append-cat.js", // назва файлу js. Рекомендується називати аналогічно коду фічі (для пошуку)
 *         css: "append-cat.css" // кастомні стилі
 *     },
 *     description: { // бажано додати опис щоб користувачі знали що робить фіча
 *         screen: "lazy-cat.png", // рекомендована ширина - 400px
 *         text: "Вверху по понеділкам буде кіт який спить"
 *     }
 * };
 */

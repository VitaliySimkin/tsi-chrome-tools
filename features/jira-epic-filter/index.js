export default {
	"title": {
		"ru": "JIRA. Фильтрация задач по эпикам и задачам",
		"ua": "JIRA. Фільтрація задач по епікам і задачам",
		"en": "JIRA. Filtering tasks by epic and tasks"
	},
	"inject": {
		"forJira": true,
		"js": "jira-epic-filter.js",
		"css": "jira-epic-filter.css"
	},
	"description": {
		"screen": "jira-epic-filter.png",
		"text": {
			"ru": `Добавляет на панель быстрых фильтров в спринт возможность фильтрации по эпику.
Кроме этого можно фильтровать задачи по их заголовку. Если в качестве фильтра ввести "@flag" то будут отображаться все таски на флаге. А если "@!flag" - все таски без него`,
			"ua": `Додає на панель швидких фільтрів в спрінті можливість фільтрації по епікам.
Крім цього можна фільтрувати задачі по їхньому заголовку. Якщо в якості фільтра ввести "@flag" то відображатимуться всі таски на флазі. А як "@!flag" - всі таски без нього`,
			"en": `Adds the ability to filter by epic on the quick filter panel in the sprint.
In addition, you can filter tasks by their title. If you enter "@flag" as a filter, then all tasks on the flag will be displayed. And if "@!flag" - all tasks without it`
		}
	}
};

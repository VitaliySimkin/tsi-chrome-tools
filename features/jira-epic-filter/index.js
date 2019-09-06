export default {
	title: "JIRA. Фільтрація задач по епікам і задачам",
	inject: {
		forJira: true,
		js: "jira-epic-filter.js",
		css: "jira-epic-filter.css"
	},
	description: {
		screen: "jira-epic-filter.png",
		text: "Додає на панель швидких фільтрів в спрінті можливість фільтрації по епікам.\n" +
			"Крім цього можна фільтрувати задачі по їхньому заголовку. Якщо в якості фільтра ввести \"@flag\" " +
			"то відображатимуться всі таски на флазі. А як \"@!flag\" - всі таски без нього"
	}
};
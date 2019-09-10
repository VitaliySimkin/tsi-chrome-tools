export default {
	"title": {
		"ru": "[ALPHA] BPM. Информация об объекте",
		"ua": "[ALPHA] BPM. Інформація про об'єкт",
		"en": "[ALPHA] BPM. Entity info"
	},
	"enable": true,
	"inject": {
		"forBpm": true,
		"js": "bpm-entity-info.js",
		"css": "bpm-entity-info.css"
	},
	"description": {
		"screen": "bpm-entity-info.png",
		"text": {
			"ru": `Цель - удобное отображение информации о entity. Пока только первая версия.
Для использования нажмите [CTRL] + [SHIFT] + [E] на странице.
Название entity чувствительна к регистру.
Поля фильтруются по названию и заголовку, нечувствительно к регистру`,
			"ua": `Ціль - зручне відображення інформації про entity. Поки що тільки перша версія.
Для користування натисність [CTRL] + [SHIFT] + [E] на сторінці.
Назва entity чутлива до регістру.
Поля фільтруються по назві та заголовку, нечутливе до регістру`,
			"en": `The goal is a convenient display of information about the entity. So far, only the first version.
To use, press [CTRL] + [SHIFT] + [E] on the page.
The entity name is case sensitive.
Fields are filtered by name and title, case insensitive`
		}
	}
};

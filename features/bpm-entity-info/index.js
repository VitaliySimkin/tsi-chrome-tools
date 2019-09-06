export default {
	title: "[ALPHA] BPM. Інформація про обєкт",
	enable: true,
	inject: {
		forBpm: true,
		js: "bpm-entity-info.js",
		css: "bpm-entity-info.css"
	},
	description: {
		screen: "bpm-entity-info.png",
		text: "Ціль - зручне відображення інформації про entity. Поки що тільки перша версія. \n" +
			"Для користування натисність [CTRL] + [SHIFT] + [E] на сторінці. \n" +
			"Назва entity чутлива до регістру.\n" +
			"Поля фільтруються по назві та заголовку, нечутливе до регістру"
	}
};
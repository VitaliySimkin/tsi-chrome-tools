export default {
	title: "BPM. Сортування пакетів в конфігурації",
	inject: {
		forBpmDev: true,
		js: "bpm-package-sort.js"
	},
	description: {
		screen: "bpm-package-sort.png",
		code: `let sortPriority = [
	item.IsChanged,
	item.IsContentChanged,
	item.Name === "TsiBase",
	item.Name.startsWith("TsiBase"),
	item.Name.startsWith("Tsi"),
	item.Name.startsWith("Ts"),
	item.Maintainer !== "Terrasoft",
	other
];`,
		text: ""
	}
};
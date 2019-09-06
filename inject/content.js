const ContentManager = {
	async init() {
		this.loadSettings(function() {
			this.initListener();
			this.loadScript();
		});
	},

	getFeatures() {
		let features = JSON.parse(JSON.stringify(this.SettingManager.features));
		Object.values(features).map(this.replaceInjectUrl, this);
		return features;
	},

	replaceInjectUrl({code, inject}) {
		if (!inject) {
			return;
		}
		inject.js && (inject.js = chrome.extension.getURL(`setting/${code}/${inject.js}`));
		inject.css && (inject.css = chrome.extension.getURL(`setting/${code}/${inject.css}`));
	},

	initListener() {
		let features = this.getFeatures();

		window.addEventListener("message", function(event) {
			try {
				let data = JSON.parse(event.data);
				if (data.type === "tsi-help-tools" && data.direction === "from_page") {
					window.postMessage(JSON.stringify({type: "tsi-help-tools", features}), "*");
				}
			} catch (err) {}
		}.bind(this));
	},

	loadScript() {
		let script = document.createElement("script");
		script.type = "module";
		script.src = chrome.extension.getURL("inject/inject.js");
		document.head.appendChild(script);
		this.script = script;
	},

	async loadSettings(callback) {
		const src = chrome.extension.getURL("setting/SettingManager.js");
		const contentMain = await import(src);
		this.SettingManager = contentMain.default;
		if (this.SettingManager.initied) {
			typeof callback === "function" && callback();
		}
		this.SettingManager.on("setting-initied", undefined, callback, this);
	}
}


try {
	ContentManager.init();
} catch(err) {
	console.error("TSI HELP TOOLS Нажаль виникла помилка :(", err)
}
import SettingManager from "../manager/ns-manager.js";
import Vue from "./vue.js";

const NSApp = {
	"MODE": {
		"FeatureList": "FeatureList",
		"ProjectList": "ProjectList",
		"ArchiveList": "ArchiveList",
		"LangList": "LangList"
	},
	"lang": {
		"ru": {
			"code": "ru",
			"caption": "Русский"
		},
		"ua": {
			"code": "ua",
			"caption": "Українська"
		},
		"en": {
			"code": "en",
			"caption": "English"
		},
	},
	"lczString": {
		"ru": {
			"IndexHtmlSettingsCaption": "Настройки",
			"IndexHtmlLangsCaption": "Язык",
			"CustomConfigWillNotBeSavedErrorMsg": "Пользовательская настройка не будет сохранена"
		},
		"ua": {
			"IndexHtmlSettingsCaption": "Налаштування",
			"IndexHtmlLangsCaption": "Мова",
			"CustomConfigWillNotBeSavedErrorMsg": "Призначена для користувача установка не буде збережена"
		},
		"en": {
			"IndexHtmlSettingsCaption": "Settings",
			"IndexHtmlLangsCaption": "Language",
			"CustomConfigWillNotBeSavedErrorMsg": "Custom config will not be saved"
		}
	},
	/** Инициализировать приложение
	 * @param {HTMLElement} elem елемент для загрузки приложения
	 */
	init(elem) {
		// eslint-disable-next-line no-undef
		this.vue = new Vue({
			"el": elem,
			data() {
				return {
					"NSApp": NSApp,
					"features": {},
					"langs": {},
					"mode": NSApp.MODE.FeatureList,
					"lang": NSApp.lang.ru.code,
					"defLang": NSApp.lang.ru.code,
					"customConfigDebouncedFn": null
				};
			},
			"watch": {},
			"methods": {
				getLczValue(code) {
					const lzcString = NSApp.lczString;
					return lzcString[this.lang][code] || lzcString[this.defLang][code] || "";
				},

				getFeatureTitle(feature) {
					const featTitle = feature.title;
					if (typeof featTitle === "string") {
						return featTitle;
					}
					return featTitle[this.lang] || featTitle[this.defLang] || featTitle[Object.keys(featTitle)[0]] || "";
				},

				getFeatureDescriptionText(feature) {
					const featDescr = feature.description.text;
					if (typeof featDescr === "string") {
						return featDescr;
					}
					return featDescr[this.lang] || featDescr[this.defLang] || featDescr[Object.keys(featDescr)[0]] || "";
				},

				initLanguages() {
					this.langs = JSON.parse(JSON.stringify(NSApp.lang));
				},

				setLanguage(lang, event) {
					const row = this.getRow(event.target);
					this.lang = lang.code;
				},

				isLang(lang) {
					return this.lang === lang.code;
				},

				changeActive(code) {
					SettingManager.setFeatureEnable(code, !this.features[code].enable);
				},

				initDarkSide() {
					this.setDarkSide();
					SettingManager.on("enableChange", function(code) {
						if (code === "dark-side") {
							this.setDarkSide();
						}
					}, this);
				},

				setDarkSide() {
					let isEnable = SettingManager.isEnable("dark-side");
					document.body.className = isEnable ? "dark" : "light";
				},

				getRow(target) {
					let el = target;
					while (el) {
						if (el.classList.contains("ns-row-cnt")) {
							return el;
						}
						el = el.parentElement;
					}
				},

				showDescription(feature, event) {
					const row = this.getRow(event.target);
					if (row) {
						row.scrollIntoViewIfNeeded();
					}
					setTimeout(function() {
						if (row) {
							row.scrollIntoViewIfNeeded();
						}
					}.bind(this), 300);
					feature.showDescription = !feature.showDescription;
				},

				setFeatures(features) {
					for (let featureCode in features) {
						features[featureCode].showDescription = false;
						features[featureCode].showCustomConfig = false;
						features[featureCode].customConfigJson = "{}";
					}
					this.features = {};
					Object.keys(features).sort().forEach(key => {
						this.features[key] = features[key];
					}, this);
				},

				initFeatures(callback) {
					let scope = this;
					if (SettingManager.initied) {
						scope.setFeatures(SettingManager.features);
						callback();
					}
					SettingManager.on("setting-initied", function() {
						scope.setFeatures(SettingManager.features);
						callback();
					}, this);
				},

				showCustomConfig(feature, event) {
					const row = this.getRow(event.target);
					if (row) {
						row.scrollIntoViewIfNeeded();
					}
					setTimeout(function() {
						if (row) {
							row.scrollIntoViewIfNeeded();
						}
					}.bind(this), 300);
					feature.showCustomConfig = !feature.showCustomConfig;
					if (feature.showCustomConfig) {
						feature.customConfigJson = JSON.stringify(feature.customConfig, null, 4);
					}
				},

				createDebounceFunction(fn, time) {
					let timeout;
					return function() {
						const functionCall = () => fn.apply(this, arguments);
						clearTimeout(timeout);
						timeout = setTimeout(functionCall, time);
					}
				},

				onCustomConfigInput(feature) {
					if (this.customConfigDebouncedFn == null) {
						this.customConfigDebouncedFn = this.createDebounceFunction(async json => {
							let config = null;
							try {
								config = JSON.parse(json);
								feature.customConfig = config;
								await window.NSManager.storage.set({[`tsi-chrome-tools-${feature.code}-custom-config`]: config});
							} catch (e) {
								console.error(e);
								alert(this.getLczValue("CustomConfigWillNotBeSavedErrorMsg"));
							}
							this.customConfigDebouncedFn = null;
						}, 1000);
					}
					this.customConfigDebouncedFn(feature.customConfigJson);
				}
			},
			"computed": {},
			mounted() {
				this.initFeatures(() => {
					this.initDarkSide();
				});
				this.initLanguages();
			}
		});
	}
};


Vue.component("ns-button-menu-item", {
	"props": ["icon", "caption"],
	data() {
		return {};
	},
	"template": "<li>{{caption}}</li>"
});

Vue.component("ns-button", {
	"props": ["active", "icon", "caption", "size"],
	data() {
		return {
			"showsubmenu": false
		};
	},
	"methods": {
		onclick(event) {
			this.$emit("click", event);
		}
	},
	"template": `<div class="ns-button" :size="size" :active="active"
		@click="onclick($event)">
		<span v-if="icon" class="icon"
			:style="'background-image: url(' + icon +')'"></span>
		<span v-if="caption" class="caption">{{caption}}</span>
	</div>`
});

Vue.component("ns-switch", {
	"props": ["value"],
	data() {
		return {};
	},
	"template": `<input type="checkbox" class="toggle-switch"
		:checked="value" @change="$emit('change', $event.target.checked)"></input>`
});


Vue.component("ns-feature", {
	"props": ["feature"],
	data() {
		return {};
	},
	"template": `<span class="ns-button" :active="active" @click="$emit('click', $event.target.value)">
		<span v-if="icon" class="ns-button-icon" :style="'background-image: url(' + icon + ')'"></span>
		<span v-if="caption" class="ns-button-caption">{{caption}}</span>
	</span>`
});

export default NSApp;

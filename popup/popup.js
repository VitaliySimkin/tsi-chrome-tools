import SettingManager from "../manager/ns-manager.js";
import Vue from "./vue.js";
// test
const NSApp = {
	MODE: {
		FeatureList: "FeatureList",
		ProjectList: "ProjectList",
		ArchiveList: "ArchiveList"
	},
	/** Инициализировать приложение
	 * @param {HTMLElement} elem елемент для загрузки приложения
	 */
	init(elem) {
		// eslint-disable-next-line no-undef
		this.vue = new Vue({
			el: elem,
			data() {
				return {
					NSApp: NSApp,
					features: {},
					mode: NSApp.MODE.FeatureList
				};
			},
			watch: {},
			methods: {
				changeActive(code) {
					SettingManager.setFeatureEnable(code, !this.features[code].enable);
				},
				initDarkSide() {
					this.setDarkSide();
					SettingManager.on("enableChange", function(code) {
						if (code === "dark-side") this.setDarkSide();
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
					let row = this.getRow(event.target);
					if (row) row.scrollIntoViewIfNeeded();
					setTimeout(function() {
						if (row) row.scrollIntoViewIfNeeded();
					}.bind(this), 300);
					feature.showDescription = !feature.showDescription;
				}, 
				setFeatures(features) {
					for (let featureCode in features) {
						features[featureCode].showDescription = false;
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
				}
			},
			computed: {},
			mounted() {
				let scope = this;
				this.initFeatures(function() {
					scope.initDarkSide();
				});
			}
		});
	}
};


Vue.component("ns-button-menu-item", {
	props: ["icon", "caption"],
	data() {return {};},
	template: "<li>{{caption}}</li>"
});

Vue.component("ns-button", {
	props: ["active", "icon", "caption", "size"],
	data() {
		return {
			showsubmenu: false
		};
	},
	methods: {
		onclick(event) {
			this.$emit("click", event);
		}
	},
	template: `<div class="ns-button" :size="size" :active="active"
		@click="onclick($event)">
		<span v-if="icon" class="icon"
			:style="'background-image: url(' + icon +')'"></span>
		<span v-if="caption" class="caption">{{caption}}</span>
	</div>`
});

Vue.component("ns-switch", {
	props: ["value"],
	data() {
		return {};
	},
	template: `<input type="checkbox" class="toggle-switch"
		:checked="value" @change="$emit('change', $event.target.checked)"></input>`
});


Vue.component("ns-feature", {
	props: ["feature"],
	data() {
		return {};
	},
	template: `<span class="ns-button" :active="active" @click="$emit('click', $event.target.value)">
		<span v-if="icon" class="ns-button-icon" :style="'background-image: url(' + icon + ')'"></span>
		<span v-if="caption" class="ns-button-caption">{{caption}}</span>
	</span>`
});

export default NSApp;

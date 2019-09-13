import NSStorage from "./ns-storage.js";

/**
 * @typedef NSFeature
 * @property {string} title заголовок
 * @property {boolean} enable включена
 */

/**
 * @typedef NSEventListener
 * @property {string} event event code
 * @property {Function} callback event callback
 * @property {object} scope callback scope
 */

/** Менеджер фич
 * @class
 */
const NSManager = {
	// #region common methods
	/** Feature and user settings is initied */
	"initied": false,

	/** Хранилище
	 * @type {NSStorage}
	 */
	"storage": NSStorage,

	/** Init manager */
	async init() {
		let featuresCode = (await import("../features/index.js")).default;
		await this.initFeatures(featuresCode);
		await this.initUserFeatures();
		this.initied = true;
		this.fireEvent("setting-initied");
	},
	// #endregion

	// #region events
	/** event listeners
	 * @type {NSEventListener[]}
	 */
	_listeners: [],

	/** Fire event
	 * @param {string} event event code
	 * @param {any[]} params event params
	 */
	fireEvent(event, params = []) {
		if (!Array.isArray(params)) {
			params = [params];
		}
		let isEventListener = listen => listen.event === event;
		let callListener = listen => listen.callback.apply(listen.scope, params);
		this._listeners.filter(isEventListener).forEach(callListener);
	},

	/** add event listener
	 * @param {string} event event code
	 * @param {Function} callback handler
	 * @param {object} scope handler scope
	 */
	on(event, callback, scope) {
		this._listeners.push({event, callback, scope});
	},

	/** remove event listener
	 * @param {string} event event code
	 * @param {Function} callback handler
	 */
	un(event, callback) {
		let isListener = listen => listen.event === event && listen.callback === callback;
		let remove = (item, index) => this._listeners.splice(index, 1);
		this._listeners.filter(isListener).forEach(remove);
	},
	// #endregion

	// #region features method
	/** Фичи
	 * @type {object.<string,NSFeature>}
	 */
	features: Object.create(null),

	/** Пользовательськие настройки
	 * @type {object.<string,NSFeature>}
	 */
	userFeatures: Object.create(null),

	/** define feature
	 * @param {string} code feature code
	 * @param {NSFeature} config feature config
	 */
	defineFeature(code, config = {}, customFeatureConfig = {}) {
		config = JSON.parse(JSON.stringify(config));
		config.code = code;
		config.enable = !(config.enable === false);
		config.customConfig = { ...config.customConfig, ...customFeatureConfig };
		this.features[code] = config;
	},

	/** Включить/отключить фичу
	 * @param {string} code feature code
	 * @param {boolean} enable feature is enable
	 */
	setFeatureEnable(code, enable) {
		let feature = this.features[code];
		if (feature) {
			feature.enable = Boolean(enable);
			this.saveFeatureEnable(code, enable);
			this.fireEvent("enableChange", code);
		}
		if (code === "dark-side") {
			feature.description.screen = enable ? "light.png" : "dark.png";
			feature.description.text = enable ?
				"COME TO THE ̶D̶A̶R̶K̶  LIGHT SIDE" :
				"COME TO THE DARK SIDE";
		}
	},

	/** Get feature is enable
	 * @param {string} code feature code
	 */
	isEnable(code) {
		return Boolean((this.features[code] || {}).enable);
	},

	/** init user features enabling */
	async initUserFeatures() {
		this.userFeatures = (await this.storage.get(["features"]) || {}).features ||
			Object.create(null);
		for (const code in this.userFeatures) {
			this.setFeatureEnable(code, this.userFeatures[code].enable);
		}
	},

	/** Load and init features settings
	 * @param {string[]} featuresCode features code list
	 */
	async initFeatures(featuresCode) {
		return await Promise.all(featuresCode.map(this.initFeature, this));
	},

	/** Load and init feature
	 * @param {string} featureCode feature code
	 */
	async initFeature(featureCode) {
		const featureCustomConfigStorageCode = `tsi-chrome-tools-${featureCode}-custom-config`;
		const [imported, customConfig] = await Promise.all([
			import(`../features/${featureCode}/index.js`),
			window.NSManager.storage.get([featureCustomConfigStorageCode])
		]);
		this.defineFeature(featureCode, imported.default, customConfig[featureCustomConfigStorageCode] || {});
	},

	/** Save feature enabling
	 * @param {string} code feature code
	 * @param {boolean} enable feature is enable
	 */
	saveFeatureEnable(code, enable) {
		this.userFeatures = this.userFeatures || Object.create(null);
		this.userFeatures[code] = {enable};
		this.storage.set({features: this.userFeatures});
	}
	// #endregion
};

NSManager.init();
window.NSManager = NSManager;

export default NSManager;

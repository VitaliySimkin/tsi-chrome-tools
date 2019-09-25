/**
 * @typedef NSFeature
 * @property {string} title заголовок
 */


/** Менеджер фич
 * @class
 */
const NSManager = {
	/** Фичи
	 * @type {object.<string,NSFeature>}
	 */
	"features": Object.create(null),
	"_listeners": [],
	"initied": false,
    /** get feature
     * @param {string} code feature code
     * @returns {NSFeature}
     */
	getFeature(code) {
		return this.features[code] || null;
	},
	setEnable(code, enable) {
		let feature = this.getFeature(code);
		feature.title
		_l
	},
	langs: Object.create(null)
};

export default NSManager;

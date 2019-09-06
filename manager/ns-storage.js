/**
 * @global chrome
 */

/** Хранилище */
const NSStorage = {
	/** Get values from cache
	 * @param {string[]} keys value keys
	 */
	get(keys) {
		return new Promise((resolve) =>
			chrome.storage.sync.get(keys, values => resolve(values)));
	},
	/** Set values to cache
	 * @param {object.<string,any>} values values
	 */
	set(values) {
		return new Promise((resolve) =>
			chrome.storage.sync.set(values, resp => resolve(resp)));
	}
};

export default NSStorage;
(function() {
	try {
		const customConfig = JSON.parse(window.localStorage.getItem("tsi-chrome-tools-bpm-package-sort-custom-config"));
		const sortPriority = eval(customConfig && customConfig.sortPriority || null) || [
			(item = {IsChanged: false}) => item.IsChanged,
			(item = {IsContentChanged: false}) => item.IsContentChanged,
			(item = {SysRepository_Name: ""}) => !!item.SysRepository_Name,
			(item = {Name: ""}) => item.Name === "TsiBase",
			(item = {Name: ""}) => item.Name.startsWith("TsiBase"),
			(item = {Name: ""}) => item.Name.startsWith("Tsi"),
			(item = {Name: ""}) => item.Name.startsWith("Ts"),
			(item = {Maintainer: ""}) => item.Maintainer !== "Terrasoft"
		];
		const itemSortPriority = item => (1 + sortPriority.findIndex(fn => fn(item))) || Number.MAX_SAFE_INTEGER;
		const baseOnLoad = Terrasoft.DataSource.prototype.onLoadResponse;
		Terrasoft.DataSource.prototype.onLoadResponse = function() {
			if (this.id === "SysPackageDataSource" && Array.isArray(arguments[0])) {
				arguments[0] = arguments[0].sort((itemA, itemB) => (itemSortPriority(itemA) - itemSortPriority(itemB)) ||
					((itemA['SysRepository_Name'] || "") > (itemB['SysRepository_Name'] || "")
						? 1
						: (itemA['SysRepository_Name'] || "") < (itemB['SysRepository_Name'] || "")
							? -1
							: 0
					)
				);
			}
			baseOnLoad.apply(this, arguments);
		};
		if (window.PackageTree && typeof window.PackageTree.onRefreshPage === "function") {
			window.PackageTree.onRefreshPage(true);
		}
	} catch (err) {
		console.error(err);
	}
})();

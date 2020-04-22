import getSchemaNames from "../../modules/sys-schema-request/sys-schema-request.js";

(async function() {
	function replace(schemaInfo) {
		const baseLoadData = Terrasoft.ComboBox.prototype.loadData;
		Terrasoft.ComboBox.prototype.loadData = function(data) {
			if (this.columnName === "SchemaUId") {
				data.forEach(item => {
					const simkData = schemaInfo.find(r => r.UId === item[0]);
					item[1] = simkData && simkData.Name || item[1];
				});
			}
			baseLoadData.apply(this, arguments);
		};
	}

	const schemaInfo = await getSchemaNames();
	replace(schemaInfo);
})()

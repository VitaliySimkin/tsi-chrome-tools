import getSchemaNames from "../../modules/sys-schema-request/sys-schema-request.js";

(async function() {
	const schemaInfo = await getSchemaNames();
	SchemaComboBoxEdit.store.data.on("add", function(index, value, key) {
		const schemaInfoObject = schemaInfo.find(x => value && value.data && x.Id === value.data.value || false);
		if (!schemaInfoObject || schemaInfoObject.Name === value.data.text) {
			return;
		}
		value.data.caption = value.data.text;
		value.data.text = schemaInfoObject.Name;
	})
})()

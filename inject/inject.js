(function() {
	const TsiHelpToolsInjectManager = {
		loadFeatures(callback) {
			let scope = this;
			window.addEventListener("message", function(event) {
				try {
					let data = JSON.parse(event.data);
					if (data.type === "tsi-help-tools" && data.direction !== "from_page") {
						callback.call(scope, data.features);
					}
				} catch (err) { }
			}.bind(this));
			window.postMessage(JSON.stringify({ type: "tsi-help-tools", direction: "from_page" }), "*");
		},

		loadScript(url) {
			let script = document.createElement("script");
			script.type = "module";
			script.src = url;
			document.head.appendChild(script);
		},

		loadCss(url) {
			let link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", url);
			document.head.appendChild(link);
		},

		init() {
			this.loadFeatures(function(features) {
				if (features && typeof features === "object") {
					this.initFeatures(features)
				}
			});
		},

		initFeatures(features) {
			Object.values(features).filter(this.isRelevant, this).forEach(this.initFeature, this);
		},

		isRelevant(feature) {
			try {
				let enable = feature && feature.enable;
				let hasInject = feature && feature.inject;
				if (!enable || !hasInject) {
					return false;
				}
				if (feature.inject.forJira) {
					return this.isJira();
				} else if (feature.inject.forBpm) {
					return this.isBpm();
				} else if (feature.inject.forBpmDev) {
					return this.isBpmDev();
				} else {
					return false;
				}
			} catch (err) {
				return false;
			}
		},

		isJira() {
			return window.JIRA;
		},

		isBpm() {
			return Terrasoft && Terrasoft.BaseEdit;
		},

		isBpmDev() {
			return Terrasoft && Terrasoft.DataSource;
		},

		async initFeature(feature) {
			if (feature.inject.js) {
				this.loadScript(feature.inject.js);
			}
			if (feature.inject.css) {
				this.loadCss(feature.inject.css);
			}
		}
	};
	TsiHelpToolsInjectManager.init();
})();

import NSApp from "./popup.js";

document.getElementById("ns-main-loading").style.display = "none";
document.getElementById("app").hidden = false;
NSApp.init(document.getElementById("app"));
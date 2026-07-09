sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/projectone/projectoneui/model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("com.projectone.projectoneui.controller.BaseController", {
        formatter: formatter
    });
});

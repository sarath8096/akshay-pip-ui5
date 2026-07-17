sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/projectone/projectoneui/model/formatter",
    "com/projectone/projectoneui/library/datasource/ProjectDataSource",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, formatter, ProjectDataSource, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.projectone.projectoneui.controller.BaseController", {
        formatter: formatter,

        dataSource: new ProjectDataSource(),

        /**
         * Shows a toast message, or a confirm dialog when sType is "C"
         * @param {string} sType
         * @param {string} sMessage
         * @param {string} [sDetail]
         * @param {Function} [fnCallback]
         */
        fnMessageShow(sType, sMessage, sDetail, fnCallback) {
            if (sType === "C") {
                MessageBox.confirm(sMessage, {
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK && fnCallback) {
                            fnCallback("YES");
                        }
                    }
                });
                return;
            }

            MessageToast.show(sMessage);
        }
    });
});

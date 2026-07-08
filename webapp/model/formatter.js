sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {
        /**
         * Formats a date value to "dd/MM/yy"
         * @param {string|number|Date} vDate
         * @returns {string}
         */
        formatDate(vDate) {
            if (!vDate) {
                return "";
            }

            const oDate = new Date(vDate);
            if (isNaN(oDate)) {
                return vDate;
            }

            const oDateFormat = DateFormat.getDateInstance({
                pattern: "MMM dd, yyyy",
                UTC: true
            });

            return oDateFormat.format(oDate);
        },

        /**
         * formatStatusState to format state
         * @param {string} sStatus
         * @returns {string}
         */
        formatStatusState(sStatus) {
            switch (sStatus) {
                case "Completed":
                    return "Success";
                case "At Risk":
                    return "Error";
                case "In Progress":
                    return "Warning";
                case "Not Started":
                default:
                    return "None";
            }
        },

        fnGetPriorityIconByCode: function (sPriority) {
            switch (sPriority) {
                case "High":
                    return "sap-icon://arrow-top";
                case "Medium":
                    return "sap-icon://arrow-right";
                case "Low":
                    return "sap-icon://arrow-bottom";
                default:
                    return "";
            }
        },

        fnGetPriorityStateByCode: function (sPriority) {
            switch (sPriority) {
                case "High":
                    return "Error";
                case "Medium":
                    return "Warning";
                case "Low":
                    return "Success";
                default:
                    return "None";
            }
        }



    };
});

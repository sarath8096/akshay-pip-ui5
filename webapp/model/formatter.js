sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {
        /**
         * Formats a date value to "MMM dd, yyyy"
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
         * Converts a date string to a JS Date, for DatePicker minDate/maxDate binding
         * @param {string} sDate
         * @returns {Date}
         */
        formatToJSDate(sDate) {
            return sDate ? new Date(sDate) : undefined;
        },

        /**
         * Maps a project status to an ObjectStatus state
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

        /**
         * Maps a task status to an ObjectStatus state
         * @param {string} sStatus
         * @returns {string}
         */
        formatTaskStatusState(sStatus) {
            switch (sStatus) {
                case "Done":
                    return "Success";
                case "In Progress":
                    return "Warning";
                case "Open":
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

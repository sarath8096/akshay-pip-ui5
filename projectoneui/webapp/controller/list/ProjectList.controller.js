sap.ui.define([
    "com/projectone/projectoneui/controller/BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, Sorter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.projectone.projectoneui.controller.list.ProjectList", {
        onInit() {
        },

        /**
         * Navigates to the project detail page
         * @param {Object} oEvent
         */
        onProjectPress(oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            const oContext = oEvent.getSource().getBindingContext("project");
            const oSelectedProject = oContext.getObject();

            oRouter.navTo("RouteProjectDetail", {
                projectId: oSelectedProject.ID
            });
        },

        /**
         * Opens the sort dialog for the project table
         */
        onSortButtonPress() {
            this.byId("sortDialog").open();
        },

        /**
         * Applies the field/direction chosen in the sort dialog to the project table
         * @param {Object} oEvent
         */
        onSortConfirm(oEvent) {
            const oSortItem = oEvent.getParameter("sortItem");

            if (!oSortItem) {
                return;
            }

            const bDescending = oEvent.getParameter("sortDescending");
            const oBinding = this.byId("projectTable").getBinding("items");

            oBinding.sort(new Sorter(oSortItem.getKey(), bDescending));
        },

        /**
         * Searches the project table across name, status, priority and owner (case-insensitive)
         * @param {Object} oEvent
         */
        onSearch(oEvent) {
            var sQuery = oEvent.getParameter("query") ?? oEvent.getParameter("newValue") ?? "";
            var oBinding = this.byId("projectTable").getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                sQuery = sQuery.trim();
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "name", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "status", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "priority", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "ownerName", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false })
                    ],
                    and: false
                }));
            }

            oBinding.filter(aFilters);
        }
    });
});
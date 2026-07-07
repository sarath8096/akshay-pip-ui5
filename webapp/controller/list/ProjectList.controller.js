sap.ui.define([
    "com/projectone/projectoneui/controller/BaseController",
    "sap/ui/model/Sorter"
], function (BaseController, Sorter) {
    "use strict";

    return BaseController.extend("com.projectone.projectoneui.controller.list.ProjectList", {
        onInit() {
        },

        /**
         * Function handles navigation to the project detail page
         * @param {Object} oEvent
         */
        onProjectPress(oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            const oContext = oEvent.getSource().getBindingContext("project");
            const oSelectedProject = oContext.getObject();

            oRouter.navTo("RouteProjectDetail", {
                projectId: oSelectedProject.ProjectID
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
        }
    });
});
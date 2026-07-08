sap.ui.define([
    "com/projectone/projectoneui/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("com.projectone.projectoneui.controller.detail.ProjectDetail", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteProjectDetail").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * Runs every time this page is opened
         * @param {Object} oEvent
         */
        fnInitialize(oEvent) {
            var sProjectId = oEvent.getParameter("arguments").projectId;
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            var oData = {
                "editMode": false,
                "editSnapshot": null,
                "sectionOptions": [
                    { "key": "infoSection", "text": oBundle.getText("detailInfoPanelTitle") },
                    { "key": "tasksSection", "text": oBundle.getText("detailTasksSectionTitle") }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "mProjectDetail");

            this.fnBindSelectedProject(sProjectId);
        },

        /**
         * Finds the clicked project and binds it to the view
         * @param {string} sProjectId
         */
        fnBindSelectedProject(sProjectId) {
            var that = this;
            var oProjectModel = this.getOwnerComponent().getModel("project");

            oProjectModel.dataLoaded().then(function () {
                var aProjects = oProjectModel.getProperty("/Projects");
                var iIndex = aProjects.findIndex(function (oProject) {
                    return oProject.ProjectID === sProjectId;
                });

                if (iIndex < 0) {
                     that.onNavBack();
                     return;
                 }

                that._sProjectPath = "/Projects/" + iIndex;

                that.getView().bindElement({
                    path: that._sProjectPath,
                    model: "project"
                });
            });
        },

        /**
         * Navigates back to the project list
         */
        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteProjectList");
        },

        /**
         * Switches to the section picked from the dropdown
         * @param {Object} oEvent
         */
        onSectionPick(oEvent) {
            var sSectionId = oEvent.getParameter("selectedItem").getKey();
            var oSection = this.byId(sSectionId);

            if (oSection) {
                this.byId("objectPage").setSelectedSection(oSection.getId());
            }
        },

        /**
         * Turns on edit mode and remembers the current values
         */
        onEditProject() {
            var oProjectModel = this.getView().getModel("project");
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var oEditSnapshot = JSON.parse(JSON.stringify(oProjectModel.getProperty(this._sProjectPath)));

            oProjectDetailModel.setProperty("/editSnapshot", oEditSnapshot);
            oProjectDetailModel.setProperty("/editMode", true);
        },

        /**
         * Turns off edit mode and keeps the changes
         */
        onSaveProject() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");

            oProjectDetailModel.setProperty("/editSnapshot", null);
            oProjectDetailModel.setProperty("/editMode", false);
        },

        /**
         * Turns off edit mode and undoes the changes
         */
        onCancelProject() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var oEditSnapshot = oProjectDetailModel.getProperty("/editSnapshot");

            if (oEditSnapshot) {
                this.getView().getModel("project").setProperty(this._sProjectPath, oEditSnapshot);
                oProjectDetailModel.setProperty("/editSnapshot", null);
            }

            oProjectDetailModel.setProperty("/editMode", false);
        }
    });
});

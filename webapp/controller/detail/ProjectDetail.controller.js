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
         * Initializes the model and loads project + owners for the matched route
         * @param {Object} oEvent
         */
        fnInitialize(oEvent) {
            var sProjectId = oEvent.getParameter("arguments").projectId;

            this._oi18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.busyDialog = new sap.m.BusyDialog();

            var oData = {
                "data": {},
                "selectedSectionKey": "infoSection",
                "sectionOptions": [
                    { "key": "infoSection", "text": this._oi18n.getText("detailInfoPanelTitle") },
                    { "key": "tasksSection", "text": this._oi18n.getText("detailTasksSectionTitle") },
                    { "key": "taskManagementSection", "text": this._oi18n.getText("detailTaskManagementSectionTitle") }
                ],
                "tab": {
                    "info": {
                        "isEdit": false,
                        "editableFields": { "shortDescription": "", "longDescription": "", "startDate": null, "endDate": null }
                    },
                    "taskManagement": {
                        "isEdit": false,
                        "list": [],
                        "owners": []
                    }
                }
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "mProjectDetail");

            this.fnFetchSelectedProject(sProjectId);
            this.fnFetchOwners();
        },

        /**
         * Loads the project by ID and stores it with its task list in the model
         * @param {string} sProjectId
         */
        fnFetchSelectedProject(sProjectId) {
            var that = this;
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");

            this.dataSource.getProject(sProjectId, function (oProjectData) {
                oProjectDetailModel.setProperty("/data", oProjectData);
                oProjectDetailModel.setProperty("/tab/taskManagement/list", that.fnBuildTaskList(oProjectData.tasks));
            }, function (oError) {
                that.fnMessageShow("E", that._oi18n.getText("errorLoadProject"));
            });
        },

        /**
         * Loads the owner list used for task assignment
         */
        fnFetchOwners() {
            var that = this;
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");

            this.dataSource.getOwners(function (aOwners) {
                var oUnassignedOwner = { "ID": "", "name": "" };
                var aOwnerOptions = [oUnassignedOwner].concat(aOwners);

                oProjectDetailModel.setProperty("/tab/taskManagement/owners", aOwnerOptions);
            }, function () {
                that.fnMessageShow("E", that._oi18n.getText("errorLoadOwners"));
            });
        },

        /**
         * Flattens each task's assignee into an assignee_ID field for two-way binding
         * @param {Array} aTasks
         * @returns {Array}
         */
        fnBuildTaskList(aTasks) {
            return (aTasks || []).map(function (oTask) {
                var oClone = JSON.parse(JSON.stringify(oTask));
                oClone.assignee_ID = oClone.assignee ? oClone.assignee.ID : null;
                return oClone;
            });
        },

        /**
         * Navigates back to the project list
         */
        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteProjectList");
        },

        /**
         * Switches the active section based on the dropdown selection
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
         * Syncs the section dropdown when navigation happens via the tab bar
         * @param {Object} oEvent
         */
        onSectionNavigate(oEvent) {
            var that = this;
            var oSection = oEvent.getParameter("section");
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var aSectionOptions = oProjectDetailModel.getProperty("/sectionOptions");

            var oMatch = aSectionOptions.find(function (oOption) {
                return that.byId(oOption.key) === oSection;
            });

            if (oMatch) {
                oProjectDetailModel.setProperty("/selectedSectionKey", oMatch.key);
            }
        },

        /**
         * Seeds the editable info fields and enters edit mode
         */
        onEditProject() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var oData = oProjectDetailModel.getProperty("/data");

            oProjectDetailModel.setProperty("/tab/info/editableFields", {
                "shortDescription": oData.shortDescription,
                "longDescription": oData.longDescription,
                "startDate": oData.startDate,
                "endDate": oData.endDate
            });

            oProjectDetailModel.setProperty("/tab/info/isEdit", true);
        },

        /**
         * Saves the info fields to the backend and exits edit mode
         */
        onSaveProject() {
            var that = this;
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var sProjectId = oProjectDetailModel.getProperty("/data/ID");
            var oPayload = oProjectDetailModel.getProperty("/tab/info/editableFields");

            if (oPayload.startDate && oPayload.endDate && oPayload.startDate > oPayload.endDate) {
                this.fnMessageShow("E", this._oi18n.getText("projectDateRangeInvalid"));
                return;
            }

            this.dataSource.updateProject(sProjectId, oPayload, function () {
                oProjectDetailModel.setProperty("/data/shortDescription", oPayload.shortDescription);
                oProjectDetailModel.setProperty("/data/longDescription", oPayload.longDescription);
                oProjectDetailModel.setProperty("/data/startDate", oPayload.startDate);
                oProjectDetailModel.setProperty("/data/endDate", oPayload.endDate);
                oProjectDetailModel.setProperty("/tab/info/isEdit", false);
                that.fnMessageShow("S", that._oi18n.getText("projectUpdateSuccess"));
            }, function () {
                that.fnMessageShow("E", that._oi18n.getText("projectUpdateError"));
            });
        },

        /**
         * Discards the description edits and exits edit mode
         */
        onCancelProject() {
            this.getView().getModel("mProjectDetail").setProperty("/tab/info/isEdit", false);
        },

        /**
         * Appends a new empty editable task row
         */
        onAddTask() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var aList = oProjectDetailModel.getProperty("/tab/taskManagement/list") || [];

            aList.push({ "title": "", "status": "Open", "startDate": null, "endDate": null, "assignee_ID": null, "isNew": true, "isEditable": true });

            oProjectDetailModel.setProperty("/tab/taskManagement/list", aList);
            oProjectDetailModel.setProperty("/tab/taskManagement/isEdit", true);
        },

        /**
         * Marks every task row as editable
         */
        onUpdateTask() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var aList = oProjectDetailModel.getProperty("/tab/taskManagement/list") || [];

            aList.forEach(function (oTask) {
                oTask.isEditable = true;
            });

            oProjectDetailModel.setProperty("/tab/taskManagement/list", aList);
            oProjectDetailModel.setProperty("/tab/taskManagement/isEdit", true);
        },

        /**
         * Deletes the selected task rows after confirmation, persisting immediately if not mid-edit
         */
        onDeleteTask() {
            var that = this;
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var oTable = this.byId("taskManagementTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                this.fnMessageShow("E", this._oi18n.getText("taskSelectionRequired"));
                return;
            }

            var fnRemoveItems = function () {
                var aList = oProjectDetailModel.getProperty("/tab/taskManagement/list");

                oTable.removeSelections();

                for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                    var sPath = aSelectedItems[i].getBindingContext("mProjectDetail").getPath();
                    var iIndex = Number(sPath.split("/").pop());

                    aList.splice(iIndex, 1);
                }

                oProjectDetailModel.setProperty("/tab/taskManagement/list", aList);

                if (!oProjectDetailModel.getProperty("/tab/taskManagement/isEdit")) {
                    that.fnPersistTaskList("taskDeleteSuccess", "taskDeleteError");
                }
            };

            this.fnMessageShow("C", this._oi18n.getText("taskDeleteConfirm"), "", function (sAction) {
                if (sAction === "YES") {
                    fnRemoveItems();
                }
            });
        },

        /**
         * Validates task titles and persists the full task list
         */
        onSaveTask() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var aList = oProjectDetailModel.getProperty("/tab/taskManagement/list") || [];
            var sProjectStartDate = oProjectDetailModel.getProperty("/data/startDate");
            var sProjectEndDate = oProjectDetailModel.getProperty("/data/endDate");

            var bInvalid = aList.some(function (oTask) {
                return !oTask.title;
            });

            if (bInvalid) {
                this.fnMessageShow("E", this._oi18n.getText("taskTitleRequired"));
                return;
            }

            var bOutOfRange = aList.some(function (oTask) {
                return (oTask.startDate && oTask.startDate < sProjectStartDate) ||
                    (oTask.endDate && oTask.endDate > sProjectEndDate);
            });

            if (bOutOfRange) {
                this.fnMessageShow("E", this._oi18n.getText("taskDateOutOfRange"));
                return;
            }

            this.fnPersistTaskList("taskSaveSuccess", "taskSaveError", function () {
                oProjectDetailModel.setProperty("/tab/taskManagement/isEdit", false);
            });
        },

        /**
         * Sends the full task list as one deep update; rows omitted from it get deleted server side
         * @param {string} sSuccessTextKey
         * @param {string} sErrorTextKey
         * @param {Function} [fnDone]
         */
        fnPersistTaskList(sSuccessTextKey, sErrorTextKey, fnDone) {
            var that = this;
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var sProjectId = oProjectDetailModel.getProperty("/data/ID");
            var aList = oProjectDetailModel.getProperty("/tab/taskManagement/list") || [];
            var aPayloadTasks = aList.map(this.fnMapTaskForPayload);

            this.busyDialog.open();

            this.dataSource.updateProjectTasks(sProjectId, aPayloadTasks, function () {
                that.fnMessageShow("S", that._oi18n.getText(sSuccessTextKey));
                that.fnFetchSelectedProject(sProjectId);
                that.busyDialog.close();
                if (fnDone) {
                    fnDone();
                }
            }, function () {
                that.fnMessageShow("E", that._oi18n.getText(sErrorTextKey));
                that.busyDialog.close();
            });
        },

        /**
         * Maps a task row to the backend payload shape; omitting ID on new rows triggers a create
         * @param {Object} oTask
         * @returns {Object}
         */
        fnMapTaskForPayload(oTask) {
            var oPayload = {
                "title": oTask.title,
                "status": oTask.status,
                "startDate": oTask.startDate,
                "endDate": oTask.endDate,
                "assignee_ID": oTask.assignee_ID
            };

            if (!oTask.isNew) {
                oPayload.ID = oTask.ID;
            }

            return oPayload;
        },

        /**
         * Resets the task list to the live project's tasks and exits edit mode
         */
        onCancelTask() {
            var oProjectDetailModel = this.getView().getModel("mProjectDetail");
            var aLiveTasks = oProjectDetailModel.getProperty("/data/tasks") || [];

            oProjectDetailModel.setProperty("/tab/taskManagement/list", this.fnBuildTaskList(aLiveTasks));
            oProjectDetailModel.setProperty("/tab/taskManagement/isEdit", false);
        }
    });
});

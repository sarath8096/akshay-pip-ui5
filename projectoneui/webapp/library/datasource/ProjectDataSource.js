sap.ui.define([
    "./CommonDataSource"
], function (CommonDataSource) {
    "use strict";

    return CommonDataSource.extend("com.projectone.projectoneui.library.datasource.ProjectDataSource", {

        /**
         * Fetches one page of projects from the backend
         * @param {int} iSkip
         * @param {int} iTop
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        getProjects: function (iSkip, iTop, fnSuccess, fnError) {
            var sUrl = this.getUrl("projectsList");
            var oParam = { "skip": iSkip, "top": iTop };

            this.getData(sUrl, oParam, function (oResponse) {
                fnSuccess(oResponse.value);
            }, fnError);
        },

        /**
         * Fetches a single project by key
         * @param {string} sProjectId
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        getProject: function (sProjectId, fnSuccess, fnError) {
            var sUrl = this.getUrl("projectById");
            var oParam = { "ID": sProjectId };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Updates a project with the given fields
         * @param {string} sProjectId
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        updateProject: function (sProjectId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl("projectPatchById");
            var oParam = { "ID": sProjectId };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Replaces a project's full task list in one deep update; rows omitted from aTasks get deleted server side
         * @param {string} sProjectId
         * @param {Array} aTasks
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        updateProjectTasks: function (sProjectId, aTasks, fnSuccess, fnError) {
            var sUrl = this.getUrl("projectPatchById");
            var oParam = { "ID": sProjectId };

            this.patchData(sUrl, oParam, { "tasks": aTasks }, fnSuccess, fnError);
        },

        /**
         * Fetches the list of owners (used to assign tasks)
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        getOwners: function (fnSuccess, fnError) {
            var sUrl = this.getUrl("ownersList");

            this.getData(sUrl, {}, function (oResponse) {
                fnSuccess(oResponse.value);
            }, fnError);
        }
    });
});

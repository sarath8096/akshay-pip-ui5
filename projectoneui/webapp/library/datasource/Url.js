sap.ui.define([], function () {
    "use strict";

    return {
        "projectsList": "/odata/v4/project/ProjectsList?$top={top}&$skip={skip}",
        "projectById": "/odata/v4/project/Projects('{ID}')?$expand=owner,tasks($expand=assignee)",
        "projectPatchById": "/odata/v4/project/Projects('{ID}')",
        "ownersList": "/odata/v4/project/Owners"
    };
});

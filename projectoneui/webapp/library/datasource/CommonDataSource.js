sap.ui.define([
    "sap/ui/base/Object",
    "./Url",
    "sap/base/Log"
], function (BaseObject, Url, Log) {
    "use strict";

    return BaseObject.extend("com.projectone.projectoneui.library.datasource.CommonDataSource", {
        
        "URL": Url,
        "_baseURI": "",

        /**
         * Creates a data source scoped to an optional base URI
         * @param {string} [sBaseURI]
         */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
        },

        /**
         * Looks up a URL template by key
         * @param {string} sUrlKey
         * @returns {string}
         */
        getUrl: function (sUrlKey) {
            return this._baseURI + this.URL[sUrlKey];
        },

        /**
         * Fills {placeholder} tokens in sUrl with values from oParam
         * @param {string} sUrl
         * @param {Object} oParam
         * @returns {string}
         */
        fnAddParamToURL: function (sUrl, oParam) {
            var sResolvedUrl = sUrl;
            var aParam = sUrl.match(/{[^{}]*}/g);

            if (Array.isArray(aParam)) {
                aParam.forEach(function (sToken) {
                    var sKey = sToken.substring(1, sToken.length - 1);
                    if (oParam && oParam[sKey] !== null && oParam[sKey] !== undefined) {
                        sResolvedUrl = sResolvedUrl.replace(new RegExp(sToken, "gi"), oParam[sKey]);
                    }
                });
            }

            return sResolvedUrl;
        },

        /**
         * Runs the fetch call; getData/patchData both delegate here
         * @param {string} sUrl
         * @param {string} sMethod
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        fnMakeRequest: function (sUrl, sMethod, oPayload, fnSuccess, fnError) {
            var oOptions = {
                "method": sMethod,
                "headers": {
                    "Accept": "application/json"
                }
            };

            if ((sMethod === "POST" || sMethod === "PATCH" || sMethod === "PUT") && oPayload) {
                oOptions.headers["Content-Type"] = "application/json";
                oOptions.body = JSON.stringify(oPayload);
            }

            fetch(sUrl, oOptions)
                .then(function (oResponse) {
                    if (!oResponse.ok) {
                        throw oResponse;
                    }
                    if (oResponse.status === 204) {
                        return null;
                    }
                    return oResponse.text().then(function (sText) {
                        return sText ? JSON.parse(sText) : null;
                    });
                })
                .then(fnSuccess)
                .catch(function (oError) {
                    Log.error(sMethod + " failed for " + sUrl, oError, "CommonDataSource");
                    if (fnError) {
                        fnError(oError);
                    }
                });
        },

        /**
         * Fetches data via GET
         * @param {string} sUrl
         * @param {Object} oParam
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        getData: function (sUrl, oParam, fnSuccess, fnError) {
            var sResolvedUrl = this.fnAddParamToURL(sUrl, oParam);
            this.fnMakeRequest(sResolvedUrl, "GET", {}, fnSuccess, fnError);
        },

        /**
         * Sends a partial update via PATCH
         * @param {string} sUrl
         * @param {Object} oParam
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} [fnError]
         */
        patchData: function (sUrl, oParam, oPayload, fnSuccess, fnError) {
            var sResolvedUrl = this.fnAddParamToURL(sUrl, oParam);
            this.fnMakeRequest(sResolvedUrl, "PATCH", oPayload, fnSuccess, fnError);
        }
    });
});

/*global QUnit*/

sap.ui.define([
	"com/projectone/projectoneui/controller/ProjectList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProjectList Controller");

	QUnit.test("I should test the ProjectList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

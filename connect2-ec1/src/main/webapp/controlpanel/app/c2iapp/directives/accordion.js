'use strict';

define(['app'], function (app) {

    
var btstAccordion = function () {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        template:
            "<div class='accordion' ng-transclude></div>",
        link: function (scope, element, attrs) {

            // give this element a unique id
            var id = element.attr("id");
            if (!id) {
                id = "btst-acc" + scope.$id;
                element.attr("id", id);
            }

            // set data-parent on accordion-toggle elements
            var arr = element.find(".accordion-toggle");
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("data-parent", "#" + id);
                $(arr[i]).attr("href", "#" + id + "collapse" + i);
            }
            arr = element.find(".accordion-body");
            $(arr[0]).addClass("in"); // expand first pane
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("id", id + "collapse" + i);
            }
        },
        controller: function () {}
    };
};

var btstPane = function () {
    return {
        require: "^btstAccordion",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            title: "@",
            category: "=",
            order: "="
        },
        template:
            "<div class='accordion-group' >" +
            "  <div class='accordion-heading'>" +
            "    <a class='accordion-toggle' target='_self' ng-click='' prevent-default data-toggle='collapse'> {{category.name}} - </a>" +
       
            "  </div>" +
            "<div class='accordion-body collapse'>" +
            "  <div class='accordion-inner' ng-transclude></div>" +
            "  </div>" +
            "</div>",
        link: function (scope, element, attrs) {
            scope.$watch("title", function () {
                // NOTE: this requires jQuery (jQLite won't do html)
                var hdr = element.find(".accordion-toggle");
                hdr.html(scope.title);
            });
        }
    };
};

var PreventDefault = function () {

    var linkFn = function (scope, element, attrs) {
        $(element).on("click", function (event){
            event.preventDefault();
        });
    };

    return {
        restrict: 'A',
        link: linkFn
    }
};

    app.directive('btstAccordion', btstAccordion);
	app.directive('btstPane', btstPane);

	app.directive('PreventDefault', PreventDefault);

});
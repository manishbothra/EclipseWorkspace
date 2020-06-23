'use strict';

define(['app'], function (app) {

    var injectParams = ['$compile', '$parse', '$filter'];

    var daterangepicker = function ($compile, $parse, $filter) {
        return {
		  template: '<div id="dateRangePicker"><i class="fa fa-calendar"></i><input class="form-control" readOnly="readOnly" ng-model="dateRange"/></div>',
		  replace: true,
		  restrict: 'E',
		  scope: true,
		  require: '?ngModel',
		  link: function(scope, el, attr, ngModel) {
			var DATE_FORMAT, cb, enDate, endDate, initRange, invoker, last30DaysStr, lastMonthEnd, lastMonthStart, monthEndStr, monthStartStr, options, range, read, sevenDaysAgoStr, splits, stDate, startDate, today, todayStr, yesterdayStr;
			DATE_FORMAT = "MM/DD/YYYY";
			today = moment();
			todayStr = moment().format(DATE_FORMAT);
			yesterdayStr = today.clone().subtract('days', 1).format(DATE_FORMAT);
			sevenDaysAgoStr = today.clone().subtract('days', 6).format(DATE_FORMAT);
			last30DaysStr = today.clone().subtract('days', 29).format(DATE_FORMAT);
			monthStartStr = moment().startOf('month').format(DATE_FORMAT);
			monthEndStr = moment().endOf('month').format(DATE_FORMAT);
			lastMonthStart = moment().subtract('month', 1).startOf('month').format(DATE_FORMAT);
			lastMonthEnd = moment().subtract('month', 1).endOf('month').format(DATE_FORMAT);
			range = {};
			range["Today"] = [todayStr, todayStr];
			range["Yesterday"] = [yesterdayStr, yesterdayStr];
			range["Last Week"] = [sevenDaysAgoStr, moment()];
			range["Last 30 days"] = [last30DaysStr, moment()];
			range["This Month"] = [monthStartStr, monthEndStr];
			range["Last Month"] = [lastMonthStart, lastMonthEnd];
			scope.dateRange = attr.initrange;
			initRange = scope.dateRange;
			if (initRange) {
			  splits = initRange.split("-");
			  stDate = moment(splits[0]);
			  startDate = moment(stDate).format(DATE_FORMAT);
			  endDate = todayStr;
			}
			options = {
			  format: DATE_FORMAT,
			  startDate: startDate,
			  endDate: endDate,
			  ranges: range,
			  opens: attr.horizontalPosition||'left',
			  drops: 'down',
			  parentEl: '#' + attr.attachto,
			  separator: ' - ',
			  showDropdowns: false,
			  showWeekNumbers: true,
			  timePicker: false,
			  timePickerIncrement: 1,
			  timePicker12Hour: true,
			  linkedCalendars: false
			};
			invoker = $parse(attr.callbackfn);
			read = function(start, end) {
			  var val;
			  val = start.format(DATE_FORMAT) + ' - ' + end.format(DATE_FORMAT);
			  scope.dateRange = val;
			  return invoker(scope, {
				frmDate: start,
				toDate: end
			  });
			};
			cb = function(start, end) {
			  return scope.$apply(read(start, end));
			};
			if (attr.attachto) {
			  return scope.$watch((function() {
				return $('#' + attr.attachto) && $('#' + attr.attachto).length > 0;
			  }), function(newVal, oldVal) {
				if (newVal) {
				  $(el).daterangepicker(options, cb);
				  return $('.daterangepicker').hide();
				}
			  });
			} else {
			  $(el).daterangepicker(options, cb);
			  return $('.daterangepicker').hide();
			}
		  }
		};
    };

    daterangepicker.$inject = injectParams;

    app.directive('daterangepicker', daterangepicker);

});
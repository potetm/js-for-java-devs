var DHTML = (document.getElementById || document.all || document.layers);
var ie = false;

if (document.all) {
	ie = true;
}

function isNumberString(string) {
	return cleanNumberString(string) != null;
}

function cleanNumberString(string) {
	if (string == null) {
		return null;
	}

	string = trim(string);

	if (string.length == 0) {
		return null;
	}

	// deal with parens as negative
	if (string.charAt(0) == "(" && string.charAt(string.length - 1) == ")") {
		string = "-" + string.substring(1, string.length - 1);
	}

	// make sure commas are ok and remove them
	if (string.indexOf(",") != -1) {
		if (string.replace(/\.[0-9]*$/, "").match(/-?[0-9]{1,3}(,[0-9]{3})+$/)) {
			string = string.replace(/,/g, "");
		} else {
			return null;
		}
	}

	if (string.match(/^-?(\d+\.|\d*\.?\d+)$/)) {
		// trim leading 0s or trailing .0s, replace leading . with 0., trim trailing 0s after decimal point, if nothing is left then the number was 0
		return string.replace(/^(-)?0+|\.0*$/g, "$1").replace(/^(-)?\./, "$10.").replace(/(\.[0-9]*[1-9])0*$/, "$1").replace(/^-?$/, "0");
	} else {
		return null;
	}
}

function changeTaskFilter(form, name, task) {
	if (name.lastIndexOf('.') != -1) {
		name = name.substr(0, name.lastIndexOf('.'));
	}

	form[name + ".task"].value = task;
	form.submit();
}

function checkAll(element, all) {
	if (element == null) {
		return;
	}

	var checked = all.checked;

	if (typeof(element[0]) == "object") {
		for (var i = 0; i < element.length; i++) {
			element[i].checked = checked;
		}
	} else {
		element.checked = checked;
	}
}

function selectAll(select) {
	var options = select.options;
	
	for (var i = 0; i < options.length; i++) {
		options[i].selected = true;
	}
}

function openPopupScrollable(page, name, width, height) {
	if (width == null) {
		width = 1000;
	}

	if (height == null) {
		height = 800;
	}

	var popup = window.open(page, name, "width=" + width + ",height=" + height + ",resizable=yes,scrollbars=yes");
	popup.focus();
}

function valueEngineSearch(ticker) {
	var popup = window.open("http://www.valuengine.com/rep/searchnc?srchfor=" + ticker, "purchase", "menubar=yes,status=yes,toolbar=yes,width=900,height=800,resizable=yes,scrollbars=yes,");
	popup.focus();
}

function checkForAndAlertInvalidTicker(ticker) {
	ticker = ticker.replace(/^ */, "");
	ticker = ticker.replace(/ *$/, "");
	ticker = ticker.toUpperCase();
	
	if (ticker.length == 0 || ticker.match(/[^a-zA-Z+.]/) || ticker.length > 6) {
		alert('Invalid Ticker.');
		return false;
	}
	
	return ticker;
}

function openPopup(page, name, width, height) {
	if (width == null) {
		width = 1000;
	}

	if (height == null) {
		height = 800;
	}

	var popup = window.open(page, name, "width=" + width + ",height=" + height + ",resizable=yes,scrollbars=yes");
	popup.focus();
}

function jumpMenu(form){
	var url = document.form.site.options[document.form.site.selectedIndex].value;
	window.location.href = url;
}

function getObj(id) {
	if (document.getElementById) {
		return document.getElementById(id);
	} else if (document.all) {
		return document.all[id];
	} else {
		return null;
	}
}

function addClass(elementId, className) {
	var element = getObj(elementId);
	if (element != null) {
		element.className += (element.className.length > 0 ? ' ' : '') + className;
	}
}

function idPrint(id, text) {
	if (! DHTML) {
		return;
	}

	var obj = getObj(id);

	obj.innerHTML = "";
	obj.innerHTML = text;
}

/*
 * help
 */
function help(action, page, anchor) {
	openPopup(action + "?helpPage=" + page + "#" + anchor, "helpWin");
}

function doHelp(page) {
	openPopup(page, "helpWin", 975);
}

/*
 * list manager for add, addAll, remove, removeAll
 */

/* assumes that both lists are already sorted because this will slow it down */
function selectMove(srcSelect, destSelect, all) {
	var options = (all) ? ' option' : ' option:selected'
	var src  = $('#' + srcSelect.id)
	var dest = $('#' + destSelect.id)

	var srcParent  = src.parent()
	var destParent = dest.parent()

	var srcOrphan  = src.detach()
	var destOrphan = dest.detach()	

	srcOrphan.children(options).remove().appendTo(destOrphan)
	
	srcParent.append(srcOrphan)
	destParent.append(destOrphan)
}

function listDelete(srcSelect, all) {
	if (all) {
		srcSelect = 0;
	} else {
		for (var i = 0; i < srcSelect.length; ) {
			if (srcSelect.options[i].selected) {
				srcSelect.options[i] = null;
			} else {
				i++;
			}
		}
	}
}

function optionSort(a, b) {
	if (a.text < b.text) {
		return -1;
	} else if (a.text > b.text) {
		return 1;
	} else {
		return 0;
	}
}

function isEnterKey(e) {
	var key = null;

	if (ie) {
		key = event.keyCode;
	} else {
		var key = e.which;
	}

	if(key == 13){
		return true;
	} else {
		return false;
	}
}

function saveList(form, cusipList) {
	form.cusipList.value = cusipList;
	openPopup("", "ncSaveList", 960, 250);

	form.submit();
}

function trim(string) {
	string = string.replace(/^\s+/, "");
	string = string.replace(/\s+$/, "");

	return string;
}

function isValidDecimal(strValue) {
	var match = strValue.match(/^-?(\d+\.?\d*|\.\d+)$/);  

	return match != null;
}


var monthNames = new Array(12);
monthNames[0]="January";
monthNames[1]="February";
monthNames[2]="March";
monthNames[3]="April";
monthNames[4]="May";
monthNames[5]="June";
monthNames[6]="July";
monthNames[7]="August";
monthNames[8]="September";
monthNames[9]="October";
monthNames[10]="November";
monthNames[11]="December";

function getReportTypeName(reportTypeInt)
{
	switch(reportTypeInt)
	{
	case 1:
		return CUSTOM.REPORT_TYPE.VALUE.MOST_DANGEROUS;
	case 2:
		return CUSTOM.REPORT_TYPE.VALUE.MOST_ATTRACTIVE;
	case 4:
		return CUSTOM.REPORT_TYPE.VALUE.PROOF_IS_IN_PERFORMANCE;
	case 8:
		return CUSTOM.REPORT_TYPE.VALUE.AGGREGATE;
	case 16:
		return CUSTOM.REPORT_TYPE.VALUE.INVESTMENT_INSIGHTS;
	case 256:
		return CUSTOM.REPORT_TYPE.VALUE.COMPANY;
	default:
		return CUSTOM.REPORT_TYPE.VALUE.UNKNOWN;
	}
}

/*
 * Google Analytics tracking enums
 * 
 * 
 */
var CATEGORY = {
		FOOTER : "Footer",
		FUND_SCREENER : "Fund Screener",
		HOME : "Home",
		MAXVAL : "MaxVal",
		REPORTS : "Reports",
		RATINGS : "Snapshot",
		STOCK_SCREENER : "Stock Screener",
		QUICKSEARCH : "QuickSearch"
};

var ACTION = {
	ADJUSTMENTS : "Adjustments",
	BALANCE_SHEET : "Balance sheet",
	BUY_NOW : "Buy Now",	
	CATEGORY_SEARCH : "Category Search",
	CHARTS : "Charts",
	CONTACT_US : "Contact Us",
	DCF_REVIEW : "DCF review",
	DECISION : "Decision",
	DOCUMENT_REVIEW : "Document Review",
	DOWNLOAD : "Download",
	ESO : "ESO",
	FORECAST : "Forecast",
	FREE_SAMPLE : "Free Sample",
	INCOME_STATEMENT : "Income statement",
	INDEX_SEARCH  : "Index Search",
	INVESTED_CAPITAL : "Invested Capital",
	NOPAT : "NOPAT",
	OVERRIDES : "Overrides",
	PROVIDER_SEARCH : "Provider Search",
	PV_LEASES : "PV Leases",
	RATINGS : "Snapshot",
	REQUEST_ACCESS : "Request Access",
	SECTOR_SEARCH : "Sector Search",
	TICKER_SEARCH : "Ticker Search",
	WACC_REVIEW : "WACC Review"
};

var CUSTOM = {
	REPORT_SECTION : {
		KEY : "Report Section",
		SLOT : 1,
		VALUE : {
			AGGREGATE : "ETF/Fund",
			COMPANY : "Company",
			FREE : "Free Archive",
			HOME : "Home",
			INVESTMENT_INSIGHTS : "Investment Perspectives",
			LATEST_REPORTS : "Latest Reports",
			MOST_ATTRACTIVE : "Most Attractive",
			MOST_DANGEROUS : "Most Dangerous",
			PROOF_IS_IN_PERFORMANCE : "Proof is in Performance"
		}
	},
	TICKER : {
		KEY : "Ticker",
		SLOT : 1
	},
	SEARCH_TYPE : {
		KEY : "Search Type",
		SLOT : 1,
		VALUE : {
			FREE    : "Free",
			PREMIUM : "Premium"
		}
	},
	COMPANY_ID : {
		KEY : "CompanyId",
		SLOT : 2
	},
	REPORT_NAME : {
		KEY : "Report Name",
		SLOT : 2
	},
	USERNAME : {
		KEY : "Username",
		SLOT : 3
	},
	VISITOR_TYPE : {
		KEY : "Visitor Type",
		SLOT : 4,
		VALUE : {
			GUEST : 'guest',
			SUBSCRIBER : 'subscriber'
		}
	},
	REPORT_TYPE : {
		KEY : "Report Type",
		SLOT : 5,
		VALUE : {
			COMPANY : "Free Snapshot",
			AGGREGATE : "ETF/Fund",
			INVESTMENT_INSIGHTS : "Investment Perspectives",
			MOST_ATTRACTIVE : "Most Attractive",
			MOST_DANGEROUS : "Most Dangerous",
			PROOF_IS_IN_PERFORMANCE : "Proof is in Performance",
			COMPANY_GENERATED : "Snapshot Download",
			RATINGS : "Snapshot Preview",
			UNKNOWN : "Unknown"
		}
	}
};

var MAX_CUSTOM_KEY_VAR_LEGNTH = 64;

/*
 * Object to use with CUSTOM object above. Example:
 * 
 * var cvars = new CustomVars();
 * cvars.addVar(CUSTOM.USERNAME, 'sbledsoe');
 * trackGaEvent('myPage', 'myAction', theUsername, cvars);
 * 
 */
function CustomVars() {
	var varArr = [];
	this.addVar = function(item, value) {
		varArr[item.SLOT] = {KEY : item.KEY, VALUE : value};
	}
	this.getVarArray = function() {
		return varArr;
	}
}

function addCustomVars(customVars) {
	
	_gaq = _gaq || [];
	
	if(!!customVars)
	{
		var varArr = customVars.getVarArray();
		for (slot in varArr)
		{
			try
			{
				var value = varArr[slot].VALUE;
				if(typeof value == "string")
				{
					if(varArr[slot].KEY == CUSTOM.TICKER) {
						value = value.toUpperCase();
					}
					value = cleanEscapedString(value);
				}
				var key = varArr[slot].KEY;
				if(typeof key == "string")
				{
					key = cleanEscapedString(key);
				}
				
				var keyVarArray = shortenCustomKeyAndVariable(key, value);
				
				var shortKey = keyVarArray[0];
				var shortValue = keyVarArray[1];
				
				_gaq.push(['_setCustomVar', slot, shortKey, shortValue, 3])
			}
			catch(ex) {
			}
		}
	}
}

function shortenCustomKeyAndVariable(key, variable) {
	
	if(typeof key != 'string') {
		try { key = key.toString() }
		catch(ex) { key = '' }
	}
	if(typeof variable != 'string') {
		try{ variable = variable.toString() }
		catch(ex) {variable = '' }
	}
	
	if(key.length > MAX_CUSTOM_KEY_VAR_LEGNTH) {
		throw "Key too long - greater than MAX_CUSTOM_KEY_VAR_LEGNTH = " + MAX_CUSTOM_KEY_VAR_LEGNTH;
	}
	
	if(key.length + variable.length > MAX_CUSTOM_KEY_VAR_LEGNTH) {
		var trimLength = key.length + variable.length - MAX_CUSTOM_KEY_VAR_LEGNTH;
		variable = variable.substr(0, variable.length - trimLength);
	}
	
	return new Array(key, variable);
}

/*
 * Called from category-specific tracking functions, not from pages. Handles
 * page-level custom vars fine, but not really visitor-level
 */
function trackGaEvent(category, action, username, customVars, opt_int)
{
	_gaq = _gaq || [];
	customVars = customVars || new CustomVars();
	try {
		/* Always plug in 'guest' instead of blank user */
		username = dubGuestUser(username);
		customVars.addVar(CUSTOM.USERNAME, username);
		
		visitorType = getVisitorTypeFromUsername(username);
		customVars.addVar(CUSTOM.VISITOR_TYPE, visitorType);
		
		addCustomVars(customVars);
		
		category = cleanEscapedString(category);
		action = cleanEscapedString(action);
		
		_gaq.push(['_trackEvent', category, action, '', opt_int]);
		
	}
	catch(ex) {
	}
}


function getVisitorTypeFromUsername(username) {
	if(!username || username == CUSTOM.VISITOR_TYPE.VALUE.GUEST) {
		return CUSTOM.VISITOR_TYPE.VALUE.GUEST;
	}
	else {
		return CUSTOM.VISITOR_TYPE.VALUE.SUBSCRIBER;
	}

}

function dubGuestUser(username) {
	if(!username) {
		return CUSTOM.VISITOR_TYPE.VALUE.GUEST;
	}
	return username;
}

NON_WORD_MATCHING_RE = /[^\w.]+/g;

function cleanEscapedString(str)
{
	if(!str)
	{
		return '';
	}
	
	if(typeof str != "string") {
		return str;
	}
	
	newStr = str.replace(NON_WORD_MATCHING_RE, '_');

	if(newStr.lastIndexOf('_') == newStr.length - 1) {
		newStr = newStr.substr(0, newStr.length - 1);
	}
	
	return newStr;
}

function trackMaxValAppEvent(action, username, ticker, companyId)
{
	try {
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.COMPANY_ID, companyId);
		cvars.addVar(CUSTOM.TICKER, ticker);
		trackGaEvent(CATEGORY.MAXVAL, action, username, cvars);
	}
	catch(ex) {
	}
}

function trackReportClick(page, action, reportType, username, reportName, year, month, day, section)
{
	
	try {

		/*
		 * If reportType is an int, get the name for it using getReportTypeName.
		 * Otherwise, use reportType as the name.
		 */
		var reportTypeInt;
		var reportTypeName;
		try
		{
			reportTypeInt = parseInt(reportType, 10);
			if(isNaN(reportTypeInt)) // Failed to parse, use report type as
										// name
			{
				reportTypeName = reportType;
				reportTypeInt = -1;
			}
			else // Joyful parsing success, get the name from the type
			{
				reportTypeName = getReportTypeName(reportTypeInt);
			}
		}
		catch(ex) { // Something went wrong, use report type as name
			reportTypeName = reportType;
			reportTypeInt = -1;
		}
		
		var yearName = parseInt(year, 10);
		if(isNaN(yearName))
		{
			yearName = year;
		}
		
		var monthName = parseInt(month, 10);
		if(isNaN(month))
		{
			monthName = month;
		}
		else if(typeof monthName == 'number' && monthNames[monthName - 1]) {
			monthName = monthNames[monthName - 1];
		}
		var cvars = new CustomVars();
		
		reportName = addDateToReportName(reportName, year, month, day);
		
		cvars.addVar(CUSTOM.REPORT_SECTION, section);
		cvars.addVar(CUSTOM.REPORT_NAME, reportName);
		cvars.addVar(CUSTOM.REPORT_TYPE, reportTypeName)
		
		trackGaEvent(
			page,
			action,
			username,
			cvars,
			reportTypeInt
		);
		
	}
	catch(ex) {
	}
}

function addDateToReportName(reportName, year, month, day) {
	if(!reportName) {
		reportName = '';
	}
	
	return reportName + "_" + year + "_" + month + "_" + day;
}

function trackTickerSearch(page, tickerName, username)
{
	try
	{
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.TICKER, tickerName);

		trackGaEvent(page, ACTION.TICKER_SEARCH, username, cvars);
	}
	catch(ex) {
	}		
}


function  trackFundScreenerTickerSearch(username) {
	trackFundScreenerSearch(ACTION.TICKER_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function  trackFundScreenerCategorySearch(username) {
	trackFundScreenerSearch(ACTION.CATEGORY_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function  trackFundScreenerProviderSearch(username) {
	trackFundScreenerSearch(ACTION.PROVIDER_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function trackFundScreenerSearch(action, username, searchType) {
	try {
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.SEARCH_TYPE, searchType);
		trackGaEvent(CATEGORY.FUND_SCREENER, action, username, cvars);
	} catch (ex) {
		// nothing we can do here
	}
}

function trackFundScreenerSampleClick(username, reportName) {
	try{
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.REPORT_NAME, reportName);
		trackGaEvent(CATEGORY.FUND_SCREENER, ACTION.DOWNLOAD, username, cvars);
	} catch(ex) {
	}
}

function trackFundScreenerReportClick(action, username, ticker, type) {
	try
	{
		var date = new Date();
		var year = date.getFullYear();		
		var month = date.getMonth() + 1;
		var day = date.getDate();
		
		if(type == "MF") {
			type = "MutualFund";
		} else {
			type = "ETF";
		}
		
		var reportName = ticker + "-Predictive-" + type + "-Rating-" + year + "_" + month + "_" + day
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.TICKER, ticker);
		cvars.addVar(CUSTOM.REPORT_NAME, reportName);
		trackGaEvent(CATEGORY.FUND_SCREENER, action, username, cvars);
	}
	catch(ex) {
	}	
}

function trackStockScreenerIndexSearch(username) {
	trackStockScreenerSearch(ACTION.INDEX_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function trackStockScreenerSectorSearch(username) {
	trackStockScreenerSearch(ACTION.SECTOR_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function trackStockScreenerTickerSearch(username) {
	trackStockScreenerSearch(ACTION.TICKER_SEARCH, username, CUSTOM.SEARCH_TYPE.VALUE.FREE);
}

function trackStockScreenerSearch(action, username, searchType) {
	try {
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.SEARCH_TYPE, searchType);
		trackGaEvent(CATEGORY.STOCK_SCREENER, action, username, cvars);
	} catch (ex) {
		// nothing we can do here
	}
}

function trackStockScreenerReportClick(action, username, ticker) {
  try {
    var date  = new Date();
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();

    var reportName = ticker + "-Company-Valuation-Report-" + year + "_" + month + "_" + day
    var cvars = new CustomVars();
    cvars.addVar(CUSTOM.TICKER, ticker);
    cvars.addVar(CUSTOM.REPORT_NAME, reportName);
    trackGaEvent(CATEGORY.STOCK_SCREENER, action, username, cvars);
  } catch (e) {
    // do nothing
  }
}

function trackCompanyReportDownloadFromRatingsPage(reportType, username, ticker, reportFileName) {
	trackCompanyReportDownload(CATEGORY.RATINGS, ACTION.RATINGS, reportType, username, ticker, reportFileName);
}

function trackCompanyReportDownload(category, action, reportType, username, ticker, reportFileName) {
	try
	{
		var cvars = new CustomVars();
		cvars.addVar(CUSTOM.REPORT_TYPE, reportType);
		cvars.addVar(CUSTOM.TICKER, ticker);
		if(!!reportFileName && reportFileName.substr(-4,4) == ".pdf") {
			reportFileName = reportFileName.substr(0, reportFileName.length - 4);
		}
		cvars.addVar(CUSTOM.REPORT_NAME, reportFileName);

		trackGaEvent(category, action, username, cvars);
	}
	catch(ex) {
	}
}


function trackContactUs(linkLocation, username) {
	try
	{
		trackGaEvent(linkLocation, ACTION.CONTACT_US, username);
	}
	catch(ex) {
	}
}

function trackLinkClick(anchorElt, category, action, username, customVars) {
	try {
		trackGaEvent(category, action, username, customVars);
		_gaq.push(function() {
			setTimeout('document.location = "' + anchorElt.getAttribute('href') + '"', 100);
		});
		return false;
	}
	catch(ex) {}
	return true;
}


var _gaq = _gaq || [];

/* Init google tracking */
(function(){
	_gaq.push(['_setAccount', 'UA-16480557-5']);

	var domain = '.newconstructs.com';
	if( /.llc$/.test(document.domain)) {
		domain = '.newconstructs.llc';
	}

	_gaq.push(['_setDomainName', domain]);
})();

/* Track page view with username */
function trackPageview(){

	cvars = new CustomVars();

	var _username = username || '';

	_username = dubGuestUser(_username);
	cvars.addVar(CUSTOM.USERNAME, _username);

	visitorType = getVisitorTypeFromUsername(_username);
	cvars.addVar(CUSTOM.VISITOR_TYPE, visitorType);

	addCustomVars(cvars);

	_gaq.push(['_trackPageview']);
}

trackPageview();

/* Attach script tag to page for google tracking */
(function() {
	try
	{
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	} catch(ex) {
	}
})();


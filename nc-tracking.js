var _gaq = [['_setAccount', 'UA-16480557-5']]; // prepped at the bottom

var tracker = function() {
  var
    actionName = {
      // shared
      download:      'Download',
      buyNow:        'Buy_Now',
      tickerSearch:  'Ticker_Search',
      requestAccess: 'Request_Access',
      contactUs:     'Contact_Us',

      // maxVal
      adjustments:     'Adjustments',
      balanceSheet:    'Balance_Sheet',
      charts:          'Charts',
      dcfReview:       'DCF_Review',
      decision:        'Decision',
      documentReview:  'Document_Review',
      eso:             'ESO',
      forecast:        'Forecast',
      investedCapital: 'Invested_Capital',
      metrics:         'Metrics',
      nopat:           'NOPAT',
      overrides:       'Overrides',
      pvLeases:        'PV_Leases',
      waccReview:      'WACC_Review',
      
      // home
      freeSample: 'Free_Sample',

      // ratings
      ratings: 'Snapshot',

      // header
      blog: 'Blog',

      // fundScreener
      providerSearch: 'Provider_Search',
      categorySearch: 'Category_Search',

      // stockScreener
      indexSearch:  'Index_Search',
      sectorSearch: 'Sector_Search'
    },
    customVarName = {
      username:      'Username',
      visitorType:   'Visitor_Type',
      ticker:        'Ticker',
      companyId:     'CompanyId',
      reportSection: 'Report_Section',
      searchType:    'Search_Type',
      reportName:    'Report_Name',
      reportType:    'Report_Type'
    },
    customVarValueEnum = {
      reportSection: {
        'investment-insights':     'Investment_Perspectives',
        'most-attractive':         'Most_Attractive',
        'latest':                  'Latest_Reports',
        'free':                    'Free_Archive',
        'most-dangerous':          'Most_Dangerous',
        'proof-in-performance':    'Proof_is_in_Performance',
        'company':                 'Company',
        'aggregate':               'ETF/Fund',
        'home':                    'Home'
      },
      searchType: {
        'free':    'Free',
        'premium': 'Premium'
      },
      reportType: {
        'investment-insights':     'Investment_Perspectives',
        'most-attractive':         'Most_Attractive',
        'most-dangerous':          'Most_Dangerous',
        'proof-in-performance':    'Proof_is_in_Performance',
        'company':                 'Company',
        'aggregate':               'ETF/Fund',
        'unknown':                 'Unknown',
        'rating-download':         'Snapshot_Download',
        'rating-preview':          'Snapshot_Preview'
      }
    },
    createEventData = function(input, spec) {
      var
        i,
        fieldName,
        that = {
          category: spec.category,
          action: spec.action,
          customVars: {}
        },
        getFieldValue = function(fieldName, input) {
          var fieldValue = input[fieldName];

          if (customVarValueEnum.hasOwnProperty(fieldName)) {
            fieldValue = customVarValueEnum[fieldName][fieldValue];

            if (fieldValue === undefined) {
              throw {
                name: 'IllegalArgument',
                message: 'The requested enum value type does not exist: requestedType=' + fieldName + ' requestedValue=' + input[fieldName]
              };
            }
          }

          return fieldValue;
        },
        validateInputPropertyCount = function(input, spec) {
          var
            getOwnPropertyCount = function(object) {
              var
                property,
                count = 0
              ;

              for (property in object) {
                if (object.hasOwnProperty(property)) {
                  count++;
                }
              }

              return count;
            }
          ;

          if (getOwnPropertyCount(input) !== getOwnPropertyCount(spec.customVars)) {
            throw {
              name: 'IllegalArgument',
              message: 'Incorrect parameters on tracking input. expected=' + getOwnPropertyCount(spec.customVars) + ' found=' + getOwnPropertyCount(input)
            };
          }
        }
      ;

      if (!(spec.category && spec.action && spec.customVars)) {
        throw {
          name: 'IllegalArgument',
          message: 'spec.category, spec.action, and spec.customVars must all be provided'
        };
      }

      validateInputPropertyCount(input, spec);

      for (i = 1; i <= 5; i++) {
        if (!spec.customVars.hasOwnProperty(i)) {
          continue;
        }

        fieldName = spec.customVars[i];

        if (!input.hasOwnProperty(fieldName)) {
          throw {
            name: 'IllegalArgument',
            message: 'Custom field not provided: fieldName=' + fieldName
          };
        }

        that.customVars[i] = { name: customVarName[fieldName], value: getFieldValue(fieldName, input) };
      }

      return that;
    },
    shortenCustomVar = function(array) {
      var
        MAX_NAME_AND_VALUE_LENGTH = 128,
        gaqMethod = array[0],
        name,
        value
      ;
      
      if (gaqMethod !== '_setCustomVar') {
        return array;
      }

      name  = array[2];
      value = array[3].toString();

      if (name.length + value.length > MAX_NAME_AND_VALUE_LENGTH) {
        array = array.slice(0); // copy the array

        array[3] = value.slice(0, MAX_NAME_AND_VALUE_LENGTH - name.length);
      }

      return array;
    },
    gaqPush = function(array) {
      // shorten value to accommodate 128 byte limit on custom vars (length of name and value)
      // per https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables#varTypes
      array = $.map(shortenCustomVar(array), function(element) {
        return (typeof element === 'string') ? element.replace(/[^\w.]+/g, '_') : element;
      });

      _gaq.push(array); 
    },
    pushPrinciple = function() {
      var principle = _principle; // from the global _principle
      
      gaqPush(['_setCustomVar', 3, customVarName.username, principle.username, 3]);
      gaqPush(['_setCustomVar', 4, customVarName.visitorType, principle.visitorType, 3]);
    },
    track = function(input, spec) {
      var
        i,
        customVar,
        label = '',
        custom_var_opt_scope = 3,
        eventData = createEventData(input, spec)
      ;

      for (i = 1; i <= 5; i++) {
        if (!eventData.customVars.hasOwnProperty(i)) {
          continue;
        }

        customVar = eventData.customVars[i];

        gaqPush(['_setCustomVar', i, customVar.name, customVar.value, custom_var_opt_scope]);
      }

      pushPrinciple();
      gaqPush(['_trackEvent', eventData.category, eventData.action, label]);
    },
    tracker = function(spec, validateFunction) {
      return function(input) {
        if (validateFunction) {
          validateFunction(input);
        }

        return {
          track: function() {
            track(input, spec);
          }
        };
      };
    },
    tickerSearchTracker = function(category) {
      return tracker({
        category: category,
        action: actionName.tickerSearch,
        customVars: {
          1: 'ticker'
        }
      });
    },
    contactUsTracker = function(category) {
      return tracker({
        category: category,
        action: actionName.contactUs,
        customVars: {}
      });
    },
    generateReportName = function(ticker, type) {
      var types = {
        company:  'Company_Valuation_Report',
        etf: 'Predictive_ETF_Rating',
        mf:  'Predictive_MutualFund_Rating'
      };

      if (!types[type]) {
        throw {
          name: 'IllegalArgument',
          message: 'Unknown type: type=' + type
        };
      }

      //TODO: When this (https://github.com/timrwood/moment/issues/482) comes out, we'll want to deal with timezones
      return ticker + '_' + types[type] + '_' + moment().format('YYYY_MM_DD');
    },
    deleteTypeAddReportName = function(input) {
      var that;

      if (!(input.ticker && input.type )) {
        throw {
          name: 'IllegalArgument',
          message: 'input.ticker and input.type required'
        };
      }

      if (input.hasOwnProperty('reportName')) {
        throw {
          name: 'IllegalArgument',
          message: 'reportName is created for you.  It cannot be provided.'
        };
      }

      that = $.extend({}, input, {
        reportName: generateReportName(input.ticker, input.type)
      });

      delete that.type;

      return that;
    }
  ;
  
  return {
    trackPageView: function() {
      pushPrinciple();
      gaqPush(['_trackPageview']);
    },

    maxVal: function() {
      var
        category = 'MaxVal',
        maxValTracker = function(action) {
          var spec = {
            category: category,
            action: action,
            customVars: {
              1: 'ticker',
              2: 'companyId'
            }
          };

          return tracker(spec);
        }
      ;

      return {
        adjustments:     maxValTracker(actionName.adjustments),
        balanceSheet:    maxValTracker(actionName.balanceSheet),
        charts:          maxValTracker(actionName.charts),
        dcf:             maxValTracker(actionName.dcfReview),
        decision:        maxValTracker(actionName.decision),
        documentReview:  maxValTracker(actionName.documentReview),
        eso:             maxValTracker(actionName.eso),
        forecast:        maxValTracker(actionName.forecast),
        investedCapital: maxValTracker(actionName.investedCapital),
        metrics:         maxValTracker(actionName.metrics),
        nopat:           maxValTracker(actionName.nopat),
        overrides:       maxValTracker(actionName.overrides),
        pvLeases:        maxValTracker(actionName.pvLeases),
        wacc:            maxValTracker(actionName.waccReview)
      };
    },

    reports: function() {
      var
        category = 'Reports',
        validateSectionAndType = function(input) {
          if (!input.reportSection.match(/^(latest|free)$/) && input.reportType !== input.reportSection)  {
            throw {
              name: 'IllegalArgument',
              message: 'The reportSection does not match the reportType: reportSection=' + input.reportSection + ' reportType=' + input.reportType
            };
          }
        },
        reportTracker = function(action) {
          var spec = {
            category: category,
            action: action,
            customVars: {
              1: 'reportSection',
              2: 'reportName',
              5: 'reportType'
            }
          };

          return tracker(spec, validateSectionAndType);
        }
      ;

      return {
        download:      reportTracker(actionName.download),
        buyNow:        reportTracker(actionName.buyNow),
        requestAccess: reportTracker(actionName.requestAccess),
        tickerSearch:  tickerSearchTracker(category)
      };
    },

    home: function() {
      var
        category = 'Home',
        validateReportType = function(input) {
          if (!input.reportType.match(/^most-(attractive|dangerous)$/)) {
            throw {
              name: 'IllegalArgument',
              message: 'reportType must be either "most-attractive" or "most-dangerous"'
            };
          }
        },
        reportTracker = function(action) {
          var spec = {
            category: category,
            action: action,
            customVars: {
              1: 'reportSection',
              2: 'reportName',
              5: 'reportType'
            }
          };

          return tracker(spec, validateReportType);
        }
      ;

      return {
        freeSample:    reportTracker(actionName.freeSample),
        download:      reportTracker(actionName.download),
        buyNow:        reportTracker(actionName.buyNow),
        requestAccess: reportTracker(actionName.requestAccess),
        tickerSearch:  tickerSearchTracker(category),
        contactUs:     contactUsTracker(category)
      };
    },

    ratings: function() {
      var
        category = 'Snapshot',
        spec = {
          category: category,
          action: actionName.ratings,
          customVars: {
            1: 'ticker',
            2: 'reportName', // created for you
            5: 'reportType'
            // NOTE: You also need to provide type (etf/mf/company) so we can generate the reportName (not used yet)
          }
        },
        validateReportType = function(input) {
          if (!input.reportType.match(/^rating-(download|preview)$/)) {
            throw {
              name: 'IllegalArgument',
              message: 'reportType must be either "rating-download" or "rating-preview"'
            };
          }
        }
      ;

      return {
        ratings: function(input) {
          if (input.hasOwnProperty('reportName')) {
            throw {
              name: 'IllegalArgument',
              message: 'reportName is created for you.  It cannot be provided.'
            };
          }

          input = $.extend({}, input, {
            reportName: input.ticker
          });

					delete input.type;

          return tracker(spec, validateReportType)(input);
        }
      };
    },

    header: function() {
      var
        category = 'Header',
        spec = {
          category: category,
          action: actionName.blog,
          customVars: {}
        }
      ;

      return {
        blog: tracker(spec)
      };
    },

    footer: function() {
      var category = 'Footer';

      return {
        contactUs: contactUsTracker(category)
      };
    },

    quickSearch: function() {
      var category = 'Quicksearch';

      return {
        tickerSearch: tickerSearchTracker(category)
      };
    },

    fundScreener: function() {
      var
        category = 'Fund_Screener',
        fundScreenerSpec = {
          category: category
        },
        searchTracker = function(action) {
          var spec = $.extend({}, fundScreenerSpec, {
            action: action,
            customVars: {
              1: 'searchType'
            }
          });

          return tracker(spec);
        },
        typeValidator = function(input) {
          if (!input.type.match(/^(etf|mf)$/)) {
            throw {
              name: 'IllegalArgument',
              message: 'type must be either "etf" or "mf".'
            };
          }
        },
        reportTracker = function(action) {
          var spec = $.extend({}, fundScreenerSpec, {
            action: action,
            customVars: {
              1: 'ticker',
              2: 'reportName' // created for you
              //NOTE: type is also required
            }
          });

          return function(input) {
            typeValidator(input);

            input = deleteTypeAddReportName(input);

            return tracker(spec)(input);
          };
        }
      ;

      return {
        tickerSearch:   searchTracker(actionName.tickerSearch),
        providerSearch: searchTracker(actionName.providerSearch),
        categorySearch: searchTracker(actionName.categorySearch),
        download:       reportTracker(actionName.download),
        buyNow:         reportTracker(actionName.buyNow)
      };
    },

    stockScreener: function() {
      var
        category = 'Stock_Screener',
        stockScreenerSpec = {
          category: category
        },
        searchTracker = function(action) {
          var spec = $.extend({}, stockScreenerSpec, {
            action: action,
            customVars: {
              1: 'searchType'
            }
          });

          return tracker(spec);
        },
        reportTracker = function(action) {
          var spec = $.extend({}, stockScreenerSpec, {
            action: action,
            customVars: {
              1: 'ticker',
              2: 'reportName' // created for you
            }
          });

          return function(input) {
            if (input.type) {
              throw {
                name: 'IllegalArguement',
                message: 'input.type is added for you.'
              };
            }

            input = deleteTypeAddReportName($.extend({}, input, { type: 'company' }));

            return tracker(spec)(input);
          };
        }
      ;

      return {
        indexSearch:  searchTracker(actionName.indexSearch),
        sectorSearch: searchTracker(actionName.sectorSearch),
        tickerSearch: searchTracker(actionName.tickerSearch),
        download:     reportTracker(actionName.download),
        buyNow:       reportTracker(actionName.buyNow)
      };
    }
  };
}();

(function() { // prep _gaq
  var domain = document.domain.match(/^www.newconstructs.(llc|com)$/) ? document.domain.replace(/^www(.newconstructs.(llc|com))$/, '$1') : 'none';

  _gaq.push(['_setDomainName', domain]);
  tracker.trackPageView();
})();

(function() { // attach script tag to page
  var
    ga = document.createElement('script'),
    s  = document.getElementsByTagName('script')[0]
  ;

  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';

  s.parentNode.insertBefore(ga, s);
})();

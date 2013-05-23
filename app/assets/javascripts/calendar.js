/**
 * Origin: jquery.calendar.js v1.0.0 (http://www.codrops.com)
 */

;( function( $, window, undefined ) {
	
	'use strict';

	$.calendar = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );
		
	};

	// the options
	$.calendar.defaults = {
		/*
		you can also pass:
		month : initialize calendar with this month (1-12). Default is today.
		year : initialize calendar with this year. Default is today.
		caldata : initial data/content for the calendar.
		caldata format:
		{
			'MM-DD-YYYY' : 'HTML Content',
			'MM-DD-YYYY' : 'HTML Content',
			'MM-DD-YYYY' : 'HTML Content'
			...
		}
		*/
		weeks : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
		weekabbrs : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		months : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
		monthabbrs : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		// choose between values in options.weeks or options.weekabbrs
		displayWeekAbbr : true,
		// choose between values in options.months or options.monthabbrs
		displayMonthAbbr : false,
		// left most day in the calendar
		// 0 - Sunday, 1 - Monday, ... , 6 - Saturday
		startIn : 1,
		onDayClick : function( $el, $content, dateProperties ) { return false; }
	};

	$.calendar.prototype = {

		_init : function( options ) {
			
			// options
			this.options = $.extend( true, {}, $.calendar.defaults, options );

			this.today = new Date();
			this.month = ( isNaN( this.options.month ) || this.options.month == null) ? this.today.getMonth() : this.options.month - 1;
			this.year = ( isNaN( this.options.year ) || this.options.year == null) ? this.today.getFullYear() : this.options.year;
			this.caldata = this.options.caldata || {};
			this._generateTemplate();
			this._initEvents();

		},
		_initEvents : function() {

			var self = this;


			this.$el.find('div.week > div').click(function(){

				var $cell = $( this ),
					idx = $cell.index(),
					$content = $cell.children( 'div' ),
					dateProp = {
						day : $cell.attr('d'),
						month : $cell.attr('m'),
						year : $cell.attr('y')
					};

				if( dateProp.day ) {
					self.options.onDayClick( $cell, $content, dateProp );
				}

			});

		},
		// Calendar logic based on http://jszen.blogspot.pt/2007/03/how-to-build-simple-calendar-with.html
		_generateTemplate : function( callback ) {

			var head = this._getHead(),
				body = this._getBody();

            this.$cal = this.$el.empty().append( head, body );

			if( callback ) { callback.call(); }

		},
		_getHead : function() {

            var legend = $('<div>').addClass('legend');

			for ( var i = 0; i <= 6; i++ ) {

				var pos = i + this.options.startIn, j = pos > 6 ? pos - 6 - 1 : pos;

                $('<div>')
                    .text( this.options.displayWeekAbbr ? this.options.weekabbrs[ j ] : this.options.weeks[ j ] )
                    .appendTo(legend);
			}

			return legend;

		},
		_getBody : function() {

            var getFirstDayOfWeek = function(a,b) { return a>b?b+(7-a):b-a };

            var month = $('<div>'),                                     // container for weeks
                week  = $('<div>').addClass('week');                        // container for days

            var wday  = (new Date( this.year, this.month, 1)).getDay(),     // first day of week of month
                count = (new Date( this.year, this.month+1, 0)).getDate(),  // last day of month
                last  = (new Date( this.year, this.month, 0)).getDate();    // last day of prev month

            var date = this.today.getDate()
            var curr = this.month === this.today.getMonth() &&
                        this.year === this.today.getFullYear();

            var offset = getFirstDayOfWeek( this.options.startIn, wday),    // offset of weekday
                day = 0,                                                    // number of day
                pos = 0;                                                    // number of weekday


            var createDayItem = function(d,m,y) {
                return $('<div>').append( $('<label>').text(d)).attr({ id: y + '-' + m + '-' + d });
            }

            var pushToWeek = function (o) {
                if (pos === 0) { week = $('<div>').addClass('week') }
                week.append(o);
                if ( ++pos >= 6 ) { pos = 0; month.append(week) }
            }

            while ( offset > 0 ) {
                pushToWeek(
                    createDayItem(1+last-(offset--), this.month, this.year)
                        .addClass('prev')
                );
            }

            while ( ++day <= count ) {

                var item = createDayItem(day, this.month+1, this.year);

                if ( curr && day === date ) item.addClass('today');

                pushToWeek( item );
            }

            while( pos > 0 && pos < 5 ) {
                pushToWeek(
                    createDayItem(++offset, this.month+2, this.year)
                        .addClass('next')
                );
            }

			return month.append(week);

		},
		// based on http://stackoverflow.com/a/8390325/989439
		_isValidDate : function( date ) {

			date = date.replace(/-/gi,'');
			var month = parseInt( date.substring( 0, 2 ), 10 ),
				day = parseInt( date.substring( 2, 4 ), 10 ),
				year = parseInt( date.substring( 4, 8 ), 10 );

			if( ( month < 1 ) || ( month > 12 ) ) {
				return false;
			}
			else if( ( day < 1 ) || ( day > 31 ) )  {
				return false;
			}
			else if( ( ( month == 4 ) || ( month == 6 ) || ( month == 9 ) || ( month == 11 ) ) && ( day > 30 ) )  {
				return false;
			}
			else if( ( month == 2 ) && ( ( ( year % 400 ) == 0) || ( ( year % 4 ) == 0 ) ) && ( ( year % 100 ) != 0 ) && ( day > 29 ) )  {
				return false;
			}
			else if( ( month == 2 ) && ( ( year % 100 ) == 0 ) && ( day > 29 ) )  {
				return false;
			}

			return {
				day : day,
				month : month,
				year : year
			};

		},
		_move : function( period, dir, callback ) {

			if( dir === 'previous' ) {
				
				if( period === 'month' ) {
					this.year = this.month > 0 ? this.year : --this.year;
					this.month = this.month > 0 ? --this.month : 11;
				}
				else if( period === 'year' ) {
					this.year = --this.year;
				}

			}
			else if( dir === 'next' ) {

				if( period === 'month' ) {
					this.year = this.month < 11 ? this.year : ++this.year;
					this.month = this.month < 11 ? ++this.month : 0;
				}
				else if( period === 'year' ) {
					this.year = ++this.year;
				}

			}

			this._generateTemplate( callback );

		},
		/************************* 
		******PUBLIC METHODS *****
		**************************/
		getYear : function() {
			return this.year;
		},
		getMonth : function() {
			return this.month + 1;
		},
		getMonthName : function() {
			return this.options.displayMonthAbbr ? this.options.monthabbrs[ this.month ] : this.options.months[ this.month ];
		},
		// gets the cell's content div associated to a day of the current displayed month
		// day : 1 - [28||29||30||31]
		getCell : function( day ) {

			var row = Math.floor( ( day + this.startingDay - this.options.startIn ) / 7 ),
				pos = day + this.startingDay - this.options.startIn - ( row * 7 ) - 1;

			return this.$cal.find( 'div.fc-body' ).children( 'div.week' ).eq( row ).children( 'div' ).eq( pos ).children( 'div' );

		},
		setData : function( caldata ) {

			caldata = caldata || {};
			$.extend( this.caldata, caldata );
			this._generateTemplate();

		},
		// goes to today's month/year
		gotoNow : function( callback ) {

			this.month = this.today.getMonth();
			this.year = this.today.getFullYear();
			this._generateTemplate( callback );

		},
		// goes to month/year
		goto : function( month, year, callback ) {

			this.month = month;
			this.year = year;
			this._generateTemplate( callback );

		},
		gotoPreviousMonth : function( callback ) {
			this._move( 'month', 'previous', callback );
		},
		gotoPreviousYear : function( callback ) {
			this._move( 'year', 'previous', callback );
		},
		gotoNextMonth : function( callback ) {
			this._move( 'month', 'next', callback );
		},
		gotoNextYear : function( callback ) {
			this._move( 'year', 'next', callback );
		}

	};
	
	$.fn.calendar = function( options ) {

		var instance = $.data( this, 'calendar' );
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				if ( !instance ) {

					console.log( "cannot call methods on calendar prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {

                    console.log( "no such method '" + options + "' for calendar instance" );
					return;
				
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				if ( instance ) {

					instance._init();
				
				}
				else {

					instance = $.data( this, 'calendar', new $.calendar( options, this ) );
				
				}

			});
		
		}
		
		return instance;
		
	};
	
} )( jQuery, window );

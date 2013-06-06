// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery-tmpl
//= require gumby

//= require ui/gumby.checkbox
//= require ui/gumby.fixed
//= require ui/gumby.radiobtn
//= require ui/gumby.retina
//= require ui/gumby.skiplink
//= require ui/gumby.tabs
//= require ui/gumby.toggleswitch
//= require ui/jquery.validation

//= require_tree .


Number.prototype.toMonthNumber = Number.prototype.toDateNumber = function () {
    return this > 10 ? this : '0' + this;
}

Date.prototype.getQueryDate = function(){
    return this.getFullYear() + '-' +
        this.getMonth() + '-' +
        this.getDate();
}

$(document).ready(function () {

    var months = [ 'Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],

    // PREPARE ROOT FOR INSERT EVENTS
    // --------------------------------------------------------------------------------------------------------

        main = $('<div></div>').attr({ id: (new Date()).getTime() }).html($('.calendar').parent().html()),
        root = $('.calendar').parent().empty().html(main),

    // UPDATE INFORMATION ABOUT CURRENT MONTH
    // --------------------------------------------------------------------------------------------------------

        onMonthUpdate = function () {
            $('.date').text(cal.getMonthName() + ' ' + cal.getYear());

            var data = {
                from: new Date(cal.getYear(), cal.getMonth() - 1, 1),
                to: new Date(cal.getYear(), cal.getMonth() + 1, 0)
            };

            $.ajax({
                dataType: "json",
                url: "/api/between.json",
                data: data,
                success: function (data) {
                    $.each(data, function () {
                        $('.calendar .week div#' + this.date).addClass('event');
                    });

                }
            });
        },

    // CLICK ON DAY
    // --------------------------------------------------------------------------------------------------------

        onDayClick = function ($el, $content, prop) {

            var data = {
                date: (new Date(prop.year, prop.month, prop.day)).getQueryDate()
            };

            $.ajax({
                dataType: "json",
                url: "/api/events.json",
                data: data,
                success: function (data) {

                    $.tmpl("templates/event", {
                        day: prop.day,
                        month_name: months[prop.month],
                        year: prop.year,
                        events: data
                    }).appendTo(root);

                    main.hide();
                }
            });
        };

    // BUTTONS ON EVENT FORM
    // --------------------------------------------------------------------------------------------------------

    $(document).on('click', '.event .close a', function () {

        $(this).parents('.event').remove();
        main.show();

        return false;
    });

    // BUTTONS PREV OR NEXT MONTH
    // --------------------------------------------------------------------------------------------------------

    $('.calendar-next').click(function () {
        cal.gotoNextMonth(onMonthUpdate);
        return false;
    }).show();

    $('.calendar-prev').click(function () {
        cal.gotoPreviousMonth(onMonthUpdate);
        return false;
    }).show();


    // USE CALENDAR
    // --------------------------------------------------------------------------------------------------------

    var cal = $('.calendar').empty().calendar({
        weekabbrs: [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
        months: months,
        onDayClick: onDayClick
    });

    onMonthUpdate();

});
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


$(document).ready(function(){

    var cal = $( '.calendar' ).calendar({
        weekabbrs : [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
        months : [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]
    });

    function updateMonthYear() {
        $('.date').text( cal.getMonthName() + ' ' + cal.getYear() );
    }

    updateMonthYear();

    $('.calendar-next').click(function(){
        cal.gotoNextMonth( updateMonthYear );
        return false;
    });

    $('.calendar-prev').click(function(){
        cal.gotoPreviousMonth( updateMonthYear );
        return false;
    });

});
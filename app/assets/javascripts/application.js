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

    var cal = $( '.calendar' ).empty().calendar({
            weekabbrs : [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
            months : [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
            onDayClick : function( $el, $contentEl, dateProperties ) {

                    console.log( dateProperties );

            }
        }),
        update =  function () {
            $('.date').text( cal.getMonthName() + ' ' + cal.getYear() );

            var data = {
                from: new Date(cal.getYear(), cal.getMonth() - 1, 1),
                to: new Date(cal.getYear(), cal.getMonth() + 1, 0)
            };

            $.ajax({
                dataType: "json",
                url: "/api/events.json",
                data: data,
                success: function( data ){
                    $.each(data, function(){
                        var d = new Date(this.date);
                        $('.calendar .week div#'+ d.getYear() + '-' + d.getMonth() + '-' + d.getDate() ).css({
                            border: '1px solid black'
                        })
                    });

                }
            });
        };

    $('.calendar-next').click(function(){
        cal.gotoNextMonth( update );
        return false;
    }).show();

    $('.calendar-prev').click(function(){
        cal.gotoPreviousMonth( update );
        return false;
    }).show();

    update();

});
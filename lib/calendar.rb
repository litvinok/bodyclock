# encoding: UTF-8
require 'date'

module Calendar

  VERSION = '0.0.1'
  # https://github.com/topfunky/calendar_helper/blob/master/lib/calendar_helper.rb

  def calendar(options = {}, &block)

    options[:year] = Time.now.year unless options[:year] > 0
    options[:month] = Time.now.month unless options[:month] > 0

    block ||= Proc.new {|d| nil}

    defaults = {
        :first_day_of_week => 1
    }
    options = defaults.merge options

    current = Date.civil(options[:year], options[:month], Time.now.day )
    first = Date.civil(options[:year], options[:month], 1)
    last = Date.civil(options[:year], options[:month], -1)

    first_weekday = first_day_of_week(options[:first_day_of_week])
    last_weekday = last_day_of_week(options[:first_day_of_week])

    week = first.cweek
    calendar = {
        :current => get_month( current ),
        :prev => get_month( current - 1.month ),
        :next => get_month( current + 1.month ),
        :label => get_week_legend(),
        :weeks => {
            week => []
        }
    }

    # previous month
    begin_of_week = beginning_of_week(first, first_weekday)
    begin_of_week.upto(first - 1) do |d|
      calendar[ :weeks ][ week ].push(get_day(d, { :prev => true }))
    end unless first.wday == first_weekday

    # current dates
    first.upto(last) do |cur|

      calendar[ :weeks ][ week ].push(get_day(cur))

      if cur.wday == last_weekday
        week += 1
        calendar[ :weeks ][ week ] = [] unless calendar[ :weeks ][ week ]
      end

    end

    # next month
    (last + 1).upto(beginning_of_week(last + 7, first_weekday) - 1) do |d|
      calendar[ :weeks ][ week ].push(get_day(d, { :next => true }))
    end unless last.wday == last_weekday

    calendar
  end

  ## ----------------------------------------------------

  private

  def get_week_legend( first_weekday = 1, options = {} )

    day_names = (!defined?(I18n) || I18n.t("date.day_names").include?("missing")) ? Date::DAYNAMES : I18n.t("date.day_names")
    day_names_abr = (!defined?(I18n) || I18n.t("date.abbr_day_names").include?("missing")) ? Date::ABBR_DAYNAMES : I18n.t("date.abbr_day_names")

    week_legend = []
    week_days = (0..6).to_a

    first_weekday.times do
      week_days.push(week_days.shift)
    end

    week_days.each do |day|
      week_legend.push({
          :w => day,
          :name => day_names[day],
          :abbr => day_names_abr[day]
      }.merge options)
    end
    week_legend
  end

  def get_month( date, options = {} )
    month_names = (!defined?(I18n) || I18n.t("date.month_names").include?("missing")) ? Date::MONTHNAMES.dup : I18n.t("date.month_names")
    {
        :year => date.year,
        :month => date.month,
        :name => month_names[date.month]
    }.merge options
  end

  def get_day(day, options = {} )
    {
        :day => day.mday,
        :w => day.wday,
        :weekend => is_weekend(day),
        :today => is_today(day)

    }.merge options
  end

  def beginning_of_week(date, start = 1)
    days_to_beg = days_between(start, date.wday)
    date - days_to_beg
  end

  def days_between(first, second)
    if first > second
      second + (7 - first)
    else
      second - first
    end
  end

  def first_day_of_week(day)
    day
  end

  def last_day_of_week(day)
    if day > 0
      day - 1
    else
      6
    end
  end

  def is_weekend(date)
    [0, 6].include?(date.wday)
  end

  def is_today(date)
    date == (Time.respond_to?(:zone) && !(zone = Time.zone).nil? ? zone.now.to_date : Date.today)
  end

  ## ----------------------------------------------------

  class Engine < Rails::Engine # :nodoc:
    ActiveSupport.on_load(:action_view) do
      include Calendar
    end
  end if defined? Rails::Engine

end
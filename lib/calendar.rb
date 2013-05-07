# encoding: UTF-8
require 'date'

module Calendar

  VERSION = '0.0.1'
  # https://github.com/topfunky/calendar_helper/blob/master/lib/calendar_helper.rb

  def calendar(options = {}, &block)

    options[:year] = Time.now.year unless options.has_key?(:year)
    options[:month] = Time.now.month unless options.has_key?(:month)

    block ||= Proc.new {|d| nil}

    month_names = (!defined?(I18n) || I18n.t("date.month_names").include?("missing")) ? Date::MONTHNAMES.dup : I18n.t("date.month_names")

    defaults = {
        :table_id => "calendar-#{options[:year]}-#{"%02d" % options[:month]}",
        :table_class => 'calendar',
        :month_name_class => 'monthName',
        :other_month_class => 'otherMonth',
        :day_name_class => 'dayName',
        :day_class => 'day',
        :abbrev => true,
        :first_day_of_week => 1,
        :accessible => false,
        :show_today => true,
        :previous_month_text => nil,
        :next_month_text => nil,
        :month_header => true,
        :calendar_title => month_names[options[:month]],
        :summary => "Calendar for #{month_names[options[:month]]} #{options[:year]}",
        :show_week_numbers => false,
        :week_number_class => 'weekNumber',
        :week_number_title => 'CW',
        :week_number_format => :iso8601, # :iso8601 or :us_canada
    }
    options = defaults.merge options

    first = Date.civil(options[:year], options[:month], 1)
    last = Date.civil(options[:year], options[:month], -1)

    first_weekday = first_day_of_week(options[:first_day_of_week])
    last_weekday = last_day_of_week(options[:first_day_of_week])

    #day_names = (!defined?(I18n) || I18n.t("date.day_names").include?("missing")) ? Date::DAYNAMES : I18n.t("date.day_names")
    #abbr_day_names = (!defined?(I18n) || I18n.t("date.abbr_day_names").include?("missing")) ? Date::ABBR_DAYNAMES : I18n.t("date.abbr_day_names")
    #week_days = (0..6).to_a
    #first_weekday.times do
    #  week_days.push(week_days.shift)
    #end

    cweek = first.cweek
    data = { :weeks => {} }

    cal = %(<table>)

    data[ :weeks ][ cweek ] = [] unless data[ :weeks ][ cweek ]


    # previous month
    begin_of_week = beginning_of_week(first, first_weekday)
    #cal << %(<td class="#{options[:week_number_class]}">#{week_number(begin_of_week, options[:week_number_format])}</td>) if options[:show_week_numbers]

    begin_of_week.upto(first - 1) do |d|
      data[ :weeks ][ cweek ].push(get_day(d), { :perv => true })
      cal << generate_other_month_cell(d)
    end unless first.wday == first_weekday

    first.upto(last) do |cur|
      #cell_text, cell_attrs = block.call(cur)
      #cell_text ||= cur.mday
      #cell_attrs ||= {}
      #cell_attrs[:headers] = th_id(cur, options[:table_id])
      #cell_attrs[:class] ||= options[:day_class]
      #cell_attrs[:class] += " weekendDay" if [0, 6].include?(cur.wday)
      #today = (Time.respond_to?(:zone) && !(zone = Time.zone).nil? ? zone.now.to_date : Date.today)
      #cell_attrs[:class] += " today" if (cur == today) and options[:show_today]

      data[ :weeks ][ cweek ].push(get_day(cur))
      cal << generate_cell(cur.mday)

      if cur.wday == last_weekday
        cweek += 1
        data[ :weeks ][ cweek ] = [] unless data[ :weeks ][ cweek ]
        cal << %(</tr>)
        if cur != last
          cal << %(<tr>)
        end
      end
    end

    # next month
    (last + 1).upto(beginning_of_week(last + 7, first_weekday) - 1) do |d|
      data[ :weeks ][ cweek ].push(get_day(d), { :next => true })
      cal << generate_other_month_cell(d)
    end unless last.wday == last_weekday

    cal << "</tr></tbody></table>"
    cal << data.to_s
    cal.respond_to?(:html_safe) ? cal.html_safe : cal
  end

  private

  def week_number(day, format)
    case format
      when :iso8601
        reference_day = seek_previous_wday(day, 1)
        reference_day.strftime('%V').to_i
      when :us_canada
        # US: the first day of the year defines the first calendar week
        first_day_of_year = Date.new((day + 7).year, 1, 1)
        reference_day = seek_next_wday(seek_next_wday(day, first_day_of_year.wday), 0)
        reference_day.strftime('%U').to_i
      else
        raise "Invalid calendar week format provided."
    end
  end

  def get_day(day, options = {} )
    out = {
        :day => day.mday,
        :weekend => [0, 6].include?(day.wday),
        :today => day == (Time.respond_to?(:zone) && !(zone = Time.zone).nil? ? zone.now.to_date : Date.today )

    }.merge options
    out
  end

  def seek_previous_wday(ref_date, wday)
    ref_date - days_between(ref_date.wday, wday)
  end

  def seek_next_wday(ref_date, wday)
    ref_date + days_between(ref_date.wday, wday)
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

  def days_between(first, second)
    if first > second
      second + (7 - first)
    else
      second - first
    end
  end

  def beginning_of_week(date, start = 1)
    days_to_beg = days_between(start, date.wday)
    date - days_to_beg
  end

  def generate_cell(cell_text)
    "<td>#{cell_text}</td>"
  end

  def generate_other_month_cell(date)
    generate_cell(date.day)
  end

  def weekend?(date)
    [0, 6].include?(date.wday)
  end

  class Engine < Rails::Engine # :nodoc:
    ActiveSupport.on_load(:action_view) do
      include Calendar
    end
  end if defined? Rails::Engine
end
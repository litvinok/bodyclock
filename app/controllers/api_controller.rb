class ApiController < ApplicationController

  def index

    @info = {
        :version => 1.0,
        :server => {
            :time => Time.now
        }
    }

    respond_to do |format|
      format.html { render }
      format.json { render :json => @info }
      format.xml { render :xml => @info }
    end

  end

  def between

    offset = 2.month
    from = params[:from] ? Date.parse(params[:from]) : Time.now - offset
    to = params[:to] ? Date.parse(params[:to]) : Time.now + offset

    @items = Event.where(
        :date.gt => from,
        :date.lt => to,
        :user => session[:user_id]
    )

    respond_to do |format|

      format.json { render :json => @items }
      format.xml { render :xml => @items }
    end

    #@date = Date.new( params[:year].to_i, params[:month].to_i, params[:day].to_i )
    #@item = Event.find_or_initialize_by( :user => auth, :date => @date )
    #@item.save

  end

  def events

    @items = Event.where(
        :date => Date.parse(params[:date]),
        :user => session[:user_id]
    )

    respond_to do |format|

      format.json { render :json => @items }
      format.xml { render :xml => @items }
    end

  end


end

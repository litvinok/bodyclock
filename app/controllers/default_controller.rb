class DefaultController < ApplicationController

  #include Calendar

  def index
    #@calendar ||= calendar({ :year => params[:year].to_i, :month => params[:month].to_i })
  end

  def event
    @date = Date.new( params[:year].to_i, params[:month].to_i, params[:day].to_i )
    @item = Event.find_or_initialize_by( :user => auth, :date => @date )
    @item.save
  end

  def about
  end

end

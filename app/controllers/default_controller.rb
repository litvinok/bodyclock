class DefaultController < ApplicationController

  include Calendar

  def index
    @calendar ||= calendar({ :year => params[:year].to_i, :month => params[:month].to_i })
  end

  def about
  end

end

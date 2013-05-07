class DefaultController < ApplicationController

  include Calendar

  def index
    @calendar ||= calendar()
  end

  def about
  end

end

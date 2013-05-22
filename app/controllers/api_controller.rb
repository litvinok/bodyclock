class ApiController < ApplicationController

  def index

    respond_to do |format|


      format.json { render :json => msg }
      format.xml  { render :xml => msg }
    end

  end

end

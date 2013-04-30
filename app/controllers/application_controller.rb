class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :auth

  private

  def auth
    @auth ||= User.find(session[:user_id]) if session[:user_id]
  end
end

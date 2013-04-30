class SessionsController < ApplicationController

  def create
    auth = request.env["omniauth.auth"]

    user = User.find_or_initialize_by( :uid => auth[:uid], :provider => auth[:provider] )

    user.refresh_token = auth[ :credentials ][ :refresh_token ]
    user.access_token = auth[ :credentials ][ :token ]
    user.expires = auth[ :credentials ][ :expires_at ]

    user.name = auth[ :info ][ :name ]
    user.email = auth[ :info ][ :email ]
    user.avatar = auth[ :info ][ :image ]

    if raw_info = auth[ :extra ][ :raw_info ]
      [ :gender, :birthday, :locale ].each do |item|
        user[item] = raw_info[item] if raw_info[item]
      end
    end

    url = session[:return_to] || root_path
    session[:return_to] = nil
    url = root_path if url.eql?('/logout')

    if user.save
      session[:user_id] = user.id
      notice = "Signed in!"
      logger.debug "URL to redirect to: #{url}"
      redirect_to url, :notice => notice
    else
      raise "Failed to login"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Signed out!"
  end

end

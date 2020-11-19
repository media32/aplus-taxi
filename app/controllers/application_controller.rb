class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :login_required
  helper_method :current_user

  private

  #def authenticate
  #  succcess = authenticate_or_request_with_http_digest do |username|
  #    USERS[username]
  #  end
  #end

  def current_user
    @current_user ||= User.find(session[:user]) if session[:user]
  end

  def logged_in?
    if current_user && current_user.active?
      true
    elsif current_user && !current_user.active?
      session[:user] = nil
      false
    else
      false
    end
  end

  def login_required
    return true if logged_in?
    store_location
    redirect_to login_path
  end
  
  def clerk_required
    return true if current_user and current_user.clerk?
    flash[:notice] = "Unauthorized request"
    redirect_to login_path
  end
  
  def admin_required
    return true if current_user and current_user.admin?
    flash[:notice] = "Unauthorized request"
    redirect_to login_path
  end

  def store_location
    session[:return_to] = request.fullpath
  end

  # move to the last store_location call or to the passed default one
  def redirect_back_or_default(default)
    session[:return_to] ? redirect_to(session[:return_to]) : redirect_to(default)
    session[:return_to] = nil
  end
end

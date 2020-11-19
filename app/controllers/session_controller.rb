class SessionController < ApplicationController
  skip_before_filter :login_required, :only => [:new, :create]
  
  def new
  end
  
  def create
    if @user = User.authenticate(params[:login], params[:password])
      session[:user] = @user.id
      redirect_back_or_default '/login'
    else
      flash.now[:notice] = "Invalid username or password"
      @login = params[:login]
      render :action => 'new'
    end
  end
  
  def destroy
    session[:user] = nil
    redirect_to :action => 'new'
  end
end

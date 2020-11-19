class UsersController < ApplicationController
  before_filter :admin_required
  
  def index
    @users = User.order(:initials)
  end

  def new
    @user = User.new
  end

  def edit
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(params[:user])
    @user.admin = params[:user][:admin] if current_user.admin?

    if @user.save
      redirect_to users_path
    else
      render :action => "new"
    end
  end

  def update
    @user = User.find(params[:id])
    @user.admin = params[:user][:admin] if current_user.admin?

    if @user.update_attributes(params[:user])
      redirect_to users_path
    else
      render :action => "edit"
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    redirect_to users_path
  end
end

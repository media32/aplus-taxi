class DriversController < ApplicationController
  before_filter :admin_required
  
  def index
    @drivers = Driver.order(:number).
      includes(:unit).
      paginate(:page => params[:page], :per_page => 20)
  end

  def new
    @driver = Driver.new
  end

  def edit
    @driver = Driver.find(params[:id])
  end

  def create
    @driver = Driver.new(params[:driver])
    if @driver.save
      redirect_to drivers_path
    else
      render :action => "new"
    end
  end

  def update
    @driver = Driver.find(params[:id])

    if @driver.update_attributes(params[:driver])
      redirect_to drivers_path
    else
      render :action => "edit"
    end
  end

  def destroy
    @driver = Driver.find(params[:id])
    @driver.destroy
    redirect_to drivers_path
  end
end

class DriverShiftsController < ApplicationController
  
  def index
    @driver_shifts = DriverShift.includes(:driver).
      order('driver_shifts.shift, drivers.number')
  end

  def new
    @driver_shift = DriverShift.new(:shift => params[:shift])
  end

  def edit
    @driver_shift = DriverShift.find(params[:id])
  end

  def create
    @driver_shift = DriverShift.new(params[:driver_shift])

    if @driver_shift.save
      flash[:notice] = 'Driver shift was successfully created.'
      redirect_to(driver_shifts_path)
    else
      render :action => "new"
    end
  end

  def update
    @driver_shift = DriverShift.find(params[:id])

    if @driver_shift.update_attributes(params[:driver_shift])
      flash[:notice] = 'Driver shift was successfully updated.'
      redirect_to(driver_shifts_path)
    else
      @drivers = Driver.all(:conditions => {:active => true}, :order => 'number')
      render :action => "edit"
    end
  end

  def destroy
    if params[:id].is_a?(Array)
      @driver_shifts = DriverShift.find(params[:id])
      @driver_shifts.each { |s| s.destroy }
    elsif params[:id]
      @driver_shift = DriverShift.find(params[:id])
      @driver_shift.destroy
    end
    redirect_to(driver_shifts_path)
  end
end

class UnitsController < ApplicationController
  before_filter :admin_required

  def index
    @units = Unit.order(:number)
  end

  def show
    @unit = Unit.find(params[:id])
  end

  def new
    @unit = Unit.new
  end

  def edit
    @unit = Unit.find(params[:id])
  end

  def create
    @unit = Unit.new(params[:unit])
    if @unit.save
      redirect_to(units_url, :notice => 'Unit was successfully created.')
    else
      render :new
    end
  end

  def update
    @unit = Unit.find(params[:id])
    if @unit.update_attributes(params[:unit])
      redirect_to(units_url, :notice => 'Unit was successfully updated.')
    else
      render :action => "edit"
    end
  end

  def destroy
    @unit = Unit.find(params[:id])
    @unit.destroy
    redirect_to(units_url)
  end
end

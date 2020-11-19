class LocationsController < ApplicationController
  before_filter :admin_required, :except => :index

  def index
    @locations = Location.search(params[:q]).
      order(:name).
      paginate(:page => params[:page], :per_page => 20)
  end

  def report
    @locations = Location.order('locations.name')
    render :layout => 'print'
  end

  def new
    @location = Location.new
  end

  def edit
    @location = Location.find(params[:id])
  end

  def create
    @location = Location.new(params[:location])
    if @location.save
      redirect_to locations_path
    else
      render :action => "new"
    end
  end

  def update
    @location = Location.find(params[:id])

    if @location.update_attributes(params[:location])
      redirect_to locations_path
    else
      render :action => "edit"
    end
  end

  def destroy
    @location = Location.find(params[:id])
    @location.destroy
    redirect_to locations_url
  end
end

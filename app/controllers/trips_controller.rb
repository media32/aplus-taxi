class TripsController < ApplicationController
  before_filter :admin_required, :only => [:update, :destroy]

  helper_method :sort_column, :sort_direction

  def queue
    if params[:shift].present?
      session[:shift] = params[:shift]
    elsif !session[:shift]
      session[:shift] = 'd'
    end
    
    drivers = Driver.active.where('drivers.id IS NOT NULL')

    @driver_shifts = DriverShift.includes(:driver).
      where("driver_shifts.shift" => session[:shift].upcase).
      merge(drivers).
      order("#{sort_column} #{sort_direction}")
  end
  
  def index
    @trips = Trip.includes(:driver, :customer).
      order('trips.created_at DESC').
      paginate(:page => params[:page], :per_page => 20)
  end

  def show
    @trip = Trip.find(params[:id])
  end

  def new
    @trip = Trip.new
    @trip.driver_id = params[:driver_id]
    @trip.scheduled = true if params[:scheduled]
    @trip.skipped = true if params[:skip]
    session[:continue] = params[:continue]
    render :action => (@trip.skipped ? 'skip' : 'new')
  end
  
  def edit
    @trip = Trip.find(params[:id])
  end

  def create
    @trip = Trip.new(params[:trip])
    @trip.user_id = current_user.id
    @trip.skip = true if params[:skip]

    if @trip.save
      redirect_to(session[:continue] || trips_path)
    else
      render :action => "new"
    end
  end

  def update
    @trip = Trip.find(params[:id])
    if @trip.update_attributes(params[:trip])
      redirect_to(trips_path)
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @trip = Trip.find(params[:id])
    @trip.destroy
    redirect_to :action => :index
  end
  
  private
  
  def sort_column
    %w[last_random_trip last_scheduled_trip].include?(params[:sort]) ? params[:sort] : 'last_random_trip'
  end

  def sort_direction
    "asc"
  end
end

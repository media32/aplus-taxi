class VehicleIssuesController < ApplicationController
  before_filter :admin_required, :only => [:report, :destroy]
  helper_method :date_from, :date_to
  
  def index
    params[:completed] ||= '0'
    @vehicle_issues = VehicleIssue.search(params[:q]).
      filter_by(params).
      created_between(date_from, date_to).
      order('vehicle_issues.created_at DESC').
      paginate(:page => params[:page], :per_page => 20)
  end
  
  def report
    @vehicle_issues = VehicleIssue.search(params[:q]).
      filter_by(params).
      created_between(date_from, date_to).
      order('units.number, vehicle_issues.created_at')
    render :layout => 'print'
  end

  def show
    @vehicle_issue = VehicleIssue.find(params[:id])
  end

  def new
    @vehicle_issue = VehicleIssue.new
  end

  def edit
    @vehicle_issue = VehicleIssue.find(params[:id])
  end

  def create
    @vehicle_issue = VehicleIssue.new(params[:vehicle_issue])
    @vehicle_issue.user_id = current_user.id
    if @vehicle_issue.save
      redirect_to(vehicle_issues_path)
    else
      render :new
    end
  end

  def update
    if params[:id].is_a?(Array)
      d = Date.today
      d = convert_date(params[:date]) if params[:date]
      
      @vehicle_issue = VehicleIssue.find(params[:id])
      @vehicle_issue.each { |i| i.update_attribute(:completed_on, d) }
      
    elsif params[:id]
      @vehicle_issue = VehicleIssue.find(params[:id])
      @vehicle_issue.user_id = current_user.id
      
      unless @vehicle_issue.update_attributes(params[:vehicle_issue])
        render :edit
        return
      end
    end
    redirect_to :action => :index
  end

  def destroy
    @vehicle_issue = VehicleIssue.find(params[:id])
    @vehicle_issue.destroy
    redirect_to(vehicle_issues_path)
  end
  
  private
  
  def convert_date(h)
    if h.is_a?(Hash)
      Time.zone.local(h['year'].to_i, h['month'].to_i, h['day'].to_i)
    end
  end
  
  def date_from
    Date.parse(params[:from]) if params[:from].present?
  rescue ArgumentError
    flash.now[:notice] = "Invalid format for date from"
    nil
  end
  
  def date_to
    Date.parse(params[:to]) if params[:to].present?
  rescue ArgumentError
    flash.now[:notice] = "Invalid format for date to"
    nil
  end
end

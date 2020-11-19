class StatsController < ApplicationController
  before_filter :clerk_required
  before_filter :admin_required, :only => [:edit, :update, :destroy]
  
  def index
    @stats = Stat.scoped
    
    unless current_user.admin?
      @stats = @stats.where('date >= ?', 1.month.ago.utc.to_date)
    end
    
    @stats = Stat.order('date DESC').
      paginate(:page => params[:page], :per_page => 20)
  end

  def new
    @stat = Stat.new
  end

  def edit
    @stat = Stat.find(params[:id])
  end

  def create
    @stat = Stat.new(params[:stat])
    if @stat.save
      flash[:notice] = 'Stat was successfully created.'
      redirect_to :action => :index
    else
      render :new
    end
  end

  def update
    @stat = Stat.find(params[:id])
    if @stat.update_attributes(params[:stat])
      flash[:notice] = 'Stat was successfully updated.'
      redirect_to :action => :index
    else
      render :edit
    end
  end

  def destroy
    @stat = Stat.find(params[:id])
    @stat.destroy
    redirect_to :action => :index
  end
end

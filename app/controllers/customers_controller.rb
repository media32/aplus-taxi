class CustomersController < ApplicationController
  before_filter :admin_required, :only => :destroy
  
  respond_to :html, :json
  
  def index
    @customers = Customer.search(params[:q]).
      filter_by(params).
      order('customers.name').
      paginate(:page => params[:page], :per_page => 20)
  end
  
  def report
    @customers = Customer.search(params[:q]).
      filter_by(params)
    render :layout => 'print'
  end

  def show
    @customer = Customer.find(params[:id])
    respond_with(@customer)
  end

  def new
    @customer = Customer.new
    @customer.active = true
    @customer.terms = false if current_user.clerk?
  end

  def edit
    @customer = Customer.find(params[:id])
  end

  def create
    @customer = Customer.new(params[:customer])
    if @customer.save
      redirect_to customers_path
    else
      render :new
    end
  end

  def update
    @customer = Customer.find(params[:id])
    if @customer.update_attributes(params[:customer])
      redirect_to :action => :index
    else
      render :edit
    end
  end

  def destroy
    @customer = Customer.find(params[:id])
    @customer.destroy
    redirect_to customers_path
  end
  
  private
  
  def per_page
    (1..100).to_a.include?(params[:per_page].to_i) ? params[:per_page] : 20
  end
end

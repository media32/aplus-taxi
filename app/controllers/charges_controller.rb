class ChargesController < ApplicationController
  before_filter :admin_required
  
  helper_method :customers, :users, :from, :to, :sort_column, :sort_direction
  
  def index
    @charges = Charge.select("charges.*, users.initials AS user_initials,
        customers.name AS customer_name, drivers.number AS driver_number").
      joins(:customer, :driver, :user).
      search(params[:q]).
      customer_id(params[:customer_id]).
      between(params[:field], from, to).
      order("#{sort_column} #{sort_direction}").
      paginate(:page => params[:page], :per_page => per_page)
  end
  
  def report
    t = 'charges/reports/summary'
    @total = { :trips => 0, :price => 0.0, :gst => 0.0, :total => 0.0 }
    
    if params[:detailed]
      t = 'charges/reports/detailed'
      @charges = Charge.select("charges.*, customers.name AS customer_name").
        joins(:customer, :user).
        search(params[:q]).
        customer_id(params[:customer_id]).
        between(params[:field], from, to).
        order('customer_name, charges.written_on')
    else
      @charges = Charge.select("customers.name AS customer_name, charges.*, COUNT(written_on) AS trip_count, SUM(price) AS price, SUM(total) AS total").
        joins(:customer, :user).
        search(params[:q]).
        customer_id(params[:customer_id]).
        between(params[:field], from, to).
        group('customers.id, written_on').
        order('customers.name, charges.written_on')
    end
    render t, :layout => 'print'
  end
  
  def new
    @charge = Charge.new(params[:charge])
    @charge.customer = customers.first
    @charge.total = customers.first.rate
  end
  
  def edit
    @charge = Charge.find(params[:id])
  end
  
  def create
    @charge = Charge.new(params[:charge])
    @charge.user = current_user
    if @charge.save
      flash.now[:notice] = "Successfully created charge ##{@charge.id} at #{Time.new.strftime('%H:%M:%S')}"
      @charge = @charge.clone
      @charge.total = nil
      @charge.notes = nil
      @charge.notes_internal = nil
    end
    render :action => :new
  end
  
  def update
    @charge = Charge.find(params[:id])
    if @charge.update_attributes(params[:charge])
      redirect_to charges_path
    else
      render :action => :edit
    end
  end
  
  def destroy
    @charge = Charge.find(params[:id])
    @charge.destroy
    redirect_to charges_path
  end
  
  private
  
  def convert_date(h)
    if h.is_a?(Hash)
      Time.zone.local(h['year'].to_i, h['month'].to_i, h['day'].to_i)
    end
  end
  
  def customers
    @customers ||= Customer.select('id, cust_type, name, rate, notes').active.terms.order(:name)
  end
  
  def users
    @users ||= User.select('id, initials').active.admin.order(:initials)
  end
  
  def from
    params[:from] ? convert_date(params[:from]) : 1.month.ago
  end
  
  def to
    params[:to] ? convert_date(params[:to]) : Time.now
  end
  
  def per_page
    (1..100).to_a.include?(params[:per_page].to_i) ? params[:per_page] : 20
  end
  
  def sort_column
    %w[created_at].include?(params[:sort]) ? params[:sort] : 'written_on'
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
  end
end

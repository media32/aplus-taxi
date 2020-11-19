class BookingsController < ApplicationController
  skip_before_filter :login_required
  
  def show
    if cookies[:booked]
      cookies.delete(:booked)
      @sent = true
    end
  end
  
  def create
    if request.post?
      @booking = Booking.new
      @booking.date = convert_datetime_hash(params[:date])
      @booking.name = params[:name]
      @booking.address = params[:address]
      @booking.email = params[:email]
      @booking.phone = params[:phone]
      @booking.comments = params[:comments]
      @booking.ip = request.remote_ip
    
      if @booking.valid?
        Mailer.deliver_online_booking(@booking)
        cookies[:booked] = 1
        redirect_to :action => :thankyou
      else
        render :show
      end
    else
    end
  end
  
  private
  
  def convert_datetime_hash(h)
    Time.zone.local(h['year'].to_i, h['month'].to_i, h['day'].to_i, h['hour'].to_i, h['minute'].to_i) if h.is_a?(Hash)
  end
end

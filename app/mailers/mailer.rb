class Mailer < ActionMailer::Base
  default :from => "noreply@aplustaxi.ca"

  def online_booking(booking)
    @booking = booking
    headers(:reply_to => @booking.email)
    mail(:to => 'dispatch@aplustaxi.ca', :subject => "Online Booking #{Time.new.strftime("%Y-%m-%d %H:%M")}")
  end

  def daily_stats(stats)
    @stats = stats
    mail(:to => "stats@aplustaxi.ca", :subject => "Daily Statistics")
  end
  
  def drivers_table(drivers)
    require 'csv'
    
    s = CSV.generate do |csv|
      csv << ['Number', 'Unit', 'Name', 'Status', 'Shift', 'Last Random Trip', 'Last Scheduled Trip']
      
      drivers.each do |d|
        csv << [d.number, d.unit, d.name, d.status, d.shift, d.last_random_trip, d.last_scheduled_trip]
      end
    end
    
    attachments['drivers.csv'] = s
    mail(:to => "triptable@aplustaxi.ca", :subject => "Drivers")
  end
  
  def vehicle_issues(issues)
    @vehicle_issues = issues
    mail(:to => "maintenance@aplustaxi.ca", :subject => "Vehicle Issues")
  end
end

namespace :email do
  desc 'Email daily stats'
  task :stats => :environment do
    Mailer.daily_stats(Stat.created_24_hours_ago).deliver
  end
  
  desc 'Email vehicle issues created within last 12 hours'
  task :vehicle_issues => :environment do
    issues = VehicleIssue.within_12_hours
    if issues and issues.length > 0
      Mailer.vehicle_issues(issues).deliver
    end
  end

  task :drivers_table => :environment do
    drivers = Driver.all
    Mailer.drivers_table(drivers).deliver
  end
end

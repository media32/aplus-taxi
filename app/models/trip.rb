class Trip < ActiveRecord::Base
  attr_protected :user_id

  belongs_to :customer
  belongs_to :driver
  belongs_to :location
  belongs_to :user

  validates_associated :driver
  validates_presence_of :driver_id, :user_id
  validates_presence_of :location_id, :unless => :skipped

  before_create :set_location_fees, :unless => :skipped
  after_create :set_driver_trip_dates

  private

  def set_location_fees
    write_attribute(:fee, location.fee) unless fee.present?
    write_attribute(:charge, location.charge) unless charge.present?
  end

  def set_driver_trip_dates
    if scheduled
      driver.last_scheduled_trip = created_at
    else
      driver.last_random_trip = created_at
    end
    
    if skipped
      driver.skipped = true
    else
      driver.skipped = false
    end
    driver.save
  end
end

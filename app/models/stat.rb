class Stat < ActiveRecord::Base
  before_save :prepare_holidays
  
  validates_numericality_of :day_trips, :day_trips_lt, :day_trips_nt, :day_trips_ca,
    :day_drivers_sch, :day_drivers_act, :day_drivers_ext, :day_drivers_lft
  validates_numericality_of :night_trips, :night_trips_lt, :night_trips_nt,
    :night_trips_ca, :night_drivers_sch, :night_drivers_act,
    :night_drivers_ext, :night_drivers_lft
  validates_numericality_of [:temp_max, :temp_min, :temp_mean], :allow_blank => true
  validates_uniqueness_of :date

  scope :created_24_hours_ago, :conditions => ["created_at > ?", (Time.now - 24.hours)]

  def day_trips_per_day
    (day_trips / day_drivers_act.to_f).round(1) if day_drivers_act > 0
  end
  
  def night_trips_per_day
    (night_trips / night_drivers_act.to_f).round(1) if night_drivers_act > 0
  end

  def prepare_holidays
    if date
      self[:holidays] = date.holidays(:ca).map { |h| h[:name] }.join(',')
    end
  end
end

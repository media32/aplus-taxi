class VehicleIssue < ActiveRecord::Base
  CATEGORIES = ['Auto Bulbs', 'Battery', 'Body', 'Brakes', 'Drivetrain',
    'Engine', 'Front End', 'Lights/Signal Switch', 'LOF', 'Meter', 'Radio',
    'Rear End', 'Tires', 'Toplight', 'Other']

  belongs_to :user
  belongs_to :driver
  belongs_to :unit

  validates_presence_of :driver_id, :unit_id, :odometer, :category, :details

  scope :completed, where('completed_on IS NOT NULL')
  scope :uncompleted, where('completed_on IS NULL')
  
  def self.created_between(from, to)
    if from and to
      where('vehicle_issues.created_at BETWEEN ? AND ?', from.beginning_of_day, to.end_of_day)
    else
      scoped
    end
  end

  def self.within_12_hours
    where('created_at >= ?', (Time.now - 12.hours).utc)
  end

  def self.filter_by(params)
    s = includes(:user, :driver, :unit)
    
    case params[:completed]
    when '1'
      s = s.completed
    when '0'
      s = s.uncompleted
    end
    
    case params[:active]
    when '1'
      s = s.merge(Unit.active)
    when '0'
      s = s.merge(Unit.inactive)
    end
    
    if params[:unit].present?
      s = s.where(:unit_id => params[:unit])
    end
    s
  end
  
  def self.search(q)
    if q.present?
      where("category LIKE ? OR details LIKE ?", *(["%#{q}%"] * 2))
    else
      scoped
    end
  end
  
  def completed?
    completed_on.present?
  end
end
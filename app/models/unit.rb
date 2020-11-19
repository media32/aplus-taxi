class Unit < ActiveRecord::Base
  has_many :drivers
  has_many :vehicle_issues
  
  scope :active, where(:active => true)
  scope :inactive, where(:active => false)
  
  def to_s
    number.to_s
  end
end

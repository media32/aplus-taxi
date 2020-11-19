class DriverShift < ActiveRecord::Base
  belongs_to :driver

  validates_presence_of :driver_id, :shift
  validates_uniqueness_of :driver_id, :scope => :shift, :message => 'already assigned to shift'

  def shift_name
    if self[:shift] == 'D'
      'Day'
    elsif self[:shift] == 'N'
      'Night'
    end
  end
end

class Driver < ActiveRecord::Base
  belongs_to :unit
  
  has_many :charges
  has_many :chits
  has_many :driver_shifts, :dependent => :delete_all
  has_many :trips

  validates_presence_of :number, :first_name, :last_name
  validates_uniqueness_of :number, :if => :driver_number_active

  scope :active, where('drivers.active' => true)

  def detail
    [number, name, status, shift].delete_if { |v| v.blank? }.join(' - ')
  end

  def to_s
    number.to_s
  end

  def name
    "#{first_name} #{last_name}"
  end

  def shift_name
    if self[:shift] == 'D'
      'Day'
    elsif self[:shift] == 'N'
      'Night'
    end
  end

  private
  
  # Check if driver number is active
  def driver_number_active
    return false unless active    # Allow D# if driver is inactive
    drivers = Driver.active.where(:number => number)
    drivers = drivers.where('id != ?', id) unless new_record?   # Don't count self
    drivers.count > 0
  end
end

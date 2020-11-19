class Booking
  include ActiveModel::Validations
  validates_presence_of :name, :address, :email
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :allow_blank => true
  attr_accessor :date, :name, :address, :email, :phone, :comments, :ip
end
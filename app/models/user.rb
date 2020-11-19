require 'digest/sha1'

class User < ActiveRecord::Base
  attr_accessor :password, :password_confirmation
  attr_protected :admin

  has_many :charges
  has_many :trips

  validates_presence_of :first_name, :last_name, :initials, :login
  validates_uniqueness_of :login
  validates_presence_of :password, :on => :create
  validates_confirmation_of :password, :allow_blank => true

  default_scope :order => 'initials'
  scope :admin, where(:admin => true)
  scope :clerk, where(:clerk => true)
  scope :active, :conditions => {:active => true}

  before_save :prepare_password

  def self.authenticate(login, password)
    user = find_by_login(login)
    return user if user && user.active? && user.matching_password?(password)
  end

  def login=(login)
    self[:login] = login.downcase
  end

  def to_s
    name
  end
  
  def name
    "#{first_name} #{last_name}"
  end

  def initials=(new_initials)
    self[:initials] = new_initials.upcase
  end
  
  def matching_password?(pass)
    self.encrypted_password == encrypt(pass)
  end
  
  private

  def encrypt(password)
    Digest::SHA1.hexdigest(password)
  end
  
  def prepare_password
    unless password.blank?
      self.encrypted_password = encrypt(password)
    end
  end
end

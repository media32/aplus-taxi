class Customer < ActiveRecord::Base
  TYPES = ['Regular', 'One-time', 'Prepaid', 'Seasonal']

  has_many :charges
  has_many :trips

  validates_length_of :code, :in => 1..10, :allow_blank => true
  validates_uniqueness_of :code, :allow_blank => true
  validates_presence_of :name
  validates_numericality_of :rate, :allow_blank => true

  scope :active, where(:active => true)
  scope :inactive, where(:active => false)
  scope :with_type, lambda {|t| where(:cust_type => t)}
  scope :expired_rate, where("rate_renewed_on <= ?", 6.months.ago)
  scope :current_rate, where("rate_renewed_on >= ?", 6.months.ago)
  scope :terms, where(:terms => true)
  scope :cash, where(:terms => false)

  def self.filter_by(params)
    s = scoped
    s = s.with_type(params[:type]) if params[:type].present?
    
    case params[:terms]
    when '1'
      s = s.terms
    when '0'
      s = s.cash
    when '2'
      s = s.expired_rate
    end

    case params[:active]
    when '1'
      s = s.active
    when '0'
      s = s.inactive
    end
    
    case params[:expired]
    when '1'
      s = s.expired_rate
    when '0'
      s = s.current_rate
    end
    s
  end

  def self.search(q)
    if q.present?
      where("code LIKE ? OR name LIKE ? OR rate_orig LIKE ? OR rate_dest LIKE ?", *(["%#{q}%"] * 4))
    else
      scoped
    end
  end
  
  def rate_expired?
    return unless rate_renewed_on and rate_renewed_on.is_a?(Date)
    rate_renewed_on.to_time <= 6.months.ago
  end

  def to_s
    name
  end
end
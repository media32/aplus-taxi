class Charge < ActiveRecord::Base
  CURRENT_GST_RATE = 1.05
  
  attr_protected :user_id
  
  belongs_to :user
  belongs_to :customer
  belongs_to :driver

  before_validation :calculate_price
  
  validates_presence_of :user_id, :on => :create
  validates_presence_of :customer_id, :written_on, :total
  validates_presence_of :price, :if => :total
  validates_numericality_of [:price, :total], :allow_blank => true
  
  scope :customer_id, lambda { |id|
    return scoped if id.blank?
    where(:customer_id => id)
  }
  scope :user_id, lambda { |id|
    return scoped if id.blank?
    where(:user_id => id)
  }
  scope :written_between, lambda { |from, to|
    where("charges.written_on BETWEEN DATE(?) AND DATE(?)", from, to)
  }
  scope :created_between, lambda { |from, to|
    where('charges.created_at BETWEEN ? AND ?', from.beginning_of_day, to.end_of_day)
  }
  scope :between, lambda { |field, from, to|
    case field
    when 'created'
      created_between(from, to)
    else
      written_between(from, to)
    end
  }

  def self.search(q)
    s = joins(:customer, :driver, :user)
    if q.present?
      s = s.where("charges.notes LIKE ? OR charges.notes_internal LIKE ? \
          OR customers.code LIKE ? OR customers.name LIKE ? \
          OR drivers.number LIKE ? OR drivers.first_name LIKE ? OR drivers.last_name LIKE ? \
          OR users.initials LIKE ?", *(["%#{q}%"] * 8))
    end
    s
  end
  
  # Total is entered with GST, so we have to determine price without GST
  # and assign it to unit price, and total of customers who are tax exempt
  def calculate_price
    if total
      if customer.taxable?
        price = (total / CURRENT_GST_RATE).round(3)  # calculate unit price without GST
        self[:price] = price    # unit price
      else
        self[:price] = total
      end
    end
  end
end

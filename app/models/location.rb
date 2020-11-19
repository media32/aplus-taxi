class Location < ActiveRecord::Base
  has_many :trips

  validates_presence_of :name
  validates_uniqueness_of :name

  def self.search(q)
    if q.present?
      where("locations.name LIKE ?", "%#{q}%")
    else
      scoped
    end
  end

  def to_s
    name
  end
end

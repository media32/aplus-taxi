class ChangeVehicleIssueCreatedOnToAt < ActiveRecord::Migration
  def self.up
    change_table :vehicle_issues do |t|
      t.rename :created_on, :created_at
      t.change :created_at, :datetime
    end
  end

  def self.down
    change_table :vehicle_issues do |t|
      t.rename :created_at, :created_on
      t.change :created_on, :date
    end
  end
end

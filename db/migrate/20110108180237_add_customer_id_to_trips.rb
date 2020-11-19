class AddCustomerIdToTrips < ActiveRecord::Migration
  def self.up
    remove_column :trips, :driver
    remove_column :trips, :location
    remove_column :trips, :dispatcher

    add_column :trips, :customer_id, :integer, :after => :id

    add_index :trips, :customer_id
  end

  def self.down
    remove_column :trips, :customer_id
  end
end

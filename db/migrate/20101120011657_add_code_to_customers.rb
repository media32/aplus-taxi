class AddCodeToCustomers < ActiveRecord::Migration
  def self.up
    add_column :customers, :code, :string, :length => 10, :default => '', :null => false, :after => :id
    add_index :customers, :code
  end

  def self.down
    remove_column :customers, :code
  end
end

class ChangeUnitNumberToInteger < ActiveRecord::Migration
  def self.up
    change_column :units, :number, :integer, :null => false
  end

  def self.down
    change_column :units, :number, :string, :null => false
  end
end

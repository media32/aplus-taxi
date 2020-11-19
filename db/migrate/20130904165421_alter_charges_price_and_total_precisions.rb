class AlterChargesPriceAndTotalPrecisions < ActiveRecord::Migration
  def self.up
  	change_column :charges, :price, :decimal, :precision => 10, :scale => 2
  	change_column :charges, :total, :decimal, :precision => 10, :scale => 2
  end

  def self.down
  	change_column :charges, :price, :decimal, :precision => 10, :scale => 0
  	change_column :charges, :total, :decimal, :precision => 10, :scale => 0
  end
end

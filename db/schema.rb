# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130904165421) do

  create_table "_units_old_20110104", :force => true do |t|
    t.integer "number",                        :null => false
    t.string  "description"
    t.date    "created_on"
    t.boolean "active",      :default => true, :null => false
  end

  create_table "_units_old_20110104_1", :force => true do |t|
    t.integer "number",                        :null => false
    t.string  "description"
    t.date    "created_on"
    t.boolean "active",      :default => true, :null => false
  end

  create_table "charges", :force => true do |t|
    t.integer  "user_id"
    t.integer  "customer_id"
    t.integer  "driver_id"
    t.string   "from"
    t.string   "to"
    t.string   "notes",                                         :default => "", :null => false
    t.string   "notes_internal",                                :default => "", :null => false
    t.decimal  "price",          :precision => 10, :scale => 2
    t.decimal  "total",          :precision => 10, :scale => 2,                 :null => false
    t.date     "written_on",                                                    :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "charges", ["customer_id"], :name => "index_charges_on_customer_id"
  add_index "charges", ["driver_id"], :name => "index_charges_on_driver_id"
  add_index "charges", ["user_id"], :name => "index_charges_on_user_id"

  create_table "customers", :force => true do |t|
    t.string   "name",                                                              :null => false
    t.text     "notes",                                                             :null => false
    t.boolean  "taxable",                                        :default => true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "phone"
    t.string   "cust_type"
    t.boolean  "terms",                                          :default => true
    t.decimal  "rate",            :precision => 10, :scale => 0
    t.string   "rate_orig"
    t.string   "rate_dest"
    t.text     "rate_notes"
    t.date     "rate_renewed_on"
    t.boolean  "active",                                         :default => false, :null => false
    t.string   "code",                                           :default => "",    :null => false
  end

  add_index "customers", ["code"], :name => "index_customers_on_code"

  create_table "driver_shifts", :force => true do |t|
    t.integer  "driver_id",  :null => false
    t.string   "shift",      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "driver_shifts", ["driver_id"], :name => "index_driver_shifts_on_driver_id"
  add_index "driver_shifts", ["shift"], :name => "index_driver_shifts_on_shift"

  create_table "drivers", :force => true do |t|
    t.boolean  "active",              :default => true,  :null => false
    t.integer  "number",                                 :null => false
    t.integer  "unit_number"
    t.string   "first_name",                             :null => false
    t.string   "last_name",                              :null => false
    t.string   "status"
    t.string   "shift"
    t.boolean  "skipped",             :default => false, :null => false
    t.datetime "last_random_trip",                       :null => false
    t.datetime "last_scheduled_trip",                    :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "unit_id"
  end

  add_index "drivers", ["active"], :name => "index_drivers_on_active"
  add_index "drivers", ["number"], :name => "index_drivers_on_number"
  add_index "drivers", ["unit_id"], :name => "index_drivers_on_unit_id"

  create_table "locations", :force => true do |t|
    t.string   "name",                                      :null => false
    t.integer  "distance_km"
    t.decimal  "distance_hr", :precision => 4, :scale => 1
    t.decimal  "charge",      :precision => 8, :scale => 2
    t.decimal  "fee",         :precision => 8, :scale => 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stats", :force => true do |t|
    t.date     "date"
    t.integer  "day_trips",         :default => 0,  :null => false
    t.integer  "day_trips_lt",      :default => 0,  :null => false
    t.integer  "day_trips_nt",      :default => 0,  :null => false
    t.integer  "day_trips_ca",      :default => 0,  :null => false
    t.integer  "day_drivers_sch",   :default => 0,  :null => false
    t.integer  "day_drivers_act",   :default => 0,  :null => false
    t.integer  "day_drivers_ext",   :default => 0,  :null => false
    t.integer  "day_drivers_lft",   :default => 0,  :null => false
    t.integer  "night_trips",       :default => 0,  :null => false
    t.integer  "night_trips_lt",    :default => 0,  :null => false
    t.integer  "night_trips_nt",    :default => 0,  :null => false
    t.integer  "night_trips_ca",    :default => 0,  :null => false
    t.integer  "night_drivers_sch", :default => 0,  :null => false
    t.integer  "night_drivers_act", :default => 0,  :null => false
    t.integer  "night_drivers_ext", :default => 0,  :null => false
    t.integer  "night_drivers_lft", :default => 0,  :null => false
    t.float    "temp_max"
    t.float    "temp_min"
    t.float    "temp_mean"
    t.string   "holidays",          :default => "", :null => false
    t.text     "notes",                             :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "stats", ["date"], :name => "index_stats_on_date"

  create_table "trips", :force => true do |t|
    t.decimal  "charge",      :precision => 10, :scale => 0
    t.decimal  "fee",         :precision => 10, :scale => 0
    t.string   "r10"
    t.string   "comment"
    t.date     "lease"
    t.boolean  "scheduled",                                  :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "driver_id"
    t.integer  "location_id"
    t.integer  "user_id"
    t.boolean  "skipped",                                    :default => false, :null => false
    t.integer  "customer_id"
  end

  add_index "trips", ["customer_id"], :name => "index_trips_on_customer_id"
  add_index "trips", ["driver_id"], :name => "index_trips_on_driver_id"
  add_index "trips", ["location_id"], :name => "index_trips_on_location_id"
  add_index "trips", ["user_id"], :name => "index_trips_on_user_id"

  create_table "units", :force => true do |t|
    t.integer "number",                        :null => false
    t.string  "description"
    t.date    "created_on"
    t.boolean "active",      :default => true, :null => false
  end

  add_index "units", ["active"], :name => "index_units_on_active"
  add_index "units", ["number"], :name => "index_units_on_number", :unique => true

  create_table "users", :force => true do |t|
    t.boolean  "active",             :default => true,  :null => false
    t.string   "first_name",                            :null => false
    t.string   "last_name",                             :null => false
    t.string   "initials",                              :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "login",              :default => "",    :null => false
    t.string   "encrypted_password", :default => "",    :null => false
    t.boolean  "admin",              :default => false, :null => false
    t.boolean  "clerk",              :default => false, :null => false
  end

  add_index "users", ["active"], :name => "index_users_on_active"
  add_index "users", ["admin"], :name => "index_users_on_admin"

  create_table "vehicle_issues", :force => true do |t|
    t.integer  "user_id"
    t.integer  "driver_id"
    t.integer  "unit_id"
    t.integer  "odometer"
    t.string   "category"
    t.text     "details"
    t.datetime "created_at"
    t.boolean  "completed",    :default => false, :null => false
    t.date     "completed_on"
  end

end

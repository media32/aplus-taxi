require 'test_helper'

class DriverShiftsControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:driver_shifts)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_driver_shift
    assert_difference('DriverShift.count') do
      post :create, :driver_shift => { }
    end

    assert_redirected_to driver_shift_path(assigns(:driver_shift))
  end

  def test_should_show_driver_shift
    get :show, :id => driver_shifts(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => driver_shifts(:one).id
    assert_response :success
  end

  def test_should_update_driver_shift
    put :update, :id => driver_shifts(:one).id, :driver_shift => { }
    assert_redirected_to driver_shift_path(assigns(:driver_shift))
  end

  def test_should_destroy_driver_shift
    assert_difference('DriverShift.count', -1) do
      delete :destroy, :id => driver_shifts(:one).id
    end

    assert_redirected_to driver_shifts_path
  end
end

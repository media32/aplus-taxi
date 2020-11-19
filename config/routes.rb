Aplustaxi::Application.routes.draw do
  match 'login' => 'session#new', :as => :login
  match 'logout' => 'session#destroy', :as => :logout

  #match 'request' => 'pages#request'
  #match 'request/thankyou' => 'pages#thankyou', :via => :get

  resource :booking

  resources :charges, :except => :show do
    get :report, :on => :collection
  end

  resources :customers do
    get :report, :on => :collection
  end

  resources :driver_shifts, :except => :show do
    delete :destroy, :on => :collection
  end

  resources :trips, :except => :show do
    get :queue, :on => :collection
    #get :skip, :on => :member
  end

  resources :users, :except => :show
  resources :drivers, :except => :show
  resources :locations, :except => :show do
    get :report, :on => :collection
  end
  resources :stats, :except => :show
  resources :units, :except => :show
  resources :users, :except => :show
  resources :vehicle_issues, :except => :show do
    put :update, :on => :collection
    get :report, :on => :collection
  end

  root :to => 'pages#index'

  match '/:controller(/:action(/:id))'
end

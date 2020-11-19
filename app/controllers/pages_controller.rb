class PagesController < ApplicationController
  layout 'home'
  skip_before_filter :login_required
end

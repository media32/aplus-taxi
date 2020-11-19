# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def confirm_delete(object = nil)
    "Warning: Are you sure you want to delete this record? Other records may still depend on this."
  end
  
  def sortable(column, title = nil)
    title ||= column.titleize
    css_class = (column == sort_column) ? "current #{sort_direction}" : nil

    direction = if column == sort_column
      sort_direction == 'asc' ? 'desc' : 'asc'
    else
      sort_direction
    end

    link_to title, params.merge(:sort => column, :direction => direction, :page => nil), {:class => css_class}
  end
end

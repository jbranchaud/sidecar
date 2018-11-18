ActiveAdmin.register Ingredient do
  permit_params :id, :name, :description, :created_at, :updated_at
end

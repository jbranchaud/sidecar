class RecipeSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  set_id :id
  attributes :name, :source_url
end

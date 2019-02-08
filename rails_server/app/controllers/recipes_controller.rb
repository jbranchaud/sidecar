class RecipesController < ApiController
  def create
    @recipe = Recipe.new(recipe_params)
    @recipe.user = @current_user

    if @recipe.save
      render json: { recipe: @recipe }.to_json
    else
      render json: { error: @recipe.errors.full_messages.first }, status: :bad_request
    end
  end

  def index
    render json: { recipes: @current_user.recipes }.to_json
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :source_url)
  end
end

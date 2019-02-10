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

  def update
    if @recipe = @current_user.recipes.find(params[:id])
      if @recipe.update(recipe_params)
        render json: RecipeSerializer.new(@recipe)
      else
        render json: { error: @recipe.errors.full_messages.first }, status: :bad_request
      end
    else
      render status: :not_found
    end
  end

  def index
    render json: RecipeSerializer.new(@current_user.recipes)
  end

  def show
    if @recipe = @current_user.recipes.find(params[:id])
      render json: RecipeSerializer.new(@recipe)
    else
      render status: :not_found
    end
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :source_url)
  end
end

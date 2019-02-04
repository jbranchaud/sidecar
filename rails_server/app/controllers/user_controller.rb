class UserController < ApiController
  def show
    render json: {email: @current_user.email}.to_json
  end
end

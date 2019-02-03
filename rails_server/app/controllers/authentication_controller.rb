class AuthenticationController < ApiController
  skip_before_action :check_authentication, only: [:sign_up, :sign_in]

  def sign_in
    command = AuthenticateUser.new(params[:email], params[:password])

    if token = command.call
      response.set_header('AUTHORIZATION', "Bearer #{token}")
      render json: {email: params[:email], token: token, valid_pass: true}.to_json
    else
      render json: {email: params[:email], valid_pass: false}.to_json
    end
  end

  def sign_up
    @user = User.new(user_params)

    if @user.save
      render json: {success: true, message: "You successfully signed up!"}
    else
      render json: {success: false, message: "You failed to sign up!"}
    end
  end

  private

  def user_params
    puts params
    params.permit(:email, :password, :password_confirmation)
  end
end

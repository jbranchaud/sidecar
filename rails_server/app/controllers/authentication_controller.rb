class AuthenticationController < ApiController
  def check_password
    command = AuthenticateUser.new(params[:email], params[:password])

    if token = command.call
      render json: {email: params[:email], token: token, valid_pass: true}.to_json
    else
      render json: {email: params[:email], valid_pass: false}.to_json
    end
  end

  def sign_up
    @user = User.new(user_params)
    @user.password = user_params[:password]

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

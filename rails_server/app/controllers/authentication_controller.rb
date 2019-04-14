class AuthenticationController < ApiController
  skip_before_action :check_authentication,
    only: [:sign_up, :sign_in]

  def sign_in
    user_auth = UserAuthentication.sign_in(sign_in_params[:email], sign_in_params[:password])

    if user_auth.token
      response.set_header('AUTHORIZATION', "Bearer #{user_auth.token}")
      render json: {email: user_auth.user.email, token: user_auth.token, valid_pass: true}.to_json
    else
      render json: {email: params[:email], error: user_auth.error, valid_pass: false}.to_json
    end
  end

  def sign_up
    user_auth = UserAuthentication.sign_up(sign_up_params)

    if user_auth.token
      response.set_header('AUTHORIZATION', "Bearer #{user_auth.token}")
      render json: {success: true, message: "You successfully signed up!"}
    else
      render json: {success: false, message: user_auth.error}
    end
  end

  private

  def sign_in_params
    params.permit(:email, :password)
  end

  def sign_up_params
    params.permit(:email, :password, :password_confirmation)
  end
end

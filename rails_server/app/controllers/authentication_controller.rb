class AuthenticationController < ApiController
  skip_before_action :check_authentication,
    only: [:sign_up, :sign_in, :request_password_reset_link, :reset_password]

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

  def request_password_reset_link
    if user = User.find_by(email: params[:email])
      reset_token = SecureRandom.uuid

      token_record = PasswordResetToken.new(reset_token: reset_token, user_id: user.id)
      if token_record.save!
        render json: { reset_token: reset_token }.to_json, status: 200
      else
        render status: :bad_request
      end
    else
      render status: :not_found
    end
  end

  def reset_password
    user = find_user_by_reset_token!(params[:reset_token])
    if user.update(password: params[:password], password_confirmation: params[:password_confirmation])
      json_response({}, :ok)
    else
      json_response({}, :bad_request)
    end
  rescue ActiveRecord::RecordNotFound => e
    json_response({}, :not_found)
  end

  private

  def find_user_by_reset_token!(reset_token)
    # TODO: Figure out why the join query is slower than these two combined
    # reset_record = PasswordResetToken.find_by!(reset_token: reset_token)
    # User.find(reset_record.user_id)
    User.joins(:password_reset_token)
      .where({ password_reset_tokens: {reset_token: reset_token}})
      .first!
  end

  def sign_in_params
    params.permit(:email, :password)
  end

  def sign_up_params
    params.permit(:email, :password, :password_confirmation)
  end
end

class PasswordResetController < ApiController
  skip_before_action :check_authentication,
    only: [:request_password_reset_link, :reset_password]

  def request_password_reset_link
    if user_with_token = find_user_with_fresh_reset_token!(get_email_param)
      PasswordResetMailer
        .send_default_email(user_with_token, user_with_token.password_reset_token)
    end

    json_response({}, :ok)
  rescue ActionController::ParameterMissing => e
    json_response({}, :bad_request)
  end

  def reset_password
    if attempt_password_reset(params[:reset_token])
      json_response({}, :ok)
    else
      json_response({}, :bad_request)
    end
  rescue ActiveRecord::RecordNotFound => e
    json_response({}, :not_found)
  end

  private

  def attempt_password_reset(reset_token)
    user = find_user_by_reset_token!(params[:reset_token])
    if user.update(reset_password_params)
      user.password_reset_token.delete
      user
    end
  end

  def find_user_by_reset_token!(reset_token)
    # TODO: Figure out why the join query is slower than these two combined
    # reset_record = PasswordResetToken.find_by!(reset_token: reset_token)
    # User.find(reset_record.user_id)
    User.joins(:password_reset_token)
      .where({ password_reset_tokens: {reset_token: reset_token}})
      .first!
  end

  def find_user_with_fresh_reset_token!(email)
    if user = User.find_by(email: email)
      PasswordResetToken.regenerate_token_for(user)
      user
    end
  end

  def get_email_param
    params.require(:email)
  end

  def reset_password_params
    params.permit(:password, :password_confirmation)
  end
end

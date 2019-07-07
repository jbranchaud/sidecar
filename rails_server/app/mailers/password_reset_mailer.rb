class PasswordResetMailer < ApplicationMailer
  def self.send_default_email(user, reset_token)
    default_email(user, reset_token).deliver_later
  end

  def default_email(user, reset_token)
    @user = user
    @password_reset_url = "http://localhost:3000/password-reset/#{reset_token}"

    mail(to: @user.email, subject: 'Password Reset Link')
  end
end

class PasswordResetMailer < ApplicationMailer
  def self.send_default_email(user, reset_record)
    default_email(user, reset_record.reset_token).deliver_later
  end

  def default_email(user, reset_record)
    @user = user
    @password_reset_url = "http://localhost:3000/password-reset/#{reset_record.reset_token}"

    mail(to: @user.email, subject: 'Password Reset Link')
  end
end

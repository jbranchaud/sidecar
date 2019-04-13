class PasswordResetMailer < ApplicationMailer
  def default_email(user, reset_record)
    @user = user
    @reset_record = reset_record

    mail(to: @user.email, subject: 'Password Reset Link')
  end
end

class PasswordResetMailer < ApplicationMailer
  def default_email
    @user = params[:user]
    @reset_record = params[:reset_record]

    mail(to: @user.email, subject: 'Password Reset Link')
  end
end

class PasswordResetToken < ApplicationRecord
  def self.regenerate_token_for(user)
    reset_token = SecureRandom.uuid

    ActiveRecord::Base.transaction do
      user.password_reset_token.try(:destroy)
      user.create_password_reset_token(reset_token: reset_token)
    end
  end
end

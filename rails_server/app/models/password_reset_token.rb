class PasswordResetToken < ApplicationRecord
  def self.regenerate_token_for(user)
    raise ActiveRecord::RecordNotFound unless user

    reset_token = SecureRandom.uuid

    ActiveRecord::Base.transaction do
      user.password_reset_token.try(:destroy)
      user.create_password_reset_token(
        reset_token: reset_token,
        expires_at: Time.now + 15.minutes
      )
    end
  end
end

require 'rails_helper'

describe PasswordResetToken do
  describe '.regenerate_token_for' do
    let(:user) { User.create(email: 'user@example.com', password: 'password') }

    context 'given a user with no existing password_reset_token' do
      it 'updates the user with a new password_reset_token' do
        expect(user.password_reset_token).to be_nil

        PasswordResetToken.regenerate_token_for(user)

        expect(user.password_reset_token).to be
      end
    end

    context 'given a user with an existing password_reset_token' do
      it 'updates the user with a new password_reset_token' do
        original_reset_token = SecureRandom.uuid
        user.create_password_reset_token(reset_token: original_reset_token, expires_at: Time.now)

        PasswordResetToken.regenerate_token_for(user)

        new_reset_token = user.password_reset_token.reset_token
        expect(new_reset_token).to be
        expect(new_reset_token).to_not eq(original_reset_token)
      end
    end
  end
end

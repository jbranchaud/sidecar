require 'rails_helper'

describe UserWithPasswordResetToken do
  describe '#new' do
    context 'given a valid email' do
      it 'returns a user and token' do
        user = User.create(email: 'user@example.com', password: 'password')

        user_with_token = UserWithPasswordResetToken.new(user.email)

        expect(user_with_token.user.email).to eq(user.email)
        expect(user_with_token.token_record.reset_token).to eq(user.password_reset_token.reset_token)

        expect(PasswordResetToken.count).to eq(1)
      end

      it 'returns a new token each time it is called' do
        user = User.create(email: 'user@example.com', password: 'password')

        user_with_token = UserWithPasswordResetToken.new(user.email)

        first_token = user_with_token.token_record.reset_token
        expect(first_token).to eq(user.password_reset_token.reset_token)

        user_with_token = UserWithPasswordResetToken.new(user.email)

        new_token = user_with_token.token_record.reset_token
        expect(new_token).to_not eq(first_token)

        expect(PasswordResetToken.count).to eq(1)
      end
    end

    context 'given an invalid email' do
      it 'returns nil' do
        invalid_email = "nonexistant@example.com"

        user_with_token = UserWithPasswordResetToken.new(invalid_email)

        expect(user_with_token).to be_nil

        expect(PasswordResetToken.count).to eq(0)
      end
    end
  end
end

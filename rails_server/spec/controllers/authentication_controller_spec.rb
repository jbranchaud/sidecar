require 'rails_helper'

describe AuthenticationController do
  describe 'POST #request_password_reset_link' do
    context 'when user email is valid' do
      it 'responds with a 200 and UUID token' do
        user = User.new(email: "user1@example.com", password: "password")
        user.save!

        post :request_password_reset_link, params: { email: user.email, format: :json}

        expect(response.status).to eq(200)

        body = JSON.parse(response.body)
        expect(body["reset_token"]).to be
      end
    end

    context 'when user email is not found' do
      it 'responds with a 404' do
        post :request_password_reset_link, params: { email: "nonexistant@example.com", format: :json}

        expect(response.status).to eq(404)
      end
    end
  end
end

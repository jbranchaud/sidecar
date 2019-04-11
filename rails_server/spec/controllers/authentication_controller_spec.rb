require "rails_helper"

describe AuthenticationController do
  describe "POST #request_password_reset_link" do
    context "when user email is valid" do
      it "responds with a 200 and UUID token" do
        user = User.create(email: "user1@example.com", password: "password")

        post :request_password_reset_link,
          params: {email: user.email, format: :json}

        expect(response.status).to eq(200)

        body = JSON.parse(response.body)
        expect(body["reset_token"]).to be
      end
    end

    context "when user email is not found" do
      it "responds with a 404" do
        post :request_password_reset_link,
          params: {email: "nonexistant@example.com", format: :json}

        expect(response.status).to eq(404)
      end
    end
  end

  describe "PUT #reset_password" do
    let(:user) {
      User.create(email: "user1@example.com", password: "password")
    }
    let(:reset_token) {
      reset_token = SecureRandom.uuid
      PasswordResetToken.create(user_id: user.id, reset_token: reset_token)
      reset_token
    }
    let(:new_password) { "new_password" }

    context "when reset token is valid" do
      it "responds with a 200 and updates the user's password" do
        put :reset_password,
          params: {
            reset_token: reset_token,
            password: new_password,
            password_confirmation: new_password,
            format: :json,
          }

        expect(response.status).to eq(200)
        expect(response.body).to eq("{}")

        expect(user.reload.authenticate(new_password)).to be_truthy
      end
    end

    context "when reset token is valid and passwords do not match" do
      it "responds with a 400" do
        mismatched_password = "mismatched_password"

        put :reset_password,
          params: {
            reset_token: reset_token,
            password: new_password,
            password_confirmation: mismatched_password,
            format: :json,
          }

        expect(response.status).to eq(400)
        expect(response.body).to eq("{}")
      end
    end

    context "when reset token is invalid" do
      it "responds with a 404" do
        some_token = SecureRandom.uuid

        put :reset_password, params: {
          reset_token: some_token,
          password: new_password,
          password_confirmation: new_password,
          format: :json,
        }

        expect(response.status).to eq(404)
        expect(response.body).to eq("{}")
      end
    end
  end
end

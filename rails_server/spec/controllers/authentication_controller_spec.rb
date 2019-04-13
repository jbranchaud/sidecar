require "rails_helper"
include ActionMailer::TestHelper

describe AuthenticationController do
  describe "POST #request_password_reset_link" do
    before(:each) do
      ActionMailer::Base.deliveries.clear
    end

    context "when user email is valid" do
      it "responds with a 200 and an email is sent" do
        user_email = "user1@example.com"
        user = User.create(email: user_email, password: "password")

        message_delivery = instance_double(ActionMailer::MessageDelivery)
        expect(PasswordResetMailer).to receive(:default_email).and_return(message_delivery)
        allow(message_delivery).to receive(:deliver_later)

        post :request_password_reset_link,
          params: {email: user.email, format: :json}

        expect(response.status).to eq(200)
        expect(response.body).to eq("{}")
      end
    end

    context "when user email is not found" do
      it "responds with a 200 and no email sent" do
        post :request_password_reset_link,
          params: {email: "nonexistant@example.com", format: :json}

        expect(response.status).to eq(200)
        expect(response.body).to eq("{}")
        expect(ActionMailer::Base.deliveries).to be_empty
      end
    end

    context "when user email is not provided" do
      it "responds with a 400" do
        post :request_password_reset_link,
          params: {foo: "bar", format: :json}

        expect(response.status).to eq(400)
        expect(response.body).to eq("{}")
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

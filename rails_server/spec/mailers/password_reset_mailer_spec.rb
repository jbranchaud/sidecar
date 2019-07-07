require "rails_helper"

RSpec.describe PasswordResetMailer, type: :mailer do
  describe ".send_default_email" do
    let(:user) {
      User.create(email: "user1@example.com", password: "password")
    }
    let(:reset_token) {
      token_record = PasswordResetToken.regenerate_token_for(user)
      token_record.reset_token
    }
    let(:mail) { PasswordResetMailer.default_email(user, reset_token) }

    it "renders the headers" do
      expect(mail.subject).to eq("Password Reset Link")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["support@sidecar.com"])
    end

    it "renders the body" do
      body = mail.body.encoded

      expect(body).to match("Hi, #{user.email}")
      expect(body).to match("click on this link to reset your password")
    end
  end
end

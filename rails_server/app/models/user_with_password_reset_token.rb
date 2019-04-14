class UserWithPasswordResetToken
  attr_reader :user, :token_record

  def self.new(email)
    instance = super(email)

    if instance.try(:user) && instance.try(:token_record)
      instance
    end
  end

  def initialize(email)
    if @user = User.find_by(email: email)
      reset_token = SecureRandom.uuid

      ActiveRecord::Base.transaction do
        @user.password_reset_token.try(:destroy)
        @token_record =
          PasswordResetToken.create!(
            reset_token: reset_token,
            user_id: user.id
        )
      end
    end
  end
end

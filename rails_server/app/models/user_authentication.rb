class UserAuthentication
  attr_reader :token, :user, :error

  def self.sign_in(email, password)
    new.sign_in(email, password)
  end

  def self.sign_up(user_params)
    new.sign_up(user_params)
  end

  def sign_up(user_params)
    @user = User.new(user_params)

    if @user.save
      @token = JsonWebToken.encode({ email: @user.email })
    else
      @error = @user.errors.full_messages.first
    end

    self
  end

  def sign_in(email, password)
    @user = User.authenticate(email, password)
    if @user
      @token = JsonWebToken.encode({ email: email })
    else
      @error = "The email and password did not match"
    end

    self
  end
end

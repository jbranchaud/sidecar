class UserAuthentication
  attr_reader :token, :user, :error

  def self.sign_in(email, password)
    new.sign_in(email, password)
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

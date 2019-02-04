class UserAuthentication
  attr_reader :token, :user, :error

  def initialize(email, password)
    @email = email
    @password = password
  end

  def self.sign_in(email, password)
    user_auth = new(email, password)

    user_auth.sign_in

    user_auth
  end

  def sign_in
    @user = User.authenticate(@email, @password)
    if @user
      @token = JsonWebToken.encode({ email: @email })
    else
      @error = "The email and password did not match"
    end
  end
end

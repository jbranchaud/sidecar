class AuthenticateUser
  def initialize(email, password)
    @email = email
    @password = password
  end

  def call
    if user = User.authenticate(@email, @password)
      return JsonWebToken.encode({ email: @email })
    else
      # errors.add(:authentication, "The email and password did not match")
    end

    nil
  end
end

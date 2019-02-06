class UserAuthentication
  attr_reader :token, :user, :error

  def self.sign_in(email, password)
    new.sign_in(email, password)
  end

  def self.sign_up(user_params)
    new.sign_up(user_params)
  end

  def self.check_auth_token(headers = {})
    new.check_auth_token(headers)
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

  def check_auth_token(headers)
    if headers['Authorization'].present?
      http_auth_header = headers['Authorization'].split(' ').last

      if decoded_auth_token = JsonWebToken.decode(http_auth_header)
        if @user = User.find_by(email: decoded_auth_token[:email])
          @token = http_auth_header
        else
          @error = "The auth token is invalid"
        end
      else
        @error = "The auth token is invalid"
      end
    else
      @error = "The auth token was missing"
    end

    self
  end
end

class JsonWebToken
  class << self
    HASH_ALGO = "HS256"

    def encode(payload, exp = 30.minutes.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, Rails.application.credentials.secret_key_base, HASH_ALGO)
    end

    def decode(token)
      body = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: HASH_ALGO })[0]
      HashWithIndifferentAccess.new(body)
    rescue
      nil
    end
  end
end

require 'bcrypt'

class User < ApplicationRecord
  include BCrypt

  attr_accessor :password

  validates :email, presence: true, uniqueness: true
  validates :password, confirmation: true

  def self.authenticate(email, password)
    user = User.find_by(email: email)

    if user && user.check_password(password)
      user
    else
      nil
    end
  end

  def check_password(given_password)
    Password.new(encrypted_password) == given_password
  end

  def password=(new_password)
    @password = new_password
    self.encrypted_password = Password.create(new_password)
  end
end

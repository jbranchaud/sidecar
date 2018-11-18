require 'bcrypt'

class User < ApplicationRecord
  include BCrypt

  attr_accessor :password

  validates :email, presence: true, uniqueness: true
  validates :password, confirmation: true

  def check_password(given_password)
    Password.new(encrypted_password) == given_password
  end

  def password=(new_password)
    @password = new_password
    self.encrypted_password = Password.create(new_password)
  end
end

class User < ApplicationRecord
  has_secure_password

  has_many :recipes
  has_one :password_reset_token

  validates :email, presence: true, uniqueness: true

  def self.authenticate(email, password)
    User.find_by(email: email).try(:authenticate, password)
  end
end

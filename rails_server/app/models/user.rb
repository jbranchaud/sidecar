class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true

  def self.authenticate(email, password)
    User.find_by(email: email).try(:authenticate, password)
  end
end

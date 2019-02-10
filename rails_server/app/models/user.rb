class User < ApplicationRecord
  has_secure_password

  has_many :recipes

  validates :email, presence: true, uniqueness: true

  def self.authenticate(email, password)
    User.find_by(email: email).try(:authenticate, password)
  end
end

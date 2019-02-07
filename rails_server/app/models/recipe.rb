class Recipe < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :source_url, presence: true
end

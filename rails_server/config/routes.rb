Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  scope '/api' do
    post '/sign_up', to: 'authentication#sign_up'
    post '/sign_in', to: 'authentication#sign_in'
    get  '/user', to: 'user#show'
    post '/request_password_reset', to: 'password_reset#request_password_reset_link'
    put '/reset_password', to: 'password_reset#reset_password'

    resources :recipes
  end
end

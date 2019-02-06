class ApiController < ActionController::API
  before_action :check_authentication
  attr_reader :current_user

  private

  def check_authentication
    user_auth = UserAuthentication.check_auth_token(request.headers)

    @current_user = user_auth.user
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end

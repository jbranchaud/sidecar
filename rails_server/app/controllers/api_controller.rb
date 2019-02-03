class ApiController < ActionController::API
  before_action :check_authentication
  attr_reader :current_user

  private

  def check_authentication
    @current_user = AuthenticateApiRequest.new(request.headers).call
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end

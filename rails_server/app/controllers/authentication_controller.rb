class AuthenticationController < ApiController
  def check_password
    @user = User.find_by(email: params[:email])

    puts "controller pass: #{params[:password]}"

    if @user.check_password(params[:password])
      render json: {email: params[:email], valid_pass: true}.to_json
    else
      render json: {email: params[:email], valid_pass: false}.to_json
    end
  end
end

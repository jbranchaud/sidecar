ActiveAdmin.register User do
  permit_params :id, :email, :password, :password_confirmation, :created_at,
    :updated_at

  controller do
    def new
      @user = User.new
    end

    def create
      @user = User.new(permitted_params[:user])
      @user.password = permitted_params[:user][:password]

      if @user.save
        flash[:notice] = "User registration succeeded"
        flash[:color] = "valid"

        redirect_to [:admin, @user]
      else
        flash[:notice] = "User registration failed"
        flash[:color] = "invalid"

        render "new"
      end
    end
  end

  form title: 'Create New User' do |f|
    inputs 'Details' do
      input :email
      input :password, type: :password
      input :password_confirmation, type: :password
    end
    actions
  end
end

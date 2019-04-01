class CreateResetPasswordTokenTable < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      create table password_reset_tokens (
        reset_token uuid primary key,
        user_id integer not null references users(id),
        created_at timestamptz not null default now()
      );
    SQL
  end

  def down
    execute <<-SQL
      drop table password_reset_tokens;
    SQL
  end
end

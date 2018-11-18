class CreateUserTable < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      create table users(
        id serial primary key,
        email varchar not null,
        encrypted_password varchar not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (email)
      );
    SQL
  end

  def down
    execute <<-SQL
      drop table users;
    SQL
  end
end

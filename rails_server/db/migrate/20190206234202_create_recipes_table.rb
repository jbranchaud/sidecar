class CreateRecipesTable < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      create table recipes (
        id serial primary key,
        name varchar not null,
        source_url varchar not null,
        user_id integer references users,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    SQL
  end

  def down
    execute <<-SQL
      drop table recipes;
    SQL
  end
end

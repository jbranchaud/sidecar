class CreateIngredientsTable < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      create table ingredients (
        id serial primary key,
        name varchar not null,
        description text not null default 'No Description',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    SQL
  end

  def down
    execute <<-SQL
      drop table ingredients;
    SQL
  end
end

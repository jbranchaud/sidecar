class AddCompositeUniqueConstraintToPasswordResetTokens < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      -- remove older duplicates, in order to add unique constraint
      -- http://www.postgresqltutorial.com/how-to-delete-duplicate-rows-in-postgresql/
      delete from password_reset_tokens a
        using password_reset_tokens b
        where a.user_id = b.user_id
          and a.created_at < b.created_at;

      alter table password_reset_tokens
        add constraint password_reset_tokens_unique_user_id unique (user_id);
    SQL
  end

  def down
    execute <<-SQL
      alter table password_reset_tokens
        drop constraint password_reset_tokens_unique_user_id;
    SQL
  end
end

class AddExpiresAtColumnToPasswordResetTokens < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      alter table password_reset_tokens
        add column expires_at timestamptz;

      update password_reset_tokens
        set expires_at = now() + interval '15 minutes';

      alter table password_reset_tokens
        alter column expires_at set not null;
    SQL
  end

  def down
    execute <<-SQL
      alter table password_reset_tokens
        drop column expires_at;
    SQL
  end
end

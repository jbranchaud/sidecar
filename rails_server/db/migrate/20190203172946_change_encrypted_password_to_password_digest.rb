class ChangeEncryptedPasswordToPasswordDigest < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      alter table users add column password_digest varchar;

      update users set password_digest = encrypted_password;

      alter table users alter column password_digest set not null;

      alter table users drop column encrypted_password;
    SQL
  end

  def down
    execute <<-SQL
      alter table users add column encrypted_password varchar;

      update users set encrypted_password = password_digest;

      alter table users alter column encrypted_password set not null;

      alter table users drop column password_digest;
    SQL
  end
end

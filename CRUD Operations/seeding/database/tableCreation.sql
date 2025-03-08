CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  modified_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL -- Add trigger to update in later point
);

insert into users (user_name, email, first_name, last_name) values ("John Doe", "johndoe@mail.com", "John", "Doe");
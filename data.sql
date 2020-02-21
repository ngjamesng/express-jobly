CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees int,
  description text,
  logo_url text
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL CHECK(equity <= 1.0),
  company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
  date_posted TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL, 
  first_name varchar(80) NOT NULL,
  last_name varchar(80) NOT NULL,
  email varchar(70) UNIQUE NOT NULL,
  photo_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
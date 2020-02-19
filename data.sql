CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees int,
  description text,
  logo_url text
);

-- CREATE TABLE jobs (

-- )

-- CREATE TABLE users (

-- )
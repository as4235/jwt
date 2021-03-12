CREATE DATABASE jwt;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_name varchar(255) NOT NULL,
     user_email varchar(255) NOT NULL,
     user_password varchar(255) NOT NULL
);

-- inserting fake entries

INSERT INTO users(user_name, user_email, user_password)
VALUES ('Ajay', 'a@a', 'a');
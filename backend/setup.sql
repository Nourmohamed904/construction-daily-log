CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'manager',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  site_name VARCHAR(150) NOT NULL,
  report_date DATE NOT NULL,
  workers_present INTEGER NOT NULL,
  tasks_completed TEXT NOT NULL,
  issues_encountered TEXT,
  weather_condition VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
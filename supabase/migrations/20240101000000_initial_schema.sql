-- Create tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE,
  is_admin BOOLEAN DEFAULT false
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hour TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE schedule_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Set up row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by users who created them." ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Employees are viewable by authenticated users." ON employees FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Employees are insertable by admins." ON employees FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Time slots are viewable by authenticated users." ON time_slots FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Time slots are insertable by admins." ON time_slots FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Schedule entries are viewable by authenticated users." ON schedule_entries FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Schedule entries are insertable by authenticated users." ON schedule_entries FOR INSERT
  TO authenticated WITH CHECK (true);

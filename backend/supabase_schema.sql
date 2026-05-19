-- Supabase SQL Migration Script for Uzafo Service

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'web', 'bot', 'mobile', 'llm', 'other'
    payment_cycle TEXT NOT NULL, -- 'monthly', 'annual'
    lead JSONB NOT NULL DEFAULT '{}'::jsonb, -- { name, phone }
    server JSONB NOT NULL DEFAULT '{}'::jsonb, -- { email, password, location }
    repos JSONB NOT NULL DEFAULT '{}'::jsonb, -- { frontend, backend }
    hosting JSONB NOT NULL DEFAULT '{}'::jsonb, -- { frontend, backend }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    amount BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'UZS',
    cycle TEXT NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Messages Table (Contact Form)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (For now, allow all authenticated access)
-- Note: Adjust these based on your security needs
CREATE POLICY "Allow all for authenticated users on clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users on payments" ON payments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users on messages" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Special policy for messages (Allow anyone to INSERT for contact form)
CREATE POLICY "Allow anonymous insert on messages" ON messages FOR INSERT WITH CHECK (true);

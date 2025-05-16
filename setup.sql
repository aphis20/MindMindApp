-- Create tables
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE circles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    emotion_tag TEXT
);

CREATE TABLE circle_members (
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    role TEXT CHECK (role IN ('member', 'moderator', 'admin')) DEFAULT 'member' NOT NULL,
    PRIMARY KEY (circle_id, profile_id)
);

CREATE TABLE journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    emotion TEXT,
    is_private BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE NOT NULL,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    emotion TEXT
);

-- Create indexes for better query performance
CREATE INDEX circles_creator_id_idx ON circles(creator_id);
CREATE INDEX journal_entries_author_id_idx ON journal_entries(author_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_circle_id_idx ON messages(circle_id);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Circles: Public circles are viewable by everyone, private circles only by members
CREATE POLICY "Public circles are viewable by everyone"
    ON circles FOR SELECT
    USING (NOT is_private OR EXISTS (
        SELECT 1 FROM circle_members
        WHERE circle_members.circle_id = circles.id
        AND circle_members.profile_id = auth.uid()
    ));

CREATE POLICY "Users can create circles"
    ON circles FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Circle creators and admins can update circles"
    ON circles FOR UPDATE
    USING (
        auth.uid() = creator_id OR
        EXISTS (
            SELECT 1 FROM circle_members
            WHERE circle_members.circle_id = circles.id
            AND circle_members.profile_id = auth.uid()
            AND circle_members.role = 'admin'
        )
    );

-- Circle members: Members can view their circles
CREATE POLICY "Members can view their circle memberships"
    ON circle_members FOR SELECT
    USING (true);

-- Journal entries: Private entries are only viewable by the author
CREATE POLICY "Users can view their own journal entries"
    ON journal_entries FOR SELECT
    USING (
        CASE
            WHEN is_private THEN author_id = auth.uid()
            ELSE true
        END
    );

CREATE POLICY "Users can create their own journal entries"
    ON journal_entries FOR INSERT
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own journal entries"
    ON journal_entries FOR UPDATE
    USING (author_id = auth.uid());

-- Messages: Members can view and create messages in their circles
CREATE POLICY "Circle members can view messages"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM circle_members
            WHERE circle_members.circle_id = messages.circle_id
            AND circle_members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Circle members can create messages"
    ON messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM circle_members
            WHERE circle_members.circle_id = NEW.circle_id
            AND circle_members.profile_id = auth.uid()
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 
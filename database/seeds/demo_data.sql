-- Clear existing
TRUNCATE TABLE users, teams, team_members, messages, message_sentiments, team_sentiment_metrics, team_health_metrics, tasks, polls, poll_votes, kudos, team_activities, activity_participants, notifications, consent_settings, audit_logs, icebreaker_questions CASCADE;

-- Insert 5 users
INSERT INTO users (id, email, full_name, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@jelling.com', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKFe.Kn7p5sXJ1e', 'admin'),
('22222222-2222-2222-2222-222222222222', 'alice@example.com', 'Alice Johnson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKFe.Kn7p5sXJ1e', 'team_lead'),
('33333333-3333-3333-3333-333333333333', 'bob@example.com', 'Bob Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKFe.Kn7p5sXJ1e', 'employee'),
('44444444-4444-4444-4444-444444444444', 'carol@example.com', 'Carol Davis', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKFe.Kn7p5sXJ1e', 'employee'),
('55555555-5555-5555-5555-555555555555', 'dave@example.com', 'Dave Wilson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKFe.Kn7p5sXJ1e', 'employee');

-- Insert 2 teams
INSERT INTO teams (id, name, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backend Squad', 'The core platform team'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Frontend Crew', 'The UI/UX specialists');

-- Memberships
INSERT INTO team_members (team_id, user_id, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'lead'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'member');

-- Messages
INSERT INTO messages (id, team_id, sender_id, content) VALUES
('m1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'I am really happy with today''s progress!'),
('m2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Let''s continue with the plan.'),
('m3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'I am overwhelmed with the amount of work this week.'),
('m4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'This is getting frustrating, nothing is working.');

-- Sentiments
INSERT INTO message_sentiments (message_id, label, score) VALUES
('m1111111-1111-1111-1111-111111111111', 'positive', 0.95),
('m2222222-2222-2222-2222-222222222222', 'neutral', 0.80),
('m3333333-3333-3333-3333-333333333333', 'stressed', 0.85),
('m4444444-4444-4444-4444-444444444444', 'frustrated', 0.90);

-- Metrics
INSERT INTO team_sentiment_metrics (team_id, date, avg_score, dominant_label) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 0.85, 'positive'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 0.60, 'stressed');

INSERT INTO team_health_metrics (team_id, date, overall_score, stress_level, engagement_level) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 85.0, 30.0, 90.0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 60.0, 75.0, 50.0);

-- Tasks
INSERT INTO tasks (team_id, assignee_id, creator_id, title, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Fix database bug', 'todo');

-- Polls
INSERT INTO polls (team_id, creator_id, question, options) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'When should we have our retro?', '["Monday", "Tuesday", "Wednesday"]');

-- Kudos
INSERT INTO kudos (sender_id, receiver_id, team_id, message) VALUES
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Great leadership on the latest release!');

-- Activities
INSERT INTO team_activities (team_id, creator_id, title, type, scheduled_for) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Friday Game Night', 'game', CURRENT_TIMESTAMP + INTERVAL '2 days');

-- Icebreakers
INSERT INTO icebreaker_questions (question) VALUES
('What is one skill you''d like to learn this year?'),
('What was your most memorable project?'),
('What motivates you when work gets tough?'),
('If you could work from anywhere in the world, where would it be?'),
('What''s your favorite way to unwind after a long day?'),
('Share a book or podcast that changed how you think.'),
('What''s one thing your teammates might not know about you?'),
('What does your ideal team look like?'),
('What technology trend excites you most?'),
('How do you prefer to receive feedback?');

-- Consent settings
INSERT INTO consent_settings (user_id, sentiment_tracking, activity_tracking)
SELECT id, true, true FROM users;

-- Notifications
INSERT INTO notifications (user_id, type, title, content) VALUES
('33333333-3333-3333-3333-333333333333', 'message', 'New message from Alice', 'Please review the PR.');

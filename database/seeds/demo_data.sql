-- Clear existing
TRUNCATE TABLE users, teams, team_members, messages, message_sentiments, team_sentiment_metrics, team_health_metrics, tasks, polls, poll_votes, kudos, team_activities, activity_participants, notifications, consent_settings, audit_logs, icebreaker_questions CASCADE;

-- 1. Insert 5 users
-- Password for all is: password123 (bcrypt hash)
INSERT INTO users (id, email, username, full_name, hashed_password, role, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@jelling.com', 'admin', 'Admin User', '$2b$12$ADPtcOBWqWqJu46Z4aYtV.Wu.DtdFAfondWltxEerBomKhGrrzOyC', 'admin', true),
('22222222-2222-2222-2222-222222222222', 'alice@example.com', 'alice', 'Alice Johnson', '$2b$12$ADPtcOBWqWqJu46Z4aYtV.Wu.DtdFAfondWltxEerBomKhGrrzOyC', 'team_lead', true),
('33333333-3333-3333-3333-333333333333', 'bob@example.com', 'bob', 'Bob Smith', '$2b$12$ADPtcOBWqWqJu46Z4aYtV.Wu.DtdFAfondWltxEerBomKhGrrzOyC', 'employee', true),
('44444444-4444-4444-4444-444444444444', 'carol@example.com', 'carol', 'Carol Davis', '$2b$12$ADPtcOBWqWqJu46Z4aYtV.Wu.DtdFAfondWltxEerBomKhGrrzOyC', 'employee', true),
('55555555-5555-5555-5555-555555555555', 'dave@example.com', 'dave', 'Dave Wilson', '$2b$12$ADPtcOBWqWqJu46Z4aYtV.Wu.DtdFAfondWltxEerBomKhGrrzOyC', 'employee', true);

-- 2. Insert 2 teams
INSERT INTO teams (id, name, description, invite_code, created_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backend Squad', 'The core platform team', 'INV-BACKEND', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Frontend Crew', 'The UI/UX specialists', 'INV-FRONTEND', '22222222-2222-2222-2222-222222222222');

-- 3. Memberships
INSERT INTO team_members (team_id, user_id, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'lead'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'member');

-- 4. Messages
INSERT INTO messages (id, team_id, sender_id, content, message_type) VALUES
('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'I am really happy with today''s progress!', 'team'),
('a2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Let''s continue with the plan.', 'team'),
('a3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'I am overwhelmed with the amount of work this week.', 'team'),
('a4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'This is getting frustrating, nothing is working.', 'team');

-- 5. Sentiments
INSERT INTO message_sentiments (message_id, sentiment, confidence, model_version) VALUES
('a1111111-1111-1111-1111-111111111111', 'positive', 0.95, 'distilbert-base-uncased-finetuned-sst-2-english'),
('a2222222-2222-2222-2222-222222222222', 'neutral', 0.80, 'distilbert-base-uncased-finetuned-sst-2-english'),
('a3333333-3333-3333-3333-333333333333', 'stressed', 0.85, 'distilbert-base-uncased-finetuned-sst-2-english'),
('a4444444-4444-4444-4444-444444444444', 'frustrated', 0.90, 'distilbert-base-uncased-finetuned-sst-2-english');

-- 6. Metrics
INSERT INTO team_sentiment_metrics (team_id, date, positive_count, neutral_count, stressed_count, frustrated_count, negative_count, total_analyzed, avg_confidence) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 1, 1, 0, 0, 0, 2, 0.875),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 0, 0, 1, 1, 0, 2, 0.875);

INSERT INTO team_health_metrics (team_id, date, health_score, sentiment_score, engagement_score, activity_score, stress_ratio, frustration_ratio, message_count, active_members) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 85.0, 0.75, 1.0, 0.04, 0.0, 0.0, 2, 2),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 45.0, -0.70, 1.0, 0.04, 0.5, 0.5, 2, 2);

-- 7. Tasks
INSERT INTO tasks (team_id, created_by, assigned_to, title, description, status, priority) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Fix database bug', 'Optimize query performance and connection pooling', 'todo', 'high');

-- 8. Polls
INSERT INTO polls (id, team_id, created_by, question, options, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'When should we have our sprint retro?', '["Monday 3 PM", "Tuesday 11 AM", "Wednesday 4 PM"]'::jsonb, true);

-- 9. Kudos
INSERT INTO kudos (team_id, from_user_id, to_user_id, message, emoji) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Great leadership on the latest release!', '??');

-- 10. Activities
INSERT INTO team_activities (team_id, created_by, title, description, activity_type, scheduled_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Friday Game Night', 'Virtual board games and casual chat', 'game', CURRENT_TIMESTAMP + INTERVAL '2 days');

-- 11. Icebreakers
INSERT INTO icebreaker_questions (question, category) VALUES
('What is one skill you''d like to learn this year?', 'Personal Growth'),
('What was your most memorable project?', 'Work & Career'),
('What motivates you when work gets tough?', 'Mindset'),
('If you could work from anywhere in the world, where would it be?', 'Fun & Lifestyle'),
('What''s your favorite way to unwind after a long day?', 'Wellbeing'),
('Share a book or podcast that changed how you think.', 'Inspiration'),
('What''s one thing your teammates might not know about you?', 'Fun & Lifestyle'),
('What does your ideal team look like?', 'Teamwork'),
('What technology trend excites you most?', 'Tech & Future'),
('How do you prefer to receive feedback?', 'Communication');

-- 12. Consent settings
INSERT INTO consent_settings (user_id, sentiment_analysis_enabled, data_retention_days)
SELECT id, true, 90 FROM users;

-- 13. Notifications
INSERT INTO notifications (user_id, title, body, notification_type, is_read) VALUES
('33333333-3333-3333-3333-333333333333', 'New Message', 'Alice: Please review the latest PR.', 'message', false);

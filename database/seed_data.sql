-- ============================================================
-- CITIZEN ISSUE REPORTER - SEED DATA
-- Default Demo Credentials:
-- Citizen: citizen@demo.local / DemoPass123!
-- Officer: officer@demo.local / DemoPass123!
-- Admin:   admin@demo.local   / DemoPass123!
-- ============================================================

-- Categories
INSERT INTO categories (name, description, icon, active) VALUES
('Potholes & Road Damage', 'Damaged asphalt, craters, dangerous road cracks, or missing manhole covers', 'road', 1),
('Garbage & Waste', 'Overflowing public bins, uncollected curbside waste, littered streets', 'trash', 1),
('Water Leakage', 'Broken municipal pipelines, continuous water waste, tap leakages', 'water', 1),
('Broken Street Lights', 'Dark streets, flickering lamps, broken fixtures, exposed wiring', 'lightbulb', 1),
('Drainage Problems', 'Blocked gutters, waterlogging, overflowing sewage lines', 'drain', 1),
('Illegal Dumping', 'Unauthorized dumping of debris, chemical waste, hazardous materials', 'dumping', 1),
('Other Civic Issues', 'Encroachment, damaged public benches, park maintenance, etc.', 'other', 1);

-- Departments
INSERT INTO departments (name, description, active) VALUES
('Roads & Infrastructure', 'Handles potholes, pavements, traffic signs, and municipal bridges', 1),
('Waste Management & Sanitation', 'Responsible for waste collection, dump yards, and public cleanliness', 1),
('Water Supply & Sewerage', 'Maintains drinking water pipelines, sewage flow, and storm drainage', 1),
('Electricity & Lighting', 'Maintains streetlights, high masts, transformers, and public power lines', 1),
('Public Health & Environment', 'Manages vector control, environmental hazards, and pollution issues', 1);

-- Note: User & Admin accounts with bcrypt hashes are seeded automatically by the Flask backend on initialization.

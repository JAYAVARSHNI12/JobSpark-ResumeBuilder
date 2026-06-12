import React, { useState } from 'react';
import { Database, Server, Monitor, Shield, FileText, Code, CheckCircle, Copy } from 'lucide-react';

export default function DevGuide() {
  const [activeTab, setActiveTab] = useState<'db' | 'backend' | 'frontend' | 'security' | 'pdf'>('db');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sqlSchema = `
-- Drop tables if they exist
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS users;

-- 1. Create Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Resumes Table
CREATE TABLE resumes (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL DEFAULT 'Untitled Resume',
    template_id VARCHAR(50) NOT NULL DEFAULT 'modern',
    resume_data JSONB NOT NULL,
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes for Performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
`;

  const nodeServerCode = `
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'jobspark_student_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock DB Pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION API ---

// 1. User Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)',
      [id, username, passwordHash]
    );
    
    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '24h' });
    res.status(211).json({ token, user: { id, username } });
  } catch (err) {
    if (err.code === '23505') {
       res.status(400).json({ error: 'Username already exists' });
    } else {
       res.status(500).json({ error: 'Server registration error' });
    }
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Server authentication error' });
  }
});

// --- RESUMES CRUD API ---

// Retrieve all resumes for logged-in user
app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, template_id, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Create new resume
app.post('/api/resumes', authenticateToken, async (req, res) => {
  const { title, templateId, resumeData, settings } = req.body;
  const id = uuidv4();
  
  try {
    await pool.query(
      'INSERT INTO resumes (id, user_id, title, template_id, resume_data, settings) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, req.user.id, title || 'My Resume', templateId || 'modern', JSON.stringify(resumeData), JSON.stringify(settings)]
    );
    res.status(201).json({ id, title });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update existing resume
app.put('/api/resumes/:id', authenticateToken, async (req, res) => {
  const { title, templateId, resumeData, settings } = req.body;
  try {
    const check = await pool.query('SELECT user_id FROM resumes WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(444).json({ error: 'Resume not found' });
    if (check.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized edit' });

    await pool.query(
      'UPDATE resumes SET title = $1, template_id = $2, resume_data = $3, settings = $4, updated_at = NOW() WHERE id = $5',
      [title, templateId, JSON.stringify(resumeData), JSON.stringify(settings), req.params.id]
    );
    res.json({ message: 'Resume updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
app.delete('/api/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM resumes WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    if (check.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized delete' });

    await pool.query('DELETE FROM resumes WHERE id = $1', [req.params.id]);
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

app.listen(PORT, () => console.log(\`Server started on port \${PORT}\`));
`;

  const htmlStructureCode = `
<!-- index.html (Basic SPA Structure for Student Project) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JobSpark Resume Builder - Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Global Navigation Header -->
  <nav class="nav-bar">
    <div class="logo">JobSpark Resume Builder</div>
    <div id="auth-controls">
      <span id="user-display"></span>
      <button id="logout-btn" onclick="logout()">Logout</button>
    </div>
  </nav>

  <!-- Section 1: Authentication Card -->
  <div id="auth-container" class="card">
    <h2 id="auth-title">Login to JobSpark</h2>
    <form id="auth-form" onsubmit="handleAuth(event)">
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit" id="auth-submit-btn">Login</button>
    </form>
    <p id="auth-toggle-msg">New student? <a href="#" onclick="toggleAuthMode()">Create an account</a></p>
  </div>

  <!-- Section 2: Dashboard -->
  <div id="dashboard-container" class="hidden">
    <div class="dashboard-header">
      <h2>Welcome Back, <span id="student-name"></span></h2>
      <button class="btn btn-primary" onclick="createNewResume()">+ Create New Resume</button>
    </div>
    <div id="resumes-grid" class="grid-layout">
      <!-- Dynamically filled with javascript cards -->
    </div>
  </div>

  <!-- Section 3: Workspace (Split Screen) -->
  <div id="workspace-container" class="hidden">
    <div class="sidebar">
      <button onclick="showDashboard()" class="btn btn-secondary">← Back to Dashboard</button>
      
      <!-- Live Configuration Inputs Form -->
      <form id="resume-form" oninput="updateLivePreview()">
        <h3>1. Contact Information</h3>
        <input type="text" id="res-name" placeholder="Full Name">
        <input type="text" id="res-title" placeholder="Professional Title">
        <input type="email" id="res-email" placeholder="Email Address">
        <input type="tel" id="res-phone" placeholder="Phone Number">
        <input type="text" id="res-location" placeholder="City, State / Country">
        <textarea id="res-summary" placeholder="Technical Professional Profile Summary"></textarea>

        <h3>2. Template Tuning</h3>
        <select id="template-select" onchange="swapTemplate()">
           <option value="modern">Modern Professional</option>
           <option value="creative">Creative Designer</option>
           <option value="classic">Classic Corporate</option>
           <option value="professional">Professional Minimal</option>
           <option value="ats_friendly">ATS-Friendly Clean</option>
           <option value="minimal">Ultra Minimalist</option>
        </select>
        <input type="color" id="accent-color" value="#0284c7">
      </form>

      <button onclick="saveActiveResume()" class="btn btn-primary">Save Changes</button>
      <button onclick="window.print()" class="btn btn-accent">Download PDF (Print)</button>
    </div>

    <!-- Live Document Preview Frame -->
    <div class="preview-panel">
      <div id="resume-print-area">
        <!-- Rendered template styles populate here -->
      </div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col" id="guide-root-container">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 p-6 border-b border-b-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/15 text-cyan-400 text-xs font-mono px-2 py-0.5 rounded-full border border-cyan-500/20">
              EDUCATIONAL SPEC
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Code className="h-5 w-5 text-cyan-400" />
            JobSpark Developer Reference Guide
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive blueprint for developing the Resume Builder app with HTML, CSS, JavaScript, and Node/Express.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-950/40 p-2 flex border-b border-slate-800 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('db')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
            activeTab === 'db'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          1. Database Design
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
            activeTab === 'backend'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          <Server className="h-3.5 w-3.5" />
          2. Backend (Express)
        </button>
        <button
          onClick={() => setActiveTab('frontend')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
            activeTab === 'frontend'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          3. Frontend Structure
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          4. Secure Storage & Scale
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
            activeTab === 'pdf'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          5. High-Fidelity PDF Generation
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
        {activeTab === 'db' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-cyan-500/10 p-2.5 rounded-lg text-cyan-400 shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Relational Database Schemas</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Standard SQL schemas design representing multi-tenant users and JSONB serialized resume objects. High portability for PostgreSQL, SQLite, or MySQL.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-white text-xs font-semibold flex items-center gap-1">
                <span>ENTITY-RELATIONSHIP DESIGN (1:Many Relation)</span>
              </h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li><strong className="text-slate-200">Users Table:</strong> Stores user profiles, hashed credentials, and system IDs. Ensure username carries a UNIQUE constraint to avoid duplicates.</li>
                <li><strong className="text-slate-200">Resumes Table:</strong> Holds metadata (title, selected template) and references the owner table with a foreign key constraint.</li>
                <li><strong className="text-slate-200">JSONB Resume Data Block:</strong> Uses structured JSON coordinates (`resume_data`) storing nested structures like arrays of work histories, skills, and settings, offering maximum schema elasticity for future expansions.</li>
              </ul>
            </div>

            {/* SQL Snippet */}
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(sqlSchema, 'sql')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                >
                  {copiedId === 'sql' ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-0.35 w-3.5" />
                      <span>Copy SQL Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-cyan-300 max-h-96">
                <code>{sqlSchema}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'backend' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400 shrink-0">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Node.js Express Server Endpoints</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Secure API server dealing with JWT verification, Salted Password hashing, and JSON REST routes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-emerald-400 mb-1.5">AUTHENTICATION ENDPOINTS</div>
                <ul className="space-y-1 text-slate-400 list-disc pl-4">
                  <li><code className="text-slate-200">POST /api/auth/signup</code> - Salt password, write user, issue token</li>
                  <li><code className="text-slate-200">POST /api/auth/login</code> - Compare password hash, return session token</li>
                </ul>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-sky-400 mb-1.5">RESUME MANAGEMENT (CRUD)</div>
                <ul className="space-y-1 text-slate-400 list-disc pl-4">
                  <li><code className="text-slate-200">GET /api/resumes</code> - Retrieve owned resumes</li>
                  <li><code className="text-slate-200">POST /api/resumes</code> - Insert new resume JSON schema</li>
                  <li><code className="text-slate-200">PUT /api/resumes/:id</code> - Update specific payload properties</li>
                  <li><code className="text-slate-200">DELETE /api/resumes/:id</code> - Safely purge document record</li>
                </ul>
              </div>
            </div>

            {/* Server Code Code */}
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(nodeServerCode, 'server')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                >
                  {copiedId === 'server' ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Express Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300 max-h-96">
                <code>{nodeServerCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'frontend' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-sky-500/10 p-2.5 rounded-lg text-sky-400 shrink-0">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Pure HTML, CSS, & Vanilla JS Structure</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Lightweight template setup that avoids complex setups. Render dynamic components via responsive state bindings.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-white text-xs font-semibold mb-2">KEY DESIGN PATTERNS FOR STUDENT SUBMISSSION</h4>
              <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4">
                <li>
                  <strong className="text-slate-200">Live Preview via Event Handling:</strong> Hook forms to <code className="text-cyan-400 font-mono">oninput</code> event listeners to instantly output values in the template container as the user types, achieving automatic preview responsiveness.
                </li>
                <li>
                  <strong className="text-slate-200">Modular Template Classes:</strong> Apply CSS utility layout combinations wrapped in wrapper classes (e.g. <code className="text-cyan-400 font-mono">.theme-modern</code>, <code className="text-cyan-400 font-mono">.theme-creative</code>) to quickly swap stylesheets inside the main canvas container without regenerating HTML.
                </li>
                <li>
                  <strong className="text-slate-200">Dashboard View toggles:</strong> Maintain clean viewport control by shifting <code className="text-cyan-400 font-mono">.hidden</code> (e.g. <code className="text-cyan-400 font-mono">display: none</code>) css utility classes across components based on active user actions (Sign-in vs Dashboard Workspace views).
                </li>
              </ol>
            </div>

            {/* Html structure */}
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(htmlStructureCode, 'html')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                >
                  {copiedId === 'html' ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy HTML Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-sky-300 max-h-96">
                <code>{htmlStructureCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400 shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Student Project Security & Scalability Standards</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Guarding user data against common vulnerabilities while ensuring a highly scalable roadmap.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Shield className="h-4 w-4" /> Security Highlights
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li><strong className="text-slate-300">Password Encryption:</strong> NEVER store raw strings. Always run credentials through salted hashing with high-quality algorithms like <strong className="text-slate-200">bcryptjs</strong>.</li>
                  <li><strong className="text-slate-300">JSON Web Tokens (JWT):</strong> Ensure secure session token authorization using client request headers. Set an expiration (e.g., 24h) to avoid token reuse.</li>
                  <li><strong className="text-slate-300">No SQL Injection:</strong> Always use parameterized query coordinates (e.g. <code className="text-emerald-400 font-mono">$1, $2</code> index bindings) inside standard query statements.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Database className="h-4 w-4" /> Scalability Tactics
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li><strong className="text-slate-300">Database Indexing:</strong> Add query index definitions on critical relationship connectors (<code className="text-cyan-400 font-mono">user_id</code> foreign key reference) to keep select query execution fast as user volumes escalate.</li>
                  <li><strong className="text-slate-300">Stateless REST Architecture:</strong> Keep the Node auth system completely stateless inside the server memory, making it easy to seamlessly scale/re-deploy backend containers under Cloud Run clusters.</li>
                  <li><strong className="text-slate-300">Client-First Rendering:</strong> Offload all layout rendering workloads entirely to local browser state rendering engines to drastically reduce bandwidth costs.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Perfect-Scale PDF Generation (Browser-Native Print)</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Achieving vector-crisp PDF output using CSS Page print rules. No blurred canvases, direct searchable links, zero external third-party servers.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-rose-400 font-semibold uppercase tracking-wider text-[10px]">Methodology Context</span>
                <p className="text-slate-400">
                  While libraries like <code className="text-slate-200">jspdf</code> or <code className="text-slate-200">html2canvas</code> are popular, they render text as static background bitmaps, causing blurred rendering and inflating file sizes. Using browser-native <code className="text-rose-400">window.print()</code> combined with strict print stylesheet declarations generates flawless, fully searchable document vectors at extremely fast native speeds.
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
                <h5 className="font-semibold text-white">How To Implement in Your Student Code:</h5>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>Isolate the resume content structure inside an identifier container like <code className="text-cyan-400 font-mono">&lt;div id="resume-print-area"&gt;</code>.</li>
                  <li>Create a CSS media print query block (<code className="text-cyan-400 font-mono">@media print</code>) inside your main styles file.</li>
                  <li>Set <code className="text-cyan-400 font-mono">display: none !important</code> on the global nav panel, sidebar forms, buttons, and scrollbars.</li>
                  <li>Force the targeted area element to act absolute, occupying exactly 100% viewport width (<code className="text-cyan-400 font-mono">width: 210mm; min-height: 297mm;</code>).</li>
                  <li>Use <code className="text-cyan-400 font-mono">-webkit-print-color-adjust: exact; print-color-adjust: exact;</code> to preserve all background graphics and hex color headings.</li>
                  <li>Call <code className="text-cyan-400 font-mono">window.print()</code> from click handlers to trigger the system-native save workflow.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-950 p-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        JobSpark Resume Builder — Student Project Spec Plan, v1.2
      </div>
    </div>
  );
}

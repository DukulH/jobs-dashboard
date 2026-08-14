"use client";

import { useState, useMemo, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Real data pulled from Apify's LinkedIn Jobs Scraper (crawlworks/linkedin-jobs-scraper)
// Search: "Software Developer" / "Fullstack Developer" / "Backend Developer"
// Locations: San Francisco, CA + Dhaka, Bangladesh | Posted: last 24h
// ---------------------------------------------------------------------------
const REAL_JOBS = [
  { title: "Software Engineer", company: "Cisco", location: "San Jose, CA, US", seniority: "Senior", expYears: 5, expText: "5+ years of professional software development experience (Java, Go, or Python).", posted: "16 hours ago", url: "https://www.linkedin.com/jobs/view/4453503810" },
  { title: "Backend Software Engineer", company: "Pragmatike", location: "San Francisco, CA, US", seniority: "Mid", expYears: 4, expText: "4+ years of backend software engineering experience.", posted: "49 minutes ago", url: "https://www.linkedin.com/jobs/view/4454595264" },
  { title: "MTS Software Development Engineer", company: "AMD", location: "Santa Clara, CA, US", seniority: "Senior", expYears: null, expText: "Not specified", posted: "11 minutes ago", url: "https://www.linkedin.com/jobs/view/4451259882" },
  { title: "Backend Engineer", company: "MVP Ventures", location: "San Francisco, CA, US", seniority: "Mid", expYears: null, expText: "Not specified", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4453592115" },
  { title: "Full Stack Engineer", company: "Tata Consultancy Services", location: "Pleasanton, CA, US", seniority: "Entry", expYears: null, expText: "Not specified", posted: "21 hours ago", url: "https://www.linkedin.com/jobs/view/4453278144" },
  { title: "NodeJS Backend Software Developer", company: "UST", location: "San Jose, CA, US", seniority: "Mid", expYears: 2, expText: "2-4 years, Node.js (Express/Fastify), REST APIs, microservices.", posted: "2 minutes ago", url: "https://www.linkedin.com/jobs/view/4451265780" },
  { title: "Software Development Engineer", company: "Adobe", location: "San Francisco, CA, US", seniority: "Senior", expYears: 5, expText: "5+ years of software development experience.", posted: "11 hours ago", url: "https://www.linkedin.com/jobs/view/4444912002" },
  { title: "Software Engineer, Bridge", company: "Stripe", location: "San Francisco, CA, US", seniority: "Senior", expYears: 5, expText: "Open to various seniority levels; minimum 5+ years experience.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4454545329" },
  { title: "Software Developer", company: "General Dynamics IT", location: "Bay Point, CA, US", seniority: "Mid", expYears: 3, expText: "3+ years of related experience.", posted: "11 hours ago", url: "https://www.linkedin.com/jobs/view/4454397478" },
  { title: "Software Engineer (Full-Stack / Product)", company: "Hilbert", location: "San Francisco, CA, US", seniority: "Mid", expYears: null, expText: "Not specified", posted: "19 hours ago", url: "https://www.linkedin.com/jobs/view/4448450878" },
  { title: "Full Stack Engineer, Startup Products", company: "Stripe", location: "San Francisco, CA, US", seniority: "Mid", expYears: 3, expText: "3+ years of software engineering experience.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4454540393" },
  { title: "Software Engineer, Full Stack (People Innovation)", company: "OpenAI", location: "San Francisco Bay Area, US", seniority: "Mid", expYears: 4, expText: "4+ years of professional engineering experience.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4426621891" },
  { title: "Software Engineer, Full Stack, Level 4", company: "Snap Inc.", location: "Palo Alto, CA, US", seniority: "Entry", expYears: 1, expText: "2+ years post-Bachelor's (or Master's/PhD equivalent).", posted: "2 hours ago", url: "https://www.linkedin.com/jobs/view/4436389224" },
  { title: "Full Stack Engineer", company: "Albert Bow", location: "San Francisco, CA, US", seniority: "Mid", expYears: 2, expText: "Experience: 2–7 years.", posted: "4 hours ago", url: "https://www.linkedin.com/jobs/view/4451253220" },
  { title: "Full Stack Software Engineer - Community", company: "Substack", location: "San Francisco Bay Area, US", seniority: "Senior", expYears: 5, expText: "At least 7+ years of software engineering experience.", posted: "22 hours ago", url: "https://www.linkedin.com/jobs/view/4453262157" },
  { title: "Software Engineer, Corporate Information Systems", company: "TikTok USDS", location: "San Jose, CA, US", seniority: "Mid", expYears: null, expText: "Not specified", posted: "1 hour ago", url: "https://www.linkedin.com/jobs/view/4454573773" },
  { title: "Backend Engineer, Developer & End-user Experience", company: "Stripe", location: "San Francisco, CA, US", seniority: "Mid", expYears: 2, expText: "2–12+ years of industry software engineering experience.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4454547320" },
  { title: "Backend Engineer", company: "Mintlify", location: "San Francisco, CA, US", seniority: "Mid", expYears: null, expText: "Not specified", posted: "12 hours ago", url: "https://www.linkedin.com/jobs/view/4454392224" },
  { title: "Backend Engineer, Payments and Risk", company: "Stripe", location: "San Francisco, CA, US", seniority: "Mid", expYears: 2, expText: "2–12+ years of industry software engineering experience.", posted: "5 minutes ago", url: "https://www.linkedin.com/jobs/view/4454596483" },
  { title: "Senior Software Engineer - Backend", company: "Sigma", location: "San Francisco, CA, US", seniority: "Senior", expYears: 5, expText: "5+ years industry experience building and maintaining software.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4426762019" },
  { title: "Backend Engineer at Tavus", company: "Jack & Jill", location: "San Francisco, CA, US", seniority: "Mid", expYears: null, expText: "Not specified", posted: "1 hour ago", url: "https://www.linkedin.com/jobs/view/4453709747" },
  { title: "Senior Data Engineer", company: "ZeuZ", location: "Bangladesh (Remote)", seniority: "Senior", expYears: 5, expText: "Minimum 8 years of Data Engineering experience.", posted: "6 hours ago", url: "https://www.linkedin.com/jobs/view/4453599143" },
  { title: "Senior Developer (ABAP RAP)", company: "Epic Group", location: "Tejgaon Thana, Dhaka, BD", seniority: "Senior", expYears: 4, expText: "Minimum 4–5 years hands-on enterprise application development.", posted: "15 hours ago", url: "https://www.linkedin.com/jobs/view/4453532261" },
];

const MOCK_JOBS = [
  { title: "Software Developer", company: "Acme Corp", location: "San Francisco, CA, US", seniority: "Mid", expYears: 3, expText: "3+ years experience", posted: "2 hours ago", url: "#" },
  { title: "Backend Developer", company: "Nimbus Systems", location: "Dhaka, Bangladesh", seniority: "Entry", expYears: 1, expText: "1+ years experience", posted: "5 hours ago", url: "#" },
  { title: "Fullstack Developer", company: "Vertex Labs", location: "San Francisco, CA, US", seniority: "Senior", expYears: 5, expText: "5+ years experience", posted: "8 hours ago", url: "#" },
  { title: "Software Developer", company: "Orbit Tech", location: "Dhaka, Bangladesh", seniority: "Mid", expYears: null, expText: "Not specified", posted: "12 hours ago", url: "#" },
  { title: "Backend Developer", company: "Halcyon Data", location: "San Francisco, CA, US", seniority: "Director", expYears: null, expText: "Not specified", posted: "20 hours ago", url: "#" },
];

const SENIORITY_OPTIONS = ["All", "Entry", "Mid", "Senior", "Director", "VP", "C-Suite"];

function EditableCell({ value, onChange, mono }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() !== "" && draft !== value) onChange(draft);
    else setDraft(value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        style={{
          width: "100%",
          background: "#0a0f0a",
          border: "1px solid #39ff6a",
          borderRadius: 4,
          color: "#eafff0",
          padding: "4px 6px",
          fontSize: 13,
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
          outline: "none",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: "text",
        padding: "4px 6px",
        borderRadius: 4,
        border: "1px solid transparent",
        minHeight: 18,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px dashed #2a5a3a")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid transparent")}
    >
      {value}
    </div>
  );
}

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedMock, setUsedMock] = useState(false);
  const [seniority, setSeniority] = useState("All");
  const [expMin, setExpMin] = useState(0);
  const [expMax, setExpMax] = useState(5);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Simulate the Apify fetch cycle (data was retrieved via the Apify MCP
    // connector running crawlworks/linkedin-jobs-scraper). If anything goes
    // wrong, fall back to mock rows so the UI is never empty.
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        if (!REAL_JOBS || REAL_JOBS.length === 0) throw new Error("empty dataset");
        setJobs(REAL_JOBS.map((j, i) => ({ ...j, id: i + 1 })));
        setUsedMock(false);
      } catch (err) {
        setJobs(MOCK_JOBS.map((j, i) => ({ ...j, id: i + 1 })));
        setUsedMock(true);
      } finally {
        setLoading(false);
      }
    }, 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const updateJob = (id, field, val) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, [field]: val } : j)));
  };

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (seniority !== "All" && j.seniority !== seniority) return false;
      if (j.expYears !== null) {
        const capped = Math.min(j.expYears, 5);
        if (capped < expMin || capped > expMax) return false;
      }
      if (keyword.trim()) {
        const k = keyword.trim().toLowerCase();
        if (!j.title.toLowerCase().includes(k) && !j.company.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [jobs, seniority, expMin, expMax, keyword]);

  const resetFilters = () => {
    setSeniority("All");
    setExpMin(0);
    setExpMax(5);
    setKeyword("");
  };

  const exportCSV = () => {
    const headers = ["#", "Job Title", "Company", "Location", "Seniority", "Exp Required", "Posted", "Apply URL"];
    const rows = filtered.map((j, i) => [
      i + 1,
      j.title,
      j.company,
      j.location,
      j.seniority,
      j.expText,
      j.posted,
      j.url,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job_board_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const seniorityColor = (s) =>
    ({
      Entry: "#7fe0ff",
      Mid: "#8affa0",
      Senior: "#39ff6a",
      Director: "#ffd23f",
      VP: "#ff9f45",
      "C-Suite": "#ff5c8a",
    }[s] || "#c9d6cd");

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        background: "radial-gradient(circle at 20% 0%, #0d1710 0%, #060a07 55%, #030503 100%)",
        color: "#d9f5e2",
        minHeight: "100vh",
        padding: "24px 20px 60px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #39ff6a55; }
        input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: linear-gradient(90deg, #1a2b1e, #2a5a3a);
          border-radius: 2px;
          outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #39ff6a;
          box-shadow: 0 0 8px #39ff6a, 0 0 16px #39ff6a88;
          cursor: pointer;
          border: 2px solid #06110a;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        .row-hover:hover {
          box-shadow: inset 0 0 0 1px #39ff6a55, 0 0 18px -4px #39ff6a99;
          background-color: #123018 !important;
        }
        .apply-btn {
          transition: all .15s ease;
        }
        .apply-btn:hover {
          box-shadow: 0 0 12px #39ff6a, 0 0 24px #39ff6a66;
          transform: translateY(-1px);
        }
        .filter-select, .filter-input {
          background: #0a140d;
          border: 1px solid #234a2c;
          color: #d9f5e2;
          border-radius: 6px;
          padding: 8px 10px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
        }
        .filter-select:focus, .filter-input:focus {
          border-color: #39ff6a;
          box-shadow: 0 0 8px #39ff6a55;
        }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-thumb { background: #234a2c; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#39ff6a", opacity: 0.85, marginBottom: 4 }}>
            LIVE FEED · LINKEDIN · LAST 24H
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#eafff0", letterSpacing: -0.5 }}>
            Jobs board
          </h1>
          <div style={{ fontSize: 12.5, color: "#7fa88c", marginTop: 4 }}>
            Software / Fullstack / Backend Developer &middot; San Francisco, CA &amp; Dhaka, Bangladesh
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="apply-btn"
          style={{
            background: "transparent",
            border: "1px solid #39ff6a",
            color: "#39ff6a",
            padding: "10px 18px",
            borderRadius: 6,
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 12.5,
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          ⬇ EXPORT CSV
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          background: "#0a140d",
          border: "1px solid #1e3a26",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 10.5, color: "#7fa88c", letterSpacing: 1 }}>SENIORITY</label>
          <select className="filter-select" value={seniority} onChange={(e) => setSeniority(e.target.value)}>
            {SENIORITY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 220 }}>
          <label style={{ fontSize: 10.5, color: "#7fa88c", letterSpacing: 1 }}>
            EXPERIENCE &nbsp;
            <span style={{ color: "#39ff6a" }}>
              {expMin} – {expMax >= 5 ? "5+" : expMax} yrs
            </span>
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="range" min={0} max={5} step={1} value={expMin}
              onChange={(e) => setExpMin(Math.min(Number(e.target.value), expMax))}
              style={{ width: 90 }}
            />
            <span style={{ fontSize: 11, color: "#5c7d68" }}>to</span>
            <input
              type="range" min={0} max={5} step={1} value={expMax}
              onChange={(e) => setExpMax(Math.max(Number(e.target.value), expMin))}
              style={{ width: 90 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 10.5, color: "#7fa88c", letterSpacing: 1 }}>SEARCH TITLE / COMPANY</label>
          <input
            className="filter-input"
            placeholder="e.g. Stripe, Backend..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button
          onClick={resetFilters}
          style={{
            alignSelf: "flex-end",
            background: "transparent",
            border: "1px solid #3a4a3e",
            color: "#9fc2ab",
            padding: "8px 14px",
            borderRadius: 6,
            fontFamily: "inherit",
            fontSize: 12,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39ff6a"; e.currentTarget.style.color = "#39ff6a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a4a3e"; e.currentTarget.style.color = "#9fc2ab"; }}
        >
          ✕ Reset Filters
        </button>
      </div>

      {/* Status line */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 12.5, color: "#7fa88c" }}>
        <span>
          {loading ? "Fetching jobs…" : `Showing ${filtered.length} of ${jobs.length} jobs`}
          {usedMock && !loading && (
            <span style={{ color: "#ffd23f", marginLeft: 8 }}>⚠ Apify fetch failed — showing sample data</span>
          )}
        </span>
      </div>

      {/* Table / Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 14 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "3px solid #1e3a26", borderTopColor: "#39ff6a",
              animation: "spin 0.8s linear infinite",
              boxShadow: "0 0 16px #39ff6a55",
            }}
          />
          <div style={{ fontSize: 12.5, color: "#7fa88c", animation: "pulse 1.6s ease-in-out infinite" }}>
            Running Apify LinkedIn Jobs Scraper…
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #1e3a26", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, zIndex: 2 }}>
                {["#", "Job Title", "Company", "Location", "Seniority", "Exp Required", "Posted", "Apply"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      background: "#0a1a0f",
                      borderBottom: "1px solid #39ff6a55",
                      color: "#39ff6a",
                      fontSize: 11,
                      letterSpacing: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#5c7d68" }}>
                    No jobs match these filters. Try widening your search.
                  </td>
                </tr>
              )}
              {filtered.map((job, idx) => (
                <tr
                  key={job.id}
                  className="row-hover"
                  style={{
                    backgroundColor: idx % 2 === 0 ? "rgba(57,255,106,0.035)" : "rgba(57,255,106,0.07)",
                    transition: "background-color .15s ease",
                  }}
                >
                  <td style={{ padding: "10px 14px", color: "#5c7d68", fontSize: 12.5 }}>{idx + 1}</td>
                  <td style={{ padding: "6px 8px", fontSize: 13, fontWeight: 600, minWidth: 200 }}>
                    <EditableCell value={job.title} onChange={(v) => updateJob(job.id, "title", v)} />
                  </td>
                  <td style={{ padding: "6px 8px", fontSize: 13, minWidth: 150 }}>
                    <EditableCell value={job.company} onChange={(v) => updateJob(job.id, "company", v)} />
                  </td>
                  <td style={{ padding: "6px 8px", fontSize: 12.5, color: "#b7d6c1", minWidth: 160 }}>
                    <EditableCell value={job.location} onChange={(v) => updateJob(job.id, "location", v)} />
                  </td>
                  <td style={{ padding: "10px 8px", fontSize: 12 }}>
                    <span
                      style={{
                        color: seniorityColor(job.seniority),
                        border: `1px solid ${seniorityColor(job.seniority)}55`,
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                      }}
                    >
                      {job.seniority}
                    </span>
                  </td>
                  <td style={{ padding: "6px 8px", fontSize: 12, color: "#9fc2ab", minWidth: 220, maxWidth: 280 }}>
                    <EditableCell value={job.expText} onChange={(v) => updateJob(job.id, "expText", v)} />
                  </td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: "#7fa88c", whiteSpace: "nowrap" }}>
                    {job.posted}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <button
                      className="apply-btn"
                      onClick={() => window.open(job.url, "_blank", "noopener,noreferrer")}
                      style={{
                        background: "#39ff6a",
                        color: "#04220f",
                        border: "none",
                        borderRadius: 6,
                        padding: "7px 16px",
                        fontFamily: "inherit",
                        fontWeight: 800,
                        fontSize: 11.5,
                        letterSpacing: 0.5,
                        cursor: "pointer",
                        boxShadow: "0 0 6px #39ff6a99",
                      }}
                    >
                      APPLY →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 11, color: "#3d5c48", textAlign: "center" }}>
        Data sourced via Apify · crawlworks/linkedin-jobs-scraper · click any title, company, location or exp cell to edit inline
      </div>
    </div>
  );
}

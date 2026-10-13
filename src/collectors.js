// collectors.js — client-side evidence automation (demo / mock mode).
//
// A browser-only mirror of the server/ connectors + controlMap: each Connected
// integration maps (by category) to the NIST SP 800-171 Rev 2 controls it can
// evidence, and emits deterministic Findings (pass/partial/fail + a metric).
// collectForConnections() shapes those Findings into read-only evidence rows the
// Evidence page and per-control compliance already know how to render.
//
// This is SYNTHETIC evidence for the beta demo — it is NOT collected from real
// systems. The server/ connectors do the real thing when the backend is deployed.

// finding.result -> the UI's evidence status vocabulary (EV_STATUS_META in App.jsx).
const RESULT_TO_STATUS = { pass: "Collected", partial: "In Review", fail: "Pending" };

// Integration catalog category -> coverage category (matches server/controlMap.js).
const CATEGORY_MAP = {
  Cloud: "cloud",
  Identity: "identity",
  Endpoint: "endpoint",
  "Source Code": "source",
};

// Deterministic mock findings per coverage category. Shaped like what the real
// connectors derive from read-only API snapshots. A mix of pass/partial/fail so
// the demo shows genuine compliance *and* gaps that flow to the POA&M.
const FINDINGS = {
  identity: [
    { controlId: "3.5.3", result: "partial", summary: "MFA enforced for active users", metric: { covered: 48, total: 50 } },
    { controlId: "3.5.1", result: "pass", summary: "Every user has a unique identifier" },
    { controlId: "3.5.2", result: "pass", summary: "Authenticators managed centrally" },
    { controlId: "3.1.1", result: "pass", summary: "Access limited to authorized users", metric: { covered: 50, total: 50 } },
    { controlId: "3.1.5", result: "pass", summary: "Least-privilege roles applied; no standing admin" },
    { controlId: "3.1.6", result: "pass", summary: "Privileged accounts used only for privileged tasks" },
    { controlId: "3.5.6", result: "pass", summary: "Inactive accounts disabled after 35 days", metric: { covered: 3, total: 3 } },
    { controlId: "3.5.7", result: "pass", summary: "Password complexity policy enforced" },
    { controlId: "3.5.8", result: "pass", summary: "Password reuse (last 24) prohibited" },
    { controlId: "3.5.9", result: "pass", summary: "Temporary passwords require immediate change" },
    { controlId: "3.5.10", result: "pass", summary: "Stored/transmitted passwords cryptographically protected" },
    { controlId: "3.1.8", result: "pass", summary: "Account lockout after failed logon attempts" },
    { controlId: "3.1.10", result: "pass", summary: "Session lock with pattern-hiding after inactivity" },
    { controlId: "3.1.11", result: "pass", summary: "Idle sessions terminated automatically" },
  ],
  cloud: [
    { controlId: "3.3.1", result: "pass", summary: "Audit logging enabled across all regions", metric: { covered: 12, total: 12 } },
    { controlId: "3.3.2", result: "pass", summary: "Actions traceable to individual users" },
    { controlId: "3.13.8", result: "pass", summary: "TLS 1.2+ enforced for data in transit" },
    { controlId: "3.13.11", result: "pass", summary: "FIPS-validated cryptographic modules in use" },
    { controlId: "3.13.16", result: "partial", summary: "Encryption at rest on most data stores", metric: { covered: 11, total: 12 } },
    { controlId: "3.13.1", result: "pass", summary: "Boundary protection via security groups and NACLs" },
    { controlId: "3.13.5", result: "pass", summary: "Public/private subnet separation enforced" },
    { controlId: "3.13.6", result: "fail", summary: "Security group open to 0.0.0.0/0 on port 22", metric: { covered: 7, total: 8 } },
    { controlId: "3.4.1", result: "pass", summary: "Baseline configuration tracked via Config rules" },
    { controlId: "3.4.2", result: "partial", summary: "Config drift on 1 managed rule", metric: { covered: 3, total: 4 } },
  ],
  endpoint: [
    { controlId: "3.14.2", result: "pass", summary: "Malicious-code protection deployed to endpoints", metric: { covered: 48, total: 48 } },
    { controlId: "3.14.4", result: "pass", summary: "Malware signatures updated automatically" },
    { controlId: "3.14.5", result: "pass", summary: "Periodic and real-time scans enabled" },
    { controlId: "3.1.19", result: "partial", summary: "Disk encryption on managed devices", metric: { covered: 44, total: 48 } },
    { controlId: "3.14.1", result: "partial", summary: "Patch SLA met on most devices", metric: { covered: 43, total: 48 } },
    { controlId: "3.8.7", result: "pass", summary: "Removable media use restricted by policy" },
  ],
  source: [
    { controlId: "3.4.3", result: "pass", summary: "Changes tracked via pull requests and protected branches" },
    { controlId: "3.4.4", result: "pass", summary: "Security impact analyzed via required status checks" },
  ],
};

/** Findings a single connection would emit (empty if its category has no coverage). */
export function findingsForConnection(conn) {
  const cat = CATEGORY_MAP[conn.category];
  return cat ? FINDINGS[cat] : [];
}

/** A one-line compliance tally for a connection: { total, pass, partial, fail }. */
export function complianceForConnection(conn) {
  const fs = findingsForConnection(conn);
  return {
    total: fs.length,
    pass: fs.filter((f) => f.result === "pass").length,
    partial: fs.filter((f) => f.result === "partial").length,
    fail: fs.filter((f) => f.result === "fail").length,
  };
}

/**
 * Build read-only evidence rows from every Connected integration.
 * Row ids are prefixed "auto:" so they never collide with manual evidence and can
 * be rendered distinctly. Deterministic — same connections produce the same rows.
 */
export function collectForConnections(connections = []) {
  const rows = [];
  const seen = new Set();
  for (const conn of connections) {
    if (conn.status === "Disabled") continue;
    for (const f of findingsForConnection(conn)) {
      const id = `auto:${conn.provider}:${f.controlId}`;
      if (seen.has(id)) continue; // one source per control per provider
      seen.add(id);
      rows.push({
        id,
        name: f.summary,
        status: RESULT_TO_STATUS[f.result] || "In Review",
        controlIds: [f.controlId],
        objective: f.summary,
        owner: conn.provider,
        assigned: "",
        program: "CMMC Level 2",
        dueOn: "",
        source: "auto",
        provider: conn.provider,
        result: f.result,
        metric: f.metric || null,
        collectedAt: conn.lastSync || null,
      });
    }
  }
  return rows;
}

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, ListChecks, FolderOpen, ClipboardList, Search, Plus, X,
  Shield, ChevronDown, ChevronRight, Trash2, AlertTriangle, CheckCircle2,
  Circle, HelpCircle, Clock, Link2, Info, RotateCcw, Layers, Download, ChevronLeft,
  Boxes, Building2, Upload, Camera, ShieldAlert, FileText, Users, Activity, Plug, Gavel, ShieldCheck, Lock,
  FileBarChart, Mail, CalendarClock, LayoutGrid, Settings as SettingsIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  FRAMEWORK DATA — NIST SP 800-171 Rev 2 (CMMC Level 2, 110 controls) */
/* ------------------------------------------------------------------ */

const FAMILIES = [
  { key: "AC", code: "3.1", name: "Access Control" },
  { key: "AT", code: "3.2", name: "Awareness and Training" },
  { key: "AU", code: "3.3", name: "Audit and Accountability" },
  { key: "CM", code: "3.4", name: "Configuration Management" },
  { key: "IA", code: "3.5", name: "Identification and Authentication" },
  { key: "IR", code: "3.6", name: "Incident Response" },
  { key: "MA", code: "3.7", name: "Maintenance" },
  { key: "MP", code: "3.8", name: "Media Protection" },
  { key: "PS", code: "3.9", name: "Personnel Security" },
  { key: "PE", code: "3.10", name: "Physical Protection" },
  { key: "RA", code: "3.11", name: "Risk Assessment" },
  { key: "CA", code: "3.12", name: "Security Assessment" },
  { key: "SC", code: "3.13", name: "System and Communications Protection" },
  { key: "SI", code: "3.14", name: "System and Information Integrity" },
];

const C = (id, family, title) => ({ id, family, title });
const CONTROLS = [
  C("3.1.1","AC","Limit system access to authorized users, processes, and devices."),
  C("3.1.2","AC","Limit system access to the types of transactions and functions authorized users may execute."),
  C("3.1.3","AC","Control the flow of CUI in accordance with approved authorizations."),
  C("3.1.4","AC","Separate the duties of individuals to reduce risk of malevolent activity without collusion."),
  C("3.1.5","AC","Employ the principle of least privilege, including for privileged accounts."),
  C("3.1.6","AC","Use non-privileged accounts or roles when accessing nonsecurity functions."),
  C("3.1.7","AC","Prevent non-privileged users from executing privileged functions; capture such executions in logs."),
  C("3.1.8","AC","Limit unsuccessful logon attempts."),
  C("3.1.9","AC","Provide privacy and security notices consistent with applicable CUI rules."),
  C("3.1.10","AC","Use session lock with pattern-hiding displays after a period of inactivity."),
  C("3.1.11","AC","Terminate a user session automatically after a defined condition."),
  C("3.1.12","AC","Monitor and control remote access sessions."),
  C("3.1.13","AC","Employ cryptographic mechanisms to protect confidentiality of remote access sessions."),
  C("3.1.14","AC","Route remote access via managed access control points."),
  C("3.1.15","AC","Authorize remote execution of privileged commands and remote access to security-relevant info."),
  C("3.1.16","AC","Authorize wireless access prior to allowing such connections."),
  C("3.1.17","AC","Protect wireless access using authentication and encryption."),
  C("3.1.18","AC","Control connection of mobile devices."),
  C("3.1.19","AC","Encrypt CUI on mobile devices and mobile computing platforms."),
  C("3.1.20","AC","Verify and control/limit connections to and use of external systems."),
  C("3.1.21","AC","Limit use of portable storage devices on external systems."),
  C("3.1.22","AC","Control CUI posted or processed on publicly accessible systems."),
  C("3.2.1","AT","Ensure managers, admins, and users are aware of security risks and applicable policies."),
  C("3.2.2","AT","Ensure personnel are trained to carry out assigned information security duties."),
  C("3.2.3","AT","Provide security awareness training on recognizing and reporting insider threat."),
  C("3.3.1","AU","Create and retain system audit logs to enable monitoring, analysis, and reporting."),
  C("3.3.2","AU","Ensure actions of individual users can be uniquely traced to those users."),
  C("3.3.3","AU","Review and update logged events."),
  C("3.3.4","AU","Alert in the event of an audit logging process failure."),
  C("3.3.5","AU","Correlate audit review, analysis, and reporting for investigation and response."),
  C("3.3.6","AU","Provide audit record reduction and report generation for on-demand analysis."),
  C("3.3.7","AU","Synchronize internal system clocks with an authoritative source for time stamps."),
  C("3.3.8","AU","Protect audit information and audit logging tools from unauthorized access or modification."),
  C("3.3.9","AU","Limit management of audit logging functionality to a subset of privileged users."),
  C("3.4.1","CM","Establish and maintain baseline configurations and inventories of organizational systems."),
  C("3.4.2","CM","Establish and enforce security configuration settings for IT products."),
  C("3.4.3","CM","Track, review, approve/disapprove, and log changes to organizational systems."),
  C("3.4.4","CM","Analyze the security impact of changes prior to implementation."),
  C("3.4.5","CM","Define, document, approve, and enforce access restrictions associated with changes."),
  C("3.4.6","CM","Employ least functionality by configuring systems to provide only essential capabilities."),
  C("3.4.7","CM","Restrict, disable, or prevent nonessential programs, ports, protocols, and services."),
  C("3.4.8","CM","Apply deny-by-exception or permit-by-exception policy for software execution."),
  C("3.4.9","CM","Control and monitor user-installed software."),
  C("3.5.1","IA","Identify system users, processes acting on behalf of users, and devices."),
  C("3.5.2","IA","Authenticate identities of users, processes, or devices as a prerequisite to access."),
  C("3.5.3","IA","Use multifactor authentication for privileged and network access."),
  C("3.5.4","IA","Employ replay-resistant authentication mechanisms for network access."),
  C("3.5.5","IA","Prevent reuse of identifiers for a defined period."),
  C("3.5.6","IA","Disable identifiers after a defined period of inactivity."),
  C("3.5.7","IA","Enforce minimum password complexity and change of characters for new passwords."),
  C("3.5.8","IA","Prohibit password reuse for a specified number of generations."),
  C("3.5.9","IA","Allow temporary password use with immediate change to a permanent password."),
  C("3.5.10","IA","Store and transmit only cryptographically-protected passwords."),
  C("3.5.11","IA","Obscure feedback of authentication information."),
  C("3.6.1","IR","Establish an operational incident-handling capability (prep, detection, analysis, recovery)."),
  C("3.6.2","IR","Track, document, and report incidents to designated officials and authorities."),
  C("3.6.3","IR","Test the organizational incident response capability."),
  C("3.7.1","MA","Perform maintenance on organizational systems."),
  C("3.7.2","MA","Provide controls on tools, techniques, mechanisms, and personnel used for maintenance."),
  C("3.7.3","MA","Ensure equipment removed for off-site maintenance is sanitized of any CUI."),
  C("3.7.4","MA","Check diagnostic and test media for malicious code before use."),
  C("3.7.5","MA","Require MFA to establish nonlocal maintenance sessions and terminate when complete."),
  C("3.7.6","MA","Supervise maintenance activities of personnel without required access authorization."),
  C("3.8.1","MP","Protect (physically control and securely store) system media containing CUI."),
  C("3.8.2","MP","Limit access to CUI on system media to authorized users."),
  C("3.8.3","MP","Sanitize or destroy system media containing CUI before disposal or reuse."),
  C("3.8.4","MP","Mark media with necessary CUI markings and distribution limitations."),
  C("3.8.5","MP","Control access to media and maintain accountability during transport outside controlled areas."),
  C("3.8.6","MP","Implement cryptographic mechanisms to protect CUI on digital media during transport."),
  C("3.8.7","MP","Control the use of removable media on system components."),
  C("3.8.8","MP","Prohibit the use of portable storage devices with no identifiable owner."),
  C("3.8.9","MP","Protect the confidentiality of backup CUI at storage locations."),
  C("3.9.1","PS","Screen individuals prior to authorizing access to systems containing CUI."),
  C("3.9.2","PS","Protect systems containing CUI during and after personnel actions (terminations, transfers)."),
  C("3.10.1","PE","Limit physical access to systems, equipment, and operating environments to authorized individuals."),
  C("3.10.2","PE","Protect and monitor the physical facility and support infrastructure."),
  C("3.10.3","PE","Escort visitors and monitor visitor activity."),
  C("3.10.4","PE","Maintain audit logs of physical access."),
  C("3.10.5","PE","Control and manage physical access devices."),
  C("3.10.6","PE","Enforce safeguarding measures for CUI at alternate work sites."),
  C("3.11.1","RA","Periodically assess risk to operations, assets, and individuals from system operation."),
  C("3.11.2","RA","Scan for vulnerabilities periodically and when new vulnerabilities are identified."),
  C("3.11.3","RA","Remediate vulnerabilities in accordance with risk assessments."),
  C("3.12.1","CA","Periodically assess security controls to determine if they are effective."),
  C("3.12.2","CA","Develop and implement plans of action to correct deficiencies and reduce vulnerabilities."),
  C("3.12.3","CA","Monitor security controls on an ongoing basis to ensure continued effectiveness."),
  C("3.12.4","CA","Develop, document, and periodically update system security plans (SSP)."),
  C("3.13.1","SC","Monitor, control, and protect communications at external and key internal boundaries."),
  C("3.13.2","SC","Employ architectural designs and engineering principles that promote effective security."),
  C("3.13.3","SC","Separate user functionality from system management functionality."),
  C("3.13.4","SC","Prevent unauthorized and unintended information transfer via shared system resources."),
  C("3.13.5","SC","Implement subnetworks for publicly accessible components separated from internal networks."),
  C("3.13.6","SC","Deny network traffic by default and allow by exception (deny all, permit by exception)."),
  C("3.13.7","SC","Prevent remote devices from split tunneling into external networks."),
  C("3.13.8","SC","Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI in transit."),
  C("3.13.9","SC","Terminate network connections at end of sessions or after inactivity."),
  C("3.13.10","SC","Establish and manage cryptographic keys for cryptography employed in systems."),
  C("3.13.11","SC","Employ FIPS-validated cryptography to protect the confidentiality of CUI."),
  C("3.13.12","SC","Prohibit remote activation of collaborative computing devices; indicate devices in use."),
  C("3.13.13","SC","Control and monitor the use of mobile code."),
  C("3.13.14","SC","Control and monitor the use of Voice over Internet Protocol (VoIP) technologies."),
  C("3.13.15","SC","Protect the authenticity of communications sessions."),
  C("3.13.16","SC","Protect the confidentiality of CUI at rest."),
  C("3.14.1","SI","Identify, report, and correct system flaws in a timely manner."),
  C("3.14.2","SI","Provide protection from malicious code at designated locations."),
  C("3.14.3","SI","Monitor system security alerts and advisories and take action in response."),
  C("3.14.4","SI","Update malicious code protection mechanisms when new releases are available."),
  C("3.14.5","SI","Perform periodic and real-time scans of files from external sources."),
  C("3.14.6","SI","Monitor systems and inbound/outbound traffic to detect attacks and indicators."),
  C("3.14.7","SI","Identify unauthorized use of organizational systems."),
];

// SPRS point weights (best-effort per DoD Assessment Methodology; verify vs. official template)
const W5 = new Set(["3.1.1","3.1.2","3.1.12","3.1.13","3.1.16","3.1.17","3.1.18","3.1.20","3.1.22","3.4.5","3.4.6","3.4.7","3.4.8","3.5.3","3.6.1","3.6.2","3.8.3","3.12.1","3.12.3","3.13.1","3.13.2","3.13.5","3.13.6","3.14.1","3.14.2","3.14.4","3.14.5","3.14.6","3.14.7"]);
const W1 = new Set(["3.1.9","3.3.3","3.4.4","3.5.5","3.5.6","3.5.9","3.5.11","3.6.3","3.7.1","3.7.6","3.8.2","3.9.1","3.10.4","3.10.5","3.11.3","3.12.2","3.12.4","3.13.3","3.13.9","3.14.3"]);
const weightOf = (id) => (W5.has(id) ? 5 : W1.has(id) ? 1 : 3);
const FAMILY_BY_KEY = Object.fromEntries(FAMILIES.map((f) => [f.key, f]));

/* ------------------------------------------------------------------ */
/*  STATUS MODEL                                                        */
/* ------------------------------------------------------------------ */

const STATUS = {
  yes:     { label: "Yes",            color: "emerald", hex: "#10b981", Icon: CheckCircle2 },
  partial: { label: "Partially",      color: "amber",   hex: "#f59e0b", Icon: AlertTriangle },
  no:      { label: "No",             color: "rose",    hex: "#f43f5e", Icon: X },
  na:      { label: "Not Applicable", color: "slate",   hex: "#94a3b8", Icon: HelpCircle },
};
const STATUS_ORDER = ["yes", "partial", "no", "na"];
const UNANSWERED = { label: "Not Answered", color: "zinc", hex: "#e4e4e7" };

// Five answer buckets used everywhere (donuts, legends, counts)
const ANSWER_KEYS = ["yes", "partial", "no", "na", "notAnswered"];
const answerMeta = (k) => (k === "notAnswered" ? UNANSWERED : STATUS[k]);

// deduction toward SPRS if a control is NOT fully met
function deduction(status, id) {
  const w = weightOf(id);
  if (status === "yes" || status === "na") return 0;
  if (status === "partial") return w === 5 ? 3 : 1;
  return w; // "no" OR not answered
}

// tally answer buckets over a subset of controls
function tally(controls, assessment) {
  const c = { yes: 0, partial: 0, no: 0, na: 0, notAnswered: 0, total: controls.length };
  for (const ctrl of controls) c[assessment[ctrl.id]?.status || "notAnswered"]++;
  const applicable = c.total - c.na;
  const answered = c.total - c.notAnswered;
  c.answeredPct = c.total ? Math.round((answered / c.total) * 100) : 0;
  c.scorePct = applicable ? Math.round(((c.yes + 0.5 * c.partial) / applicable) * 100) : 0;
  return c;
}
function segmentsFrom(c) {
  return ANSWER_KEYS.map((k) => ({ key: k, value: c[k], hex: answerMeta(k).hex, label: answerMeta(k).label }));
}

/* ---- Compliance lens: derived from assessment answers + evidence ---- */
const COMPLIANCE = {
  compliant:        { label: "Compliant",           hex: "#10b981", tw: "emerald" },
  partialCompliant: { label: "Partially Compliant", hex: "#f59e0b", tw: "amber" },
  inReview:         { label: "In Review",           hex: "#0ea5e9", tw: "sky" },
  notCompliant:     { label: "Not Compliant",       hex: "#f43f5e", tw: "rose" },
  notApplicable:    { label: "Not Applicable",      hex: "#94a3b8", tw: "slate" },
  notAssessed:      { label: "Not Assessed",        hex: "#e4e4e7", tw: "zinc" },
};
const COMPLIANCE_KEYS = ["compliant", "partialCompliant", "inReview", "notCompliant", "notApplicable", "notAssessed"];

// Map an assessment answer (+ evidence) to a compliance status.
// "In Review" = evidence gathered but the answer is still pending.
function complianceStatus(id, assessment, evidenceByControl) {
  const s = assessment[id]?.status;
  if (s === "yes") return "compliant";
  if (s === "partial") return "partialCompliant";
  if (s === "no") return "notCompliant";
  if (s === "na") return "notApplicable";
  return evidenceByControl[id]?.length ? "inReview" : "notAssessed";
}
function complianceTally(controlIds, assessment, evidenceByControl) {
  const c = { compliant: 0, partialCompliant: 0, inReview: 0, notCompliant: 0, notApplicable: 0, notAssessed: 0, total: controlIds.length };
  for (const id of controlIds) c[complianceStatus(id, assessment, evidenceByControl)]++;
  const applicable = c.total - c.notApplicable;
  c.compliancePct = applicable ? Math.round((c.compliant / applicable) * 100) : 0;
  return c;
}
function complianceSegments(c) {
  return COMPLIANCE_KEYS.map((k) => ({ key: k, value: c[k], hex: COMPLIANCE[k].hex, label: COMPLIANCE[k].label }));
}

// SPRS breakdown per control family (category) for a set of controls.
function sprsByCategory(controlIds, assessment) {
  const idset = new Set(controlIds);
  return FAMILIES.map((f) => {
    const list = CONTROLS.filter((c) => c.family === f.key && idset.has(c.id));
    const possible = list.reduce((s, c) => s + weightOf(c.id), 0);
    const lost = list.reduce((s, c) => s + deduction(assessment[c.id]?.status, c.id), 0);
    return { ...f, count: list.length, possible, lost, retained: possible - lost };
  }).filter((r) => r.count > 0);
}

/* ------------------------------------------------------------------ */
/*  PERSISTENCE                                                         */
/* ------------------------------------------------------------------ */

const KEY_ASSESS = "cmmc_assessment_v1";
const KEY_EVID = "cmmc_evidence_v1";
const KEY_ACT = "cmmc_actions_v1";
const KEY_FW = "cmmc_frameworks_v1";
const KEY_SETS = "cmmc_controlsets_v1";
const KEY_ASSETS = "cmmc_assets_v1";
const KEY_VENDORS = "cmmc_vendors_v1";
const KEY_RISKS = "cmmc_risks_v1";
const KEY_SNAPS = "cmmc_snapshots_v1";
const KEY_DOCS = "cmmc_documents_v1";
const KEY_PEOPLE = "cmmc_people_v1";
const KEY_CONN = "cmmc_connectors_v1";
const KEY_INTEG = "cmmc_integrations_v1";
const KEY_AUDITS = "cmmc_audits_v1";
const KEY_TRUST = "cmmc_trust_v1";
const KEY_GENREP = "cmmc_generated_reports_v1";
const KEY_SCHEDREP = "cmmc_scheduled_reports_v1";
const KEY_SETTINGS = "cmmc_settings_v1";
const KEY_SEEDED = "cmmc_seeded_v2";
const DEFAULT_SETTINGS = { orgName: "", poc: "", targetDate: "" };

// Local persistence via the browser's localStorage (swapped in from the Claude artifact's window.storage).
async function storeGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function storeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* ------------------------------------------------------------------ */
/*  SMALL UI HELPERS                                                    */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500">
        <Circle size={11} /> Not Answered
      </span>
    );
  }
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-${s.color}-200 bg-${s.color}-50 px-2 py-0.5 text-xs font-medium text-${s.color}-700`}>
      <s.Icon size={11} /> {s.label}
    </span>
  );
}

function Stat({ label, value, sub, accent = "slate" }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className={`text-2xl font-semibold tabular-nums text-${accent}-700`}>{value}</div>
      <div className="mt-0.5 text-sm font-medium text-zinc-700">{label}</div>
      {sub && <div className="text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}

/* Multi-segment donut. segments: [{ value, hex }]. Center shows two lines of text. */
function Donut({ segments, size = 104, thickness = 14, centerTop, centerBottom }) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {total === 0 ? (
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f2" strokeWidth={thickness} />
        ) : (
          segments.map((s) => {
            if (!s.value) return null;
            const dash = (s.value / total) * circ;
            const el = (
              <circle key={s.hex + acc} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={s.hex} strokeWidth={thickness}
                strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-acc} />
            );
            acc += dash;
            return el;
          })
        )}
      </g>
      {centerTop != null && (
        <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.26} fontWeight="700" fill="#18181b" fontFamily="ui-monospace, monospace">{centerTop}</text>
      )}
      {centerBottom != null && (
        <text x="50%" y="64%" textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.11} fill="#a1a1aa">{centerBottom}</text>
      )}
    </svg>
  );
}

/* Single-value ring for a headline percentage. */
function ProgressRing({ pct, hex, top, bottom, size = 132 }) {
  return (
    <Donut size={size} thickness={16}
      segments={[{ value: pct, hex }, { value: 100 - pct, hex: "#eef0f2" }]}
      centerTop={top ?? `${pct}%`} centerBottom={bottom} />
  );
}

/* Legend for the five answer buckets, with counts. */
function AnswerLegend({ counts, compact }) {
  return (
    <div className={`grid ${compact ? "grid-cols-1 gap-1" : "grid-cols-2 gap-x-4 gap-y-1.5"}`}>
      {ANSWER_KEYS.map((k) => {
        const m = answerMeta(k);
        return (
          <div key={k} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.hex }} />
            <span className="text-zinc-600">{m.label}</span>
            <span className="ml-auto font-mono tabular-nums font-medium text-zinc-800">{counts[k]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SPRS GAUGE (signature element)                                      */
/* ------------------------------------------------------------------ */

function SprsGauge({ score }) {
  const clamped = Math.max(0, Math.min(110, score));
  const frac = clamped / 110;
  const L = Math.PI * 100; // semicircle length, r=100
  const tickAngle = (1 - 88 / 110) * Math.PI; // 88 threshold, from left
  const tx = 120 + 100 * Math.cos(Math.PI - tickAngle);
  const ty = 120 - 100 * Math.sin(Math.PI - tickAngle);
  const band = score >= 110 ? "meets" : score >= 88 ? "conditional" : "below";
  const bandLabel =
    band === "meets" ? "Meets Level 2 (est.)" :
    band === "conditional" ? "Conditional Level 2" : "Below conditional threshold";
  const bandColor = band === "meets" ? "#059669" : band === "conditional" ? "#d97706" : "#e11d48";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 150" className="w-full max-w-xs">
        <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="#e4e4e7" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M 20 120 A 100 100 0 0 1 220 120"
          fill="none" stroke={bandColor} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${frac * L} ${L}`}
        />
        {/* 88 threshold tick */}
        <line x1={tx} y1={ty} x2={120 + 84 * Math.cos(Math.PI - tickAngle)} y2={120 - 84 * Math.sin(Math.PI - tickAngle)} stroke="#3f3f46" strokeWidth="2" />
        <text x={tx + 4} y={ty - 4} fontSize="9" fill="#71717a" fontFamily="ui-monospace, monospace">88</text>
        <text x="120" y="104" textAnchor="middle" fontSize="42" fontWeight="700" fill="#18181b" fontFamily="ui-monospace, monospace">{score}</text>
        <text x="120" y="122" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="ui-monospace, monospace">/ 110 max</text>
      </svg>
      <div className="mt-1 flex items-center gap-2 text-sm font-semibold" style={{ color: bandColor }}>
        <Shield size={15} /> {bandLabel}
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
        <Info size={11} /> SPRS estimate — verify against the DoD scoring template
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                           */
/* ------------------------------------------------------------------ */

function buildDemo() {
  const ago = (n) => new Date(Date.now() - n * 864e5).toISOString();
  const ahead = (n) => new Date(Date.now() + n * 864e5).toISOString();
  const day = (iso) => iso.slice(0, 10);
  const people = ["A. Chen", "M. Patel", "J. Rivera", "S. Okoro", "L. Nguyen", "D. Brooks"];

  // Assessment: realistic spread across the 110 controls
  const assessment = {};
  CONTROLS.forEach((c, i) => {
    const m = (i * 7 + 3) % 10;
    let s = null;
    if (m < 6) s = "yes"; else if (m < 7) s = "partial"; else if (m < 8) s = "no"; else if (m === 8) s = "na";
    if (s) assessment[c.id] = { status: s, note: s === "yes" ? "Implemented and evidenced." : s === "partial" ? "Partially in place; remediation underway." : s === "no" ? "Gap identified — POA&M item created." : "Out of scope for our environment." };
  });

  const evidence = [
    ["MFA enforcement policy (Okta export)", "Collected", ["3.5.3"], "MFA enforced for privileged and network access"],
    ["Centralized audit logging config (SIEM)", "Collected", ["3.3.1", "3.3.2"], "Audit logs generated and retained"],
    ["Baseline configuration standard", "In Review", ["3.4.1", "3.4.2"], "Hardened baselines applied to all systems"],
    ["Endpoint AV/EDR coverage report", "Collected", ["3.14.2", "3.14.4"], "Malware protection deployed and updated"],
    ["Media sanitization log", "Collected", ["3.8.3"], "Media sanitized before disposal"],
    ["Incident response tabletop results", "Pending", ["3.6.1", "3.6.3"], "IR capability tested"],
    ["Quarterly vulnerability scan", "Collected", ["3.11.2", "3.11.3"], "Vulnerabilities scanned and remediated"],
    ["System Security Plan v3.2", "Collected", ["3.12.4"], "SSP documents the environment"],
    ["FIPS-validated encryption inventory", "In Review", ["3.13.11"], "FIPS crypto in use for CUI"],
    ["VPN / remote access config", "Collected", ["3.1.12", "3.1.13"], "Remote access monitored and encrypted"],
    ["Annual security awareness completion", "Pending", ["3.2.2"], "Staff trained on security duties"],
    ["Access review (Q1) sign-off", "Expired", ["3.1.5", "3.1.6"], "Least privilege reviewed"],
  ].map((e, i) => ({ id: crypto.randomUUID(), name: e[0], status: e[1], controlIds: e[2], objective: e[3], owner: people[i % people.length], assigned: people[(i + 2) % people.length], program: "CMMC Level 2", dueOn: day(ahead(15 + i * 7)) }));

  const actions = [
    ["Enforce MFA for remaining service accounts", "3.5.3", "High", "In Progress"],
    ["Deploy FIPS-validated modules on legacy hosts", "3.13.11", "High", "Open"],
    ["Finalize configuration baselines for dev", "3.4.1", "Medium", "In Progress"],
    ["Complete IR plan testing", "3.6.3", "Medium", "Open"],
    ["Automate audit log failure alerting", "3.3.4", "Low", "Open"],
    ["Close out overdue access reviews", "3.1.5", "Medium", "Done"],
  ].map((a) => ({ id: crypto.randomUUID(), title: a[0], controlId: a[1], priority: a[2], status: a[3], description: `Remediation for ${a[1]}.`, correctiveAction: "Implement, document, and attach supporting evidence.", created: ago(20) }));

  const controlSets = [
    { id: crypto.randomUUID(), name: "Cryptography & FIPS", description: "Imported", source: "library", controlIds: ["3.1.13", "3.1.17", "3.1.19", "3.5.10", "3.8.6", "3.13.8", "3.13.10", "3.13.11", "3.13.15", "3.13.16"], createdAt: ago(40) },
    { id: crypto.randomUUID(), name: "CUI enclave controls", description: "Custom scope for the CUI enclave", source: "custom", controlIds: CONTROLS.filter((c) => c.family === "AC" || c.family === "SC").map((c) => c.id), createdAt: ago(30) },
  ];

  const assets = [
    ["CUI File Server", "Server", "IT Ops", "CUI", "Critical", "On-prem"],
    ["M365 GCC High Tenant", "SaaS", "IT Ops", "CUI", "Critical", "Cloud"],
    ["Engineering Workstations", "Endpoint", "Engineering", "CUI", "High", "On-prem"],
    ["Backup Appliance", "Storage", "IT Ops", "CUI", "High", "On-prem"],
    ["Corporate Wi-Fi", "Network", "IT Ops", "Internal", "Medium", "On-prem"],
    ["Jump Host (VPN)", "Server", "Security", "CUI", "High", "Cloud"],
    ["HR System", "SaaS", "HR", "Internal", "Medium", "Cloud"],
    ["Public Website", "SaaS", "Marketing", "Public", "Low", "Cloud"],
  ].map((a) => ({ id: crypto.randomUUID(), name: a[0], type: a[1], owner: a[2], classification: a[3], criticality: a[4], environment: a[5] }));

  const mkAreas = (o) => Object.fromEntries(VENDOR_AREAS.map((a) => [a, o[a] || "low"]));
  const vendors = [
    ["Acme Cloud Hosting", "Tier 1", "Assessed", { Security: "high", Privacy: "medium", Compliance: "medium", Operational: "high" }],
    ["SecureBackup Inc", "Tier 2", "Approved", { Security: "medium", "Business Continuity": "high" }],
    ["PayrollPro", "Tier 2", "In Review", { Privacy: "high", Financial: "medium" }],
    ["DevTools SaaS", "Tier 3", "Assessed", { Security: "medium", Operational: "medium" }],
    ["Global Logistics", "Tier 1", "Flagged", { Security: "critical", Operational: "high", Compliance: "high" }],
    ["OfficeSupplies Co", "Tier 3", "Not Assessed", {}],
  ].map((v) => ({ id: crypto.randomUUID(), name: v[0], tier: v[1], status: v[2], areas: mkAreas(v[3]) }));

  const risks = [
    ["Unpatched externally-facing VPN", "Security", 4, 5, "Mitigating", "Mitigate", "Security"],
    ["Legacy hosts lack FIPS crypto", "Compliance", 3, 4, "Open", "Mitigate", "IT Ops"],
    ["Single backup site (no geo-redundancy)", "Operational", 2, 4, "Monitoring", "Accept", "IT Ops"],
    ["Vendor (Global Logistics) data exposure", "Third-party", 4, 4, "Open", "Transfer", "Procurement"],
    ["Insufficient IR testing cadence", "Operational", 3, 3, "Mitigating", "Mitigate", "Security"],
    ["Phishing susceptibility", "Security", 4, 3, "Mitigating", "Mitigate", "Security"],
    ["Shadow SaaS usage", "Compliance", 3, 2, "Open", "Avoid", "IT Ops"],
    ["Key personnel dependency", "Strategic", 2, 3, "Monitoring", "Accept", "Leadership"],
  ].map((r) => ({ id: crypto.randomUUID(), title: r[0], category: r[1], likelihood: r[2], impact: r[3], status: r[4], treatment: r[5], owner: r[6], description: "" }));

  const snapshots = [
    { id: crypto.randomUUID(), date: ago(90), avgScore: 14.2, totalRisks: 6, openCount: 5, counts: { critical: 2, high: 2, medium: 1, low: 1 } },
    { id: crypto.randomUUID(), date: ago(60), avgScore: 12.8, totalRisks: 7, openCount: 5, counts: { critical: 1, high: 3, medium: 2, low: 1 } },
    { id: crypto.randomUUID(), date: ago(30), avgScore: 11.1, totalRisks: 8, openCount: 4, counts: { critical: 1, high: 2, medium: 3, low: 2 } },
    { id: crypto.randomUUID(), date: ago(7), avgScore: 9.6, totalRisks: 8, openCount: 3, counts: { critical: 0, high: 2, medium: 3, low: 3 } },
  ];

  const docStatuses = ["Published", "Approved", "In Review", "Draft", "Not Started"];
  const documents = DEFAULT_DOCUMENTS.map((d, i) => ({
    ...d, owner: people[i % people.length], contributor: people[(i + 1) % people.length],
    status: docStatuses[i % docStatuses.length], reviewDate: day(ahead(30 + (i % 8) * 20)),
    classification: d.type === "policy" ? "Internal" : "Confidential",
    comments: i % 3 === 0 ? "Reviewed this quarter." : "", updates: i % 4 === 0 ? "Updated ownership." : "",
  }));

  const roster = [
    ["Alex Chen", "Security Lead", "Security", "Complete"], ["Maya Patel", "IT Operations", "IT", "Complete"],
    ["Jordan Rivera", "Software Engineer", "Engineering", "Pending"], ["Sam Okoro", "Compliance Manager", "Compliance", "Complete"],
    ["Lena Nguyen", "HR Manager", "HR", "Complete"], ["Dan Brooks", "DevOps", "Engineering", "Overdue"],
    ["Priya Rao", "Analyst", "Security", "Pending"], ["Tom Fisher", "Sales Engineer", "Sales", "Complete"],
    ["Nina Alvarez", "Program Manager", "PMO", "Complete"], ["Omar Haddad", "Systems Admin", "IT", "Pending"],
  ].map((p, i) => ({ id: crypto.randomUUID(), name: p[0], email: `${p[0].toLowerCase().replace(/[^a-z]/g, ".")}@meridian.example`, role: p[1], department: p[2], manager: i === 0 ? "" : "Alex Chen", status: "Active", training: p[3], startDate: day(ago(400 - i * 30)) }));

  const connectors = ["Okta", "Amazon Web Services", "GitHub", "Microsoft Intune", "Jira"];
  const connections = [
    ["Okta", "Okta (production)", "Identity"], ["GitHub", "GitHub — meridian-eng", "Source Code"],
    ["Amazon Web Services", "AWS GovCloud", "Cloud"], ["Jira", "Jira — Security board", "Ticketing"],
  ].map((c) => ({ id: crypto.randomUUID(), provider: c[0], name: c[1], category: c[2], status: "Connected", config: {}, createdAt: ago(50), lastSync: ago(0) }));

  const audits = [
    { id: crypto.randomUUID(), name: "Q2 internal readiness audit", type: "framework", scopeName: "CMMC Level 2", controlIds: CONTROLS.map((c) => c.id), lead: "Sam Okoro", assessor: "", dueDate: day(ahead(21)), status: "In Progress", result: "Not Determined", notes: "Internal practice run ahead of C3PAO.", createdAt: ago(10) },
    { id: crypto.randomUUID(), name: "CUI enclave spot check", type: "controlset", scopeName: "CUI enclave controls", controlIds: CONTROLS.filter((c) => c.family === "AC" || c.family === "SC").map((c) => c.id), lead: "Alex Chen", assessor: "", dueDate: day(ahead(45)), status: "Planned", result: "Not Determined", notes: "", createdAt: ago(5) },
    { id: crypto.randomUUID(), name: "C3PAO certification assessment", type: "thirdparty", scopeName: "CMMC Level 2 (full scope)", controlIds: CONTROLS.map((c) => c.id), lead: "Sam Okoro", assessor: "Cyber-AB Authorized C3PAO", dueDate: day(ahead(120)), status: "Planned", result: "Not Determined", notes: "Kickoff scheduled.", createdAt: ago(3) },
  ];

  const trust = {
    ...DEFAULT_TRUST, company: "Meridian Defense Systems", published: true,
    requests: [
      { id: crypto.randomUUID(), name: "Dana Lee", email: "dana@primecontractor.example", company: "Prime Contractor Inc", resourceName: "System Security Plan (SSP)", ndaRequired: true, ndaStatus: "Signed", status: "Approved", date: ago(6) },
      { id: crypto.randomUUID(), name: "Chris Vaughn", email: "chris@auditpartners.example", company: "Audit Partners", resourceName: "Penetration Test Report", ndaRequired: true, ndaStatus: "Sent", status: "Pending", date: ago(2) },
      { id: crypto.randomUUID(), name: "Robin Diaz", email: "robin@govbuyer.example", company: "Gov Buyer", resourceName: "CMMC Level 2 Status", ndaRequired: false, ndaStatus: "—", status: "Pending", date: ago(1) },
    ],
  };

  const generated = [
    { id: crypto.randomUUID(), name: "Executive Summary", ext: "html", content: "<html><body><h1>Compliance Summary</h1><p>Demo snapshot.</p></body></html>", date: ago(4), delivery: "Downloaded" },
    { id: crypto.randomUUID(), name: "Gap Report", ext: "csv", content: "Control,Requirement,Answer\n3.5.3,Use MFA,Partially", date: ago(2), delivery: "Emailed to ciso@meridian.example" },
  ];
  const scheduled = [
    { id: crypto.randomUUID(), typeId: "exec", name: "Executive Summary", frequency: "Weekly", recipient: "leadership@meridian.example", enabled: true, nextRun: ahead(5) },
    { id: crypto.randomUUID(), typeId: "poam", name: "POA&M Report", frequency: "Monthly", recipient: "ciso@meridian.example", enabled: true, nextRun: ahead(20) },
  ];

  const settings = { orgName: "Meridian Defense Systems", poc: "Alex Chen", targetDate: day(ahead(120)) };

  return { assessment, evidence, actions, customFrameworks: [], controlSets, assets, vendors, risks, snapshots, documents, people: roster, connectors, connections, audits, trust, generated, scheduled, settings };
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [openGroup, setOpenGroup] = useState(null);
  const [assessment, setAssessment] = useState({}); // { id: { status, note } }
  const [evidence, setEvidence] = useState([]);
  const [actions, setActions] = useState([]);
  const [customFrameworks, setCustomFrameworks] = useState([]);
  const [controlSets, setControlSets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [risks, setRisks] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [people, setPeople] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [audits, setAudits] = useState([]);
  const [trust, setTrust] = useState(DEFAULT_TRUST);
  const [generated, setGenerated] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const ready = useRef(false);

  // load
  useEffect(() => {
    (async () => {
      const seeded = await storeGet(KEY_SEEDED);
      if (!seeded) {
        const d = buildDemo();
        setAssessment(d.assessment); setEvidence(d.evidence); setActions(d.actions);
        setCustomFrameworks(d.customFrameworks); setControlSets(d.controlSets);
        setAssets(d.assets); setVendors(d.vendors); setRisks(d.risks); setSnapshots(d.snapshots);
        setDocuments(d.documents); setPeople(d.people); setConnectors(d.connectors);
        setConnections(d.connections); setAudits(d.audits); setTrust(d.trust);
        setGenerated(d.generated); setScheduled(d.scheduled); setSettings(d.settings);
        await storeSet(KEY_SEEDED, true);
        ready.current = true;
        setLoading(false);
        return;
      }
      const [a, e, ac, fw, cs, as, vn, rk, sn, dc, pe, cn, ig, au, tr, gr, sr, st] = await Promise.all([
        storeGet(KEY_ASSESS), storeGet(KEY_EVID), storeGet(KEY_ACT), storeGet(KEY_FW), storeGet(KEY_SETS),
        storeGet(KEY_ASSETS), storeGet(KEY_VENDORS), storeGet(KEY_RISKS), storeGet(KEY_SNAPS), storeGet(KEY_DOCS),
        storeGet(KEY_PEOPLE), storeGet(KEY_CONN), storeGet(KEY_INTEG), storeGet(KEY_AUDITS), storeGet(KEY_TRUST),
        storeGet(KEY_GENREP), storeGet(KEY_SCHEDREP), storeGet(KEY_SETTINGS),
      ]);
      if (a) setAssessment(a);
      if (e) setEvidence(e);
      if (ac) setActions(ac);
      if (fw) setCustomFrameworks(fw);
      if (cs) setControlSets(cs);
      if (as) setAssets(as);
      if (vn) setVendors(vn);
      if (rk) setRisks(rk);
      if (sn) setSnapshots(sn);
      setDocuments(dc ?? DEFAULT_DOCUMENTS);
      if (pe) setPeople(pe);
      if (cn) setConnectors(cn);
      if (ig) setConnections(ig);
      if (au) setAudits(au);
      if (tr) setTrust(tr);
      if (gr) setGenerated(gr);
      if (sr) setScheduled(sr);
      if (st) setSettings(st);
      ready.current = true;
      setLoading(false);
    })();
  }, []);

  useEffect(() => { if (ready.current) storeSet(KEY_ASSESS, assessment); }, [assessment]);
  useEffect(() => { if (ready.current) storeSet(KEY_EVID, evidence); }, [evidence]);
  useEffect(() => { if (ready.current) storeSet(KEY_ACT, actions); }, [actions]);
  useEffect(() => { if (ready.current) storeSet(KEY_FW, customFrameworks); }, [customFrameworks]);
  useEffect(() => { if (ready.current) storeSet(KEY_SETS, controlSets); }, [controlSets]);
  useEffect(() => { if (ready.current) storeSet(KEY_ASSETS, assets); }, [assets]);
  useEffect(() => { if (ready.current) storeSet(KEY_VENDORS, vendors); }, [vendors]);
  useEffect(() => { if (ready.current) storeSet(KEY_RISKS, risks); }, [risks]);
  useEffect(() => { if (ready.current) storeSet(KEY_SNAPS, snapshots); }, [snapshots]);
  useEffect(() => { if (ready.current) storeSet(KEY_DOCS, documents); }, [documents]);
  useEffect(() => { if (ready.current) storeSet(KEY_PEOPLE, people); }, [people]);
  useEffect(() => { if (ready.current) storeSet(KEY_CONN, connectors); }, [connectors]);
  useEffect(() => { if (ready.current) storeSet(KEY_INTEG, connections); }, [connections]);
  useEffect(() => { if (ready.current) storeSet(KEY_AUDITS, audits); }, [audits]);
  useEffect(() => { if (ready.current) storeSet(KEY_TRUST, trust); }, [trust]);
  useEffect(() => { if (ready.current) storeSet(KEY_GENREP, generated); }, [generated]);
  useEffect(() => { if (ready.current) storeSet(KEY_SCHEDREP, scheduled); }, [scheduled]);
  useEffect(() => { if (ready.current) storeSet(KEY_SETTINGS, settings); }, [settings]);

  // action modal (shared)
  const [actionModal, setActionModal] = useState(null);

  const setStatus = (id, status) =>
    setAssessment((p) => ({ ...p, [id]: { ...(p[id] || {}), status } }));
  const setNote = (id, note) =>
    setAssessment((p) => ({ ...p, [id]: { ...(p[id] || {}), note } }));

  /* ----- derived stats ----- */
  const overall = useMemo(() => tally(CONTROLS, assessment), [assessment]);
  const sprs = useMemo(() => {
    let d = 0;
    for (const c of CONTROLS) d += deduction(assessment[c.id]?.status, c.id);
    return 110 - d;
  }, [assessment]);

  const evidenceByControl = useMemo(() => {
    const map = {};
    for (const ev of evidence) for (const cid of ev.controlIds || []) (map[cid] ||= []).push(ev);
    return map;
  }, [evidence]);

  const openActions = actions.filter((a) => a.status !== "Done").length;

  const allFrameworks = useMemo(() => [...FRAMEWORKS_BUILTIN, ...customFrameworks], [customFrameworks]);
  const [fwModal, setFwModal] = useState(false);
  const addFramework = (fw) => setCustomFrameworks((p) => [...p, { ...fw, id: crypto.randomUUID(), builtin: false, sprs: false, controlIds: [] }]);
  const removeFramework = (id) => setCustomFrameworks((p) => p.filter((f) => f.id !== id));

  const addControlSet = (set) => setControlSets((p) => [...p, { ...set, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  const updateControlSet = (id, patch) => setControlSets((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeControlSet = (id) => setControlSets((p) => p.filter((s) => s.id !== id));

  const resetAll = () => {
    setAssessment({}); setEvidence([]); setActions([]); setCustomFrameworks([]); setControlSets([]);
    setAssets([]); setVendors([]); setRisks([]); setSnapshots([]); setDocuments(DEFAULT_DOCUMENTS); setPeople([]); setConnectors([]); setConnections([]); setAudits([]); setTrust(DEFAULT_TRUST); setGenerated([]); setScheduled([]); setSettings(DEFAULT_SETTINGS);
  };

  const exportWorkspace = () => {
    const obj = { exportedAt: new Date().toISOString(), assessment, evidence, actions, customFrameworks, controlSets, assets, vendors, risks, snapshots, documents, people, connectors, connections, audits, trust, generated, scheduled, settings };
    triggerDownload("rampart-workspace.json", JSON.stringify(obj, null, 2), "json");
  };
  const importWorkspace = (o) => {
    if (o.assessment) setAssessment(o.assessment);
    if (o.evidence) setEvidence(o.evidence);
    if (o.actions) setActions(o.actions);
    if (o.customFrameworks) setCustomFrameworks(o.customFrameworks);
    if (o.controlSets) setControlSets(o.controlSets);
    if (o.assets) setAssets(o.assets);
    if (o.vendors) setVendors(o.vendors);
    if (o.risks) setRisks(o.risks);
    if (o.snapshots) setSnapshots(o.snapshots);
    if (o.documents) setDocuments(o.documents);
    if (o.people) setPeople(o.people);
    if (o.connectors) setConnectors(o.connectors);
    if (o.connections) setConnections(o.connections);
    if (o.audits) setAudits(o.audits);
    if (o.trust) setTrust(o.trust);
    if (o.generated) setGenerated(o.generated);
    if (o.scheduled) setScheduled(o.scheduled);
    if (o.settings) setSettings(o.settings);
  };
  const loadDemo = () => { importWorkspace(buildDemo()); setView("home"); };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-zinc-400">
        <div className="animate-pulse text-sm">Loading your CMMC workspace…</div>
      </div>
    );
  }

  const NAV = [
    { id: "home", label: "Home", Icon: LayoutGrid },
    { id: "assessment", label: "Assessment", Icon: LayoutDashboard },
    { id: "frameworks", label: "Frameworks", Icon: Layers, badge: allFrameworks.length },
    { id: "controls", label: "Controls", Icon: ListChecks, badge: overall.notAnswered },
    { id: "risks", label: "Risks", Icon: ShieldAlert, children: [
      { id: "risks:assets", label: "Assets", badge: assets.length || null },
      { id: "risks:vendors", label: "Vendors", badge: vendors.length || null },
      { id: "risks:register", label: "Risk Register", badge: risks.length || null },
    ] },
    { id: "documents", label: "Documents", Icon: FileText, children: [
      { id: "documents:policies", label: "Policies", badge: documents.filter((d) => d.type === "policy").length || null },
      { id: "documents:procedures", label: "Procedures", badge: documents.filter((d) => d.type === "procedure").length || null },
      { id: "documents:governance", label: "Governance", badge: documents.filter((d) => d.type === "governance").length || null },
    ] },
    { id: "monitoring", label: "Monitoring", Icon: Activity, children: [
      { id: "monitoring:evidence", label: "Evidence", badge: evidence.length || null },
      { id: "monitoring:systems", label: "Systems", badge: connectors.length || null },
      { id: "monitoring:people", label: "People", badge: people.length || null },
    ] },
    { id: "integrations", label: "Integrations", Icon: Plug, badge: connections.length || null },
    { id: "poam", label: "POA&M", Icon: ClipboardList, badge: openActions },
    { id: "audits", label: "Audits", Icon: Gavel, badge: audits.length || null },
    { id: "trust", label: "Trust", Icon: ShieldCheck, badge: trust.requests.filter((r) => r.status === "Pending").length || null },
    { id: "reports", label: "Reports", Icon: FileBarChart, badge: scheduled.length || null },
  ];

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 font-sans text-zinc-900" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside className="flex w-56 flex-shrink-0 flex-col bg-slate-900 text-slate-300">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-white"><Shield size={17} /></div>
          <div>
            <div className="text-sm font-semibold leading-tight text-white">Rampart</div>
            <div className="text-[10px] leading-tight text-slate-400">CMMC Level 2 Console</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            if (n.children) {
              const active = view.startsWith(n.id);
              const expanded = openGroup === n.id || active;
              return (
                <div key={n.id}>
                  <button
                    onClick={() => { setOpenGroup(expanded && openGroup === n.id ? null : n.id); if (!active) setView(n.children[0].id); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
                    <span className="flex items-center gap-2.5"><n.Icon size={16} /> {n.label}</span>
                    {expanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                  </button>
                  {expanded && (
                    <div className="mt-1 space-y-0.5 pl-4">
                      {n.children.map((c) => (
                        <button key={c.id} onClick={() => { setView(c.id); setOpenGroup(n.id); }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors ${view === c.id ? "bg-slate-800 font-medium text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
                          <span>{c.label}</span>
                          {c.badge ? <span className="rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">{c.badge}</span> : null}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button key={n.id} onClick={() => setView(n.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === n.id ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
                <span className="flex items-center gap-2.5"><n.Icon size={16} /> {n.label}</span>
                {n.badge ? <span className="rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">{n.badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <div className="mb-2 rounded-lg bg-slate-800/60 px-3 py-2 text-[11px] leading-snug text-slate-400">
            NIST SP 800-171 Rev 2 · 110 controls · 14 families
          </div>
          <button onClick={() => setView("settings")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === "settings" ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
            <SettingsIcon size={16} /> Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-6">
          {view === "home" && <HomePage orgName={settings.orgName} sprs={sprs} overall={overall} stats={{ openActions, risks: risks.length, vendors: vendors.length, assets: assets.length, people: people.length, documents: documents.length, evidence: evidence.length, audits: audits.length, pendingTrust: trust.requests.filter((r) => r.status === "Pending").length }} onGoto={setView} />}
          {view === "settings" && <SettingsPage settings={settings} setSettings={setSettings} onExport={exportWorkspace} onImport={importWorkspace} onReset={resetAll} onLoadDemo={loadDemo} />}
          {view === "assessment" && <Assessment assessment={assessment} overall={overall} sprs={sprs} actions={actions} evidenceByControl={evidenceByControl} frameworks={allFrameworks} onGoto={setView} />}
          {view === "frameworks" && <Frameworks frameworks={allFrameworks} assessment={assessment} evidenceByControl={evidenceByControl} sprs={sprs} onAdd={() => setFwModal(true)} onRemove={removeFramework} onGoto={setView} />}
          {view === "controls" && <Controls assessment={assessment} setStatus={setStatus} setNote={setNote} evidenceByControl={evidenceByControl} onCreateAction={(c) => setActionModal({ controlId: c.id, prefill: c })} controlSets={controlSets} addControlSet={addControlSet} updateControlSet={updateControlSet} removeControlSet={removeControlSet} />}
          {view.startsWith("risks") && <Risks sub={view.split(":")[1] || "assets"} assets={assets} setAssets={setAssets} vendors={vendors} setVendors={setVendors} risks={risks} setRisks={setRisks} snapshots={snapshots} setSnapshots={setSnapshots} />}
          {view.startsWith("documents") && <Documents sub={view.split(":")[1] || "policies"} documents={documents} setDocuments={setDocuments} />}
          {view.startsWith("monitoring") && <Monitoring sub={view.split(":")[1] || "evidence"} evidence={evidence} setEvidence={setEvidence} connectors={connectors} setConnectors={setConnectors} people={people} setPeople={setPeople} />}
          {view === "integrations" && <Integrations connections={connections} setConnections={setConnections} />}
          {view === "poam" && <Poam actions={actions} setActions={setActions} onNew={() => setActionModal({})} />}
          {view === "audits" && <Audits audits={audits} setAudits={setAudits} frameworks={allFrameworks} controlSets={controlSets} assessment={assessment} evidenceByControl={evidenceByControl} />}
          {view === "trust" && <Trust trust={trust} setTrust={setTrust} sprs={sprs} overall={overall} />}
          {view === "reports" && <Reports data={{ assessment, sprs, overall, evidence, risks, vendors, assets, people, actions, documents, audits, frameworks: allFrameworks, orgName: settings.orgName }} generated={generated} setGenerated={setGenerated} scheduled={scheduled} setScheduled={setScheduled} />}
        </div>
      </main>

      {actionModal !== null && (
        <ActionModal
          initial={actionModal}
          onClose={() => setActionModal(null)}
          onSave={(item) => { setActions((p) => [...p, { ...item, id: crypto.randomUUID(), created: new Date().toISOString() }]); setActionModal(null); setView("poam"); }}
        />
      )}
      {fwModal && (
        <AddFrameworkModal onClose={() => setFwModal(false)} onSave={(fw) => { addFramework(fw); setFwModal(false); }} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ASSESSMENT (landing tab)                                            */
/* ------------------------------------------------------------------ */

// Built-in frameworks with a loaded control set. Custom ones are added by the user.
const FRAMEWORKS_BUILTIN = [
  { id: "cmmc-l2", name: "CMMC Level 2", sub: "NIST SP 800-171 Rev 2", builtin: true, sprs: true, controlIds: CONTROLS.map((c) => c.id) },
];

function buildRecommendations(assessment, overall, evidenceByControl) {
  const recs = [];
  if (overall.notAnswered > 0) {
    recs.push({ tone: "info", text: `${overall.notAnswered} of 110 questions are still unanswered — finish the assessment for an accurate score.`, action: { label: "Answer questions", view: "controls" } });
  }
  const gaps = CONTROLS
    .filter((c) => { const s = assessment[c.id]?.status; return s === "no" || s === "partial"; })
    .sort((a, b) => weightOf(b.id) - weightOf(a.id));
  if (gaps.length) {
    const top = gaps.slice(0, 5).map((c) => c.id).join(", ");
    recs.push({ tone: "warn", text: `Prioritize your highest-weight gaps first (most SPRS points recovered): ${top}.`, action: { label: "Open POA&M", view: "poam" } });
  }
  const noEvidence = CONTROLS.filter((c) => assessment[c.id]?.status === "yes" && !(evidenceByControl[c.id]?.length));
  if (noEvidence.length) {
    recs.push({ tone: "info", text: `${noEvidence.length} "Yes" answers have no evidence attached — add artifacts so they hold up under assessment.`, action: { label: "Add evidence", view: "monitoring:evidence" } });
  }
  const untouched = FAMILIES.filter((f) => tally(CONTROLS.filter((c) => c.family === f.key), assessment).answeredPct === 0);
  if (untouched.length && overall.notAnswered > 0) {
    recs.push({ tone: "info", text: `Untouched families: ${untouched.map((f) => f.name).join(", ")}. Start there to spread coverage.` });
  }
  if (recs.length === 0) {
    recs.push({ tone: "good", text: "Every applicable requirement is answered and met. Keep evidence current and run periodic reassessments." });
  }
  return recs;
}

const PRI_COLOR = (p) => (p === "High" ? "rose" : p === "Medium" ? "amber" : "zinc");

function Assessment({ assessment, overall, sprs, actions, evidenceByControl, frameworks, onGoto }) {
  const scoreHex = overall.scorePct >= 80 ? "#10b981" : overall.scorePct >= 50 ? "#f59e0b" : "#f43f5e";
  const recs = buildRecommendations(assessment, overall, evidenceByControl);
  const openItems = actions.filter((a) => a.status !== "Done");
  const groups = FAMILIES.map((f) => ({ ...f, counts: tally(CONTROLS.filter((c) => c.family === f.key), assessment) }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Assessment</h1>
        <p className="text-sm text-zinc-500">Readiness against the 110 CMMC Level 2 requirements.</p>
      </header>

      {/* Top row: score, answering progress, SPRS */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 self-start text-sm font-medium text-zinc-700">Assessment score</div>
          <ProgressRing pct={overall.scorePct} hex={scoreHex} bottom="readiness" />
          <div className="mt-2 text-xs text-zinc-400">{overall.yes} met · {overall.partial} partial · {110 - overall.na} applicable</div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 text-sm font-medium text-zinc-700">Answering progress</div>
          <div className="flex items-center gap-4">
            <Donut segments={segmentsFrom(overall)} centerTop={`${overall.answeredPct}%`} centerBottom="answered" />
            <div className="flex-1"><AnswerLegend counts={overall} compact /></div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 text-sm font-medium text-zinc-700">SPRS estimate</div>
          <SprsGauge score={sprs} />
        </div>
      </div>

      {/* Answering progress by framework */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 text-sm font-medium text-zinc-700">Answering progress by framework</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {frameworks.filter((fw) => fw.controlIds.length > 0).map((fw) => {
            const c = tally(CONTROLS.filter((x) => fw.controlIds.includes(x.id)), assessment);
            return (
              <div key={fw.id} className="flex items-center gap-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                <Donut size={92} segments={segmentsFrom(c)} centerTop={`${c.answeredPct}%`} centerBottom="answered" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-zinc-900">{fw.name}</div>
                  <div className="text-xs text-zinc-400">{fw.sub} · {c.total} questions</div>
                  <div className="mt-2"><AnswerLegend counts={c} /></div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs">
                    <span className="text-zinc-500">Score</span>
                    <span className="font-mono font-semibold" style={{ color: c.scorePct >= 80 ? "#059669" : c.scorePct >= 50 ? "#d97706" : "#e11d48" }}>{c.scorePct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action items & recommendations */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 text-sm font-medium text-zinc-700">Recommendations</div>
          <ul className="space-y-2.5">
            {recs.map((r, i) => {
              const tint = r.tone === "warn" ? "amber" : r.tone === "good" ? "emerald" : "indigo";
              const RIcon = r.tone === "warn" ? AlertTriangle : r.tone === "good" ? CheckCircle2 : Info;
              return (
                <li key={i} className="flex gap-2.5">
                  <RIcon size={16} className={`mt-0.5 flex-shrink-0 text-${tint}-500`} />
                  <div className="text-sm text-zinc-700">
                    {r.text}
                    {r.action && (
                      <button onClick={() => onGoto(r.action.view)} className="ml-1.5 font-medium text-indigo-600 hover:text-indigo-700">{r.action.label} →</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-700">Open action items</div>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs tabular-nums text-zinc-600">{openItems.length}</span>
          </div>
          {openItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-400">No open items. Flag gaps in Controls to populate your POA&amp;M.</div>
          ) : (
            <>
              <ul className="space-y-2">
                {openItems.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2">
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full bg-${PRI_COLOR(a.priority)}-400`} />
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-700">{a.title}</span>
                    {a.controlId && <span className="font-mono text-xs text-zinc-400">{a.controlId}</span>}
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">{a.status}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onGoto("poam")} className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700">View all in POA&amp;M →</button>
            </>
          )}
        </div>
      </section>

      {/* Assessment progress by question group */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-medium text-zinc-700">Assessment progress by question group</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {ANSWER_KEYS.map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="h-2 w-2 rounded-full" style={{ background: answerMeta(k).hex }} />{answerMeta(k).label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {groups.map((g) => (
            <button key={g.key} onClick={() => onGoto("controls")}
              className="flex flex-col items-center rounded-lg border border-zinc-100 p-3 text-center hover:border-indigo-200 hover:bg-indigo-50/40">
              <Donut size={78} thickness={11} segments={segmentsFrom(g.counts)} centerTop={`${g.counts.answeredPct}%`} />
              <div className="mt-2 font-mono text-[11px] text-zinc-400">{g.code}</div>
              <div className="text-xs font-medium leading-tight text-zinc-700">{g.name}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FRAMEWORKS (My Frameworks dashboard)                                */
/* ------------------------------------------------------------------ */

function Frameworks({ frameworks, assessment, evidenceByControl, sprs, onAdd, onRemove, onGoto }) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Frameworks</h1>
          <p className="text-sm text-zinc-500">Every standard this client is working toward, with live compliance status.</p>
        </div>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={15} /> Add framework
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.id} fw={fw} assessment={assessment} evidenceByControl={evidenceByControl} onRemove={onRemove} onGoto={onGoto} />
        ))}
      </div>
    </div>
  );
}

function FrameworkCard({ fw, assessment, evidenceByControl, onRemove, onGoto }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const empty = fw.controlIds.length === 0;
  const c = complianceTally(fw.controlIds, assessment, evidenceByControl);
  const sprsScore = useMemo(() => {
    if (!fw.sprs) return null;
    let d = 0;
    for (const id of fw.controlIds) d += deduction(assessment[id]?.status, id);
    return 110 - d;
  }, [fw, assessment]);
  const categories = useMemo(() => (fw.sprs ? sprsByCategory(fw.controlIds, assessment) : []), [fw, assessment]);
  const band = sprsScore == null ? null : sprsScore >= 110 ? "#059669" : sprsScore >= 88 ? "#d97706" : "#e11d48";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-zinc-900">{fw.name}</div>
          <div className="text-xs text-zinc-400">{fw.sub || "Custom framework"}</div>
        </div>
        <div className="flex items-center gap-2">
          {empty && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">Control set not loaded</span>}
          {!fw.builtin && (
            <button onClick={() => onRemove(fw.id)} className="text-zinc-300 hover:text-rose-500" title="Remove framework"><Trash2 size={15} /></button>
          )}
        </div>
      </div>

      {empty ? (
        <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-5 text-center text-sm text-zinc-500">
          No control set is loaded for this framework yet.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Compliance donut */}
          <Donut size={116} segments={complianceSegments(c)} centerTop={`${c.compliancePct}%`} centerBottom="compliant" />

          <div className="flex-1">
            {/* SPRS score (clickable) */}
            {fw.sprs && (
              <button onClick={() => setShowBreakdown((v) => !v)}
                className="mb-3 flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
                <span className="flex items-center gap-2 text-sm text-zinc-600"><Shield size={15} style={{ color: band }} /> SPRS score</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-lg font-bold" style={{ color: band }}>{sprsScore}</span>
                  <span className="font-mono text-xs text-zinc-400">/110</span>
                  {showBreakdown ? <ChevronDown size={15} className="text-zinc-400" /> : <ChevronRight size={15} className="text-zinc-400" />}
                </span>
              </button>
            )}
            {/* Compliance legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {COMPLIANCE_KEYS.map((k) => (
                <div key={k} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COMPLIANCE[k].hex }} />
                  <span className="text-zinc-600">{COMPLIANCE[k].label}</span>
                  <span className="ml-auto font-mono tabular-nums font-medium text-zinc-800">{c[k]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Per-category SPRS breakdown */}
      {fw.sprs && showBreakdown && !empty && (
        <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>SPRS score by category</span>
            <span className="font-mono">retained / possible</span>
          </div>
          <div className="space-y-1.5">
            {categories.map((r) => {
              const pct = r.possible ? (r.retained / r.possible) * 100 : 100;
              const barColor = pct >= 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#f43f5e";
              return (
                <div key={r.key} className="flex items-center gap-3">
                  <span className="w-10 font-mono text-[11px] text-zinc-400">{r.code}</span>
                  <span className="w-40 truncate text-xs text-zinc-600" title={r.name}>{r.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                  <span className="w-14 text-right font-mono text-[11px] tabular-nums text-zinc-600">{r.retained}/{r.possible}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-400">
            <Info size={11} /> Possible points are the SPRS weights at risk in each category; retained is what you keep after deductions.
          </div>
        </div>
      )}

      {!empty && (
        <button onClick={() => onGoto("controls")} className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700">Work on this framework →</button>
      )}
    </div>
  );
}

function AddFrameworkModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  return (
    <ModalShell title="Add framework" onClose={onClose}>
      <p className="mb-3 text-xs text-zinc-500">
        Add a standard this client should work toward. Only CMMC Level 2 ships with a loaded control set today —
        added frameworks appear as placeholders until their controls are populated.
      </p>
      <label className="block text-xs font-medium text-zinc-600">Framework name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SOC 2, HIPAA, ISO 27001, CMMC Level 1"
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <label className="mt-3 block text-xs font-medium text-zinc-600">Standard / description</label>
      <input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="e.g. AICPA Trust Services Criteria"
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), sub: sub.trim() })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Add framework</button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTROLS — control sets                                            */
/* ------------------------------------------------------------------ */

// Importable library of ready-made control sets, derived from the real catalog.
const LIBRARY = [
  ...FAMILIES.map((f) => ({
    id: `lib-fam-${f.key}`, name: `${f.name} (${f.code})`,
    description: `All ${CONTROLS.filter((c) => c.family === f.key).length} controls in the ${f.name} family.`,
    controlIds: CONTROLS.filter((c) => c.family === f.key).map((c) => c.id),
  })),
  { id: "lib-high", name: "High-priority controls (5-point SPRS)",
    description: "The controls that cost the most SPRS points if unmet.",
    controlIds: CONTROLS.filter((c) => weightOf(c.id) === 5).map((c) => c.id) },
  { id: "lib-idam", name: "Access & Identity (AC + IA)",
    description: "Access control and identification/authentication controls together.",
    controlIds: CONTROLS.filter((c) => c.family === "AC" || c.family === "IA").map((c) => c.id) },
  { id: "lib-crypto", name: "Cryptography & FIPS",
    description: "Controls that require encryption or FIPS-validated cryptography.",
    controlIds: ["3.1.13", "3.1.17", "3.1.19", "3.5.10", "3.8.6", "3.13.8", "3.13.10", "3.13.11", "3.13.15", "3.13.16"] },
];

const BASELINE_SET = { id: "baseline", name: "CMMC Level 2 baseline", source: "baseline", builtin: true, controlIds: CONTROLS.map((c) => c.id) };

function setProgress(controlIds, assessment, evidenceByControl) {
  const a = tally(CONTROLS.filter((c) => controlIds.includes(c.id)), assessment);
  const comp = complianceTally(controlIds, assessment, evidenceByControl);
  return { ...comp, answeredPct: a.answeredPct, answered: a.total - a.notAnswered, total: a.total };
}

function Controls({ assessment, setStatus, setNote, evidenceByControl, onCreateAction, controlSets, addControlSet, updateControlSet, removeControlSet }) {
  const [openId, setOpenId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(null); // set being edited

  const allSets = [BASELINE_SET, ...controlSets];
  const openSet = allSets.find((s) => s.id === openId);

  if (openSet) {
    return (
      <ControlSetDetail
        set={openSet} isBaseline={openSet.builtin}
        assessment={assessment} setStatus={setStatus} setNote={setNote}
        evidenceByControl={evidenceByControl} onCreateAction={onCreateAction}
        onBack={() => setOpenId(null)}
        onEditControls={openSet.builtin ? null : () => setEditOpen(openSet)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Controls</h1>
          <p className="text-sm text-zinc-500">Your baseline control set and any custom or imported sets.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setImportOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Download size={15} /> Import from library
          </button>
          <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={15} /> Create control set
          </button>
        </div>
      </header>

      <div className="space-y-3">
        {allSets.map((s) => (
          <ControlSetCard key={s.id} set={s}
            progress={setProgress(s.controlIds, assessment, evidenceByControl)}
            onOpen={() => setOpenId(s.id)}
            onRemove={s.builtin ? null : () => removeControlSet(s.id)} />
        ))}
      </div>

      {createOpen && (
        <SetControlPicker title="Create control set" requireName initialName="" initialIds={[]}
          onClose={() => setCreateOpen(false)}
          onSave={({ name, description, controlIds }) => { addControlSet({ name, description, controlIds, source: "custom" }); setCreateOpen(false); }} />
      )}
      {editOpen && (
        <SetControlPicker title={`Edit “${editOpen.name}”`} requireName initialName={editOpen.name} initialDescription={editOpen.description} initialIds={editOpen.controlIds}
          onClose={() => setEditOpen(null)}
          onSave={({ name, description, controlIds }) => { updateControlSet(editOpen.id, { name, description, controlIds }); setEditOpen(null); }} />
      )}
      {importOpen && (
        <ImportLibraryModal existingNames={controlSets.map((s) => s.name)}
          onClose={() => setImportOpen(false)}
          onImport={(item) => addControlSet({ name: item.name, description: item.description, controlIds: item.controlIds, source: "library" })} />
      )}
    </div>
  );
}

function ControlSetCard({ set, progress, onOpen, onRemove }) {
  const badge = set.source === "baseline" ? { t: "Baseline", c: "indigo" } : set.source === "library" ? { t: "Library", c: "sky" } : { t: "Custom", c: "zinc" };
  const empty = set.controlIds.length === 0;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900">{set.name}</span>
            <span className={`rounded-full bg-${badge.c}-50 px-2 py-0.5 text-[11px] font-medium text-${badge.c}-700`}>{badge.t}</span>
          </div>
          <div className="text-xs text-zinc-400">{set.controlIds.length} controls{set.description ? ` · ${set.description}` : ""}</div>
        </div>
        <button onClick={onOpen} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Open</button>
        {onRemove && <button onClick={onRemove} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>}
      </div>

      {!empty && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium text-zinc-700">{progress.compliancePct}% compliant</span>
            <span className="font-mono">{progress.answered}/{progress.total} answered</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
            {complianceSegments(progress).map((seg) => seg.value > 0 && (
              <div key={seg.key} style={{ width: `${(seg.value / progress.total) * 100}%`, background: seg.hex }} title={`${seg.label}: ${seg.value}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImportLibraryModal({ existingNames, onClose, onImport }) {
  const [imported, setImported] = useState(() => new Set());
  return (
    <ModalShell title="Import from library" onClose={onClose}>
      <p className="mb-3 text-xs text-zinc-500">Ready-made control sets drawn from the NIST 800-171 Rev 2 catalog. Importing adds a copy you can work on.</p>
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {LIBRARY.map((item) => {
          const already = existingNames.includes(item.name) || imported.has(item.id);
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-800">{item.name}</div>
                <div className="text-xs text-zinc-400">{item.controlIds.length} controls · {item.description}</div>
              </div>
              <button disabled={already}
                onClick={() => { onImport(item); setImported((p) => new Set(p).add(item.id)); }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${already ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                {already ? "Imported ✓" : "Import"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Done</button>
      </div>
    </ModalShell>
  );
}

function SetControlPicker({ title, initialName = "", initialDescription = "", initialIds = [], onClose, onSave }) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [selected, setSelected] = useState(() => new Set(initialIds));
  const [q, setQ] = useState("");
  const [fam, setFam] = useState("all");
  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const list = CONTROLS.filter((c) => (fam === "all" || c.family === fam) && (!q || c.id.includes(q) || c.title.toLowerCase().includes(q.toLowerCase())));
  const allShown = list.length > 0 && list.every((c) => selected.has(c.id));
  const toggleAll = () => setSelected((p) => { const n = new Set(p); list.forEach((c) => allShown ? n.delete(c.id) : n.add(c.id)); return n; });

  return (
    <ModalShell title={title} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. In-scope controls for CUI enclave"
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <label className="mt-3 block text-xs font-medium text-zinc-600">Description</label>
      <input value={description} onChange={(e) => setDescription(e.target.value)}
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-600">Controls ({selected.size} selected)</label>
        <button onClick={toggleAll} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">{allShown ? "Clear shown" : "Select shown"}</button>
      </div>
      <div className="mt-1 flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…"
            className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
        </div>
        <select value={fam} onChange={(e) => setFam(e.target.value)} className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">
          <option value="all">All families</option>
          {FAMILIES.map((f) => <option key={f.key} value={f.key}>{f.code} {f.name}</option>)}
        </select>
      </div>
      <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-zinc-200">
        {list.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="accent-indigo-600" />
            <span className="font-mono text-xs text-zinc-500">{c.id}</span>
            <span className="truncate text-zinc-600">{c.title}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), description: description.trim(), controlIds: [...selected] })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Save</button>
      </div>
    </ModalShell>
  );
}

function ControlSetDetail({ set, isBaseline, assessment, setStatus, setNote, evidenceByControl, onCreateAction, onBack, onEditControls }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openFamilies, setOpenFamilies] = useState(() => new Set(["AC"]));
  const [openNotes, setOpenNotes] = useState(() => new Set());
  const setIds = useMemo(() => new Set(set.controlIds), [set]);

  const toggleFamily = (k) => setOpenFamilies((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleNote = (id) => setOpenNotes((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const matches = (c) => {
    const st = assessment[c.id]?.status || "notAnswered";
    if (statusFilter !== "all" && st !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!c.id.includes(q) && !c.title.toLowerCase().includes(q)) return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800">
        <ChevronLeft size={15} /> All control sets
      </button>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{set.name}</h1>
          <p className="text-sm text-zinc-500">{set.controlIds.length} controls · assess each requirement, attach a response, and flag gaps.</p>
        </div>
        {onEditControls && (
          <button onClick={onEditControls} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <ListChecks size={15} /> Edit controls
          </button>
        )}
      </header>

      {set.controlIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <ListChecks className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">This set has no controls yet</p>
          {onEditControls && <button onClick={onEditControls} className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">Add controls →</button>}
        </div>
      ) : (
      <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-2.5 text-zinc-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search control ID or text…"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
          <option value="all">All statuses</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
          <option value="notAnswered">Not Answered</option>
        </select>
      </div>

      <div className="space-y-3">
        {FAMILIES.map((f) => {
          const all = CONTROLS.filter((c) => c.family === f.key && setIds.has(c.id));
          if (all.length === 0) return null;
          const list = all.filter((c) => matches(c));
          if (list.length === 0) return null;
          const yesCount = all.filter((c) => assessment[c.id]?.status === "yes").length;
          const open = openFamilies.has(f.key);
          return (
            <div key={f.key} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <button onClick={() => toggleFamily(f.key)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50">
                {open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
                <span className="font-mono text-xs text-zinc-400">{f.code}</span>
                <span className="font-medium text-zinc-800">{f.name}</span>
                <span className="ml-auto font-mono text-xs tabular-nums text-zinc-400">{yesCount}/{all.length}</span>
              </button>
              {open && (
                <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                  {list.map((c) => {
                    const entry = assessment[c.id] || {};
                    const evs = evidenceByControl[c.id] || [];
                    const noteOpen = openNotes.has(c.id);
                    const isGap = entry.status === "no" || entry.status === "partial";
                    return (
                      <div key={c.id} className="px-4 py-3">
                        <div className="flex flex-wrap items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-zinc-900">{c.id}</span>
                              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">{weightOf(c.id)} pt</span>
                              <StatusPill status={entry.status} />
                            </div>
                            <p className="mt-1 text-sm text-zinc-600">{c.title}</p>
                            <div className="mt-1.5 flex items-center gap-3">
                              <button onClick={() => toggleNote(c.id)} className="text-xs font-medium text-zinc-500 hover:text-zinc-700">
                                {entry.note ? "Edit response" : "Add response"}
                              </button>
                              {evs.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-indigo-600"><Link2 size={12} /> {evs.length} evidence</span>
                              )}
                              {isGap && (
                                <button onClick={() => onCreateAction(c)} className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700">
                                  <Plus size={12} /> Create action item
                                </button>
                              )}
                            </div>
                          </div>
                          <select value={entry.status || ""} onChange={(e) => setStatus(c.id, e.target.value || undefined)}
                            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400">
                            <option value="">Not Answered</option>
                            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                          </select>
                        </div>
                        {noteOpen && (
                          <textarea value={entry.note || ""} onChange={(e) => setNote(c.id, e.target.value)}
                            placeholder="How is this requirement met? Reference policies, configurations, or evidence…"
                            className="mt-2 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-sm outline-none focus:border-indigo-400" rows={2} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EVIDENCE                                                            */
/* ------------------------------------------------------------------ */

function Evidence({ evidence, setEvidence }) {
  const [modal, setModal] = useState(false);
  const remove = (id) => setEvidence((p) => p.filter((e) => e.id !== id));

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Evidence</h1>
          <p className="text-sm text-zinc-500">Artifacts that substantiate your controls, categorized by requirement.</p>
        </div>
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={15} /> Add evidence
        </button>
      </header>

      {evidence.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <FolderOpen className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">No evidence yet</p>
          <p className="text-sm text-zinc-500">Add an artifact and map it to the controls it supports.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {evidence.map((e) => (
            <div key={e.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-zinc-900">{e.name}</div>
                  {e.type && <div className="text-xs text-zinc-400">{e.type}</div>}
                </div>
                <button onClick={() => remove(e.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
              </div>
              {e.note && <p className="mt-2 text-sm text-zinc-600">{e.note}</p>}
              <div className="mt-3 flex flex-wrap gap-1">
                {(e.controlIds || []).map((cid) => (
                  <span key={cid} className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] text-indigo-700">{cid}</span>
                ))}
                {(!e.controlIds || e.controlIds.length === 0) && <span className="text-xs text-zinc-400">Not mapped to any control</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <EvidenceModal onClose={() => setModal(false)} onSave={(ev) => { setEvidence((p) => [...p, { ...ev, id: crypto.randomUUID() }]); setModal(false); }} />}
    </div>
  );
}

function EvidenceModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [q, setQ] = useState("");
  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const filtered = CONTROLS.filter((c) => !q || c.id.includes(q) || c.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <ModalShell title="Add evidence" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Access Control Policy v2.1"
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <label className="mt-3 block text-xs font-medium text-zinc-600">Type</label>
      <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Policy, screenshot, config export, log…"
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <label className="mt-3 block text-xs font-medium text-zinc-600">Notes</label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
        className="mt-1 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <label className="mt-3 block text-xs font-medium text-zinc-600">Map to controls ({selected.size} selected)</label>
      <div className="relative mt-1">
        <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter controls…"
          className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
      </div>
      <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-zinc-200">
        {filtered.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="accent-indigo-600" />
            <span className="font-mono text-xs text-zinc-500">{c.id}</span>
            <span className="truncate text-zinc-600">{c.title}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), type: type.trim(), note: note.trim(), controlIds: [...selected] })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Save evidence</button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  POA&M                                                               */
/* ------------------------------------------------------------------ */

const PRIORITIES = ["High", "Medium", "Low"];
const ACT_STATUS = ["Open", "In Progress", "Done"];

function Poam({ actions, setActions, onNew }) {
  const update = (id, patch) => setActions((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id) => setActions((p) => p.filter((a) => a.id !== id));
  const prColor = (p) => (p === "High" ? "rose" : p === "Medium" ? "amber" : "zinc");

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Plan of Action &amp; Milestones</h1>
          <p className="text-sm text-zinc-500">Track remediation for every gap. Level 2 allows a 180-day POA&amp;M closeout window.</p>
        </div>
        <button onClick={onNew} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={15} /> New item
        </button>
      </header>

      {actions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <ClipboardList className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">No action items</p>
          <p className="text-sm text-zinc-500">Gaps you flag in Controls will land here for remediation tracking.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-medium text-zinc-500">
              <tr>
                <th className="px-4 py-2.5">Item</th>
                <th className="px-3 py-2.5">Control</th>
                <th className="px-3 py-2.5">Priority</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {actions.map((a) => (
                <tr key={a.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-800">{a.title}</div>
                    {a.description && <div className="mt-0.5 text-xs text-zinc-500">{a.description}</div>}
                    {a.correctiveAction && <div className="mt-1 text-xs text-zinc-500"><span className="font-medium text-zinc-600">Corrective action: </span>{a.correctiveAction}</div>}
                  </td>
                  <td className="px-3 py-3">{a.controlId ? <span className="font-mono text-xs text-zinc-600">{a.controlId}</span> : <span className="text-xs text-zinc-300">—</span>}</td>
                  <td className="px-3 py-3">
                    <select value={a.priority} onChange={(e) => update(a.id, { priority: e.target.value })}
                      className={`rounded-md border border-${prColor(a.priority)}-200 bg-${prColor(a.priority)}-50 px-2 py-1 text-xs font-medium text-${prColor(a.priority)}-700 outline-none`}>
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select value={a.status} onChange={(e) => update(a.id, { status: e.target.value })}
                      className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs outline-none">
                      {ACT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => remove(a.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActionModal({ initial, onClose, onSave }) {
  const pre = initial.prefill;
  const [title, setTitle] = useState(pre ? `Remediate ${pre.id}` : "");
  const [controlId, setControlId] = useState(initial.controlId || "");
  const [description, setDescription] = useState(pre ? `Requirement ${pre.id} is not fully met: ${pre.title}` : "");
  const [correctiveAction, setCorrectiveAction] = useState(pre ? `Implement and document the controls needed to satisfy ${pre.id}, then attach supporting evidence.` : "");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");

  return (
    <ModalShell title={pre ? `Action item · ${pre.id}` : "New action item"} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <label className="mt-3 block text-xs font-medium text-zinc-600">Linked control</label>
      <select value={controlId} onChange={(e) => setControlId(e.target.value)}
        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
        <option value="">None</option>
        {CONTROLS.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 60)}</option>)}
      </select>

      <label className="mt-3 block text-xs font-medium text-zinc-600">Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
        className="mt-1 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <label className="mt-3 block text-xs font-medium text-zinc-600">Corrective action</label>
      <textarea value={correctiveAction} onChange={(e) => setCorrectiveAction(e.target.value)} rows={2}
        className="mt-1 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none">
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none">
            {ACT_STATUS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), controlId, description: description.trim(), correctiveAction: correctiveAction.trim(), priority, status })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Save item</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  RISKS — Assets · Vendors · Risk Register                           */
/* ================================================================== */

const RISK_LEVELS = {
  low: { label: "Low", hex: "#10b981" },
  medium: { label: "Medium", hex: "#f59e0b" },
  high: { label: "High", hex: "#f97316" },
  critical: { label: "Critical", hex: "#f43f5e" },
};
const RISK_ORDER = ["low", "medium", "high", "critical"];
const SEV_RANK = { low: 1, medium: 2, high: 3, critical: 4 };
const scoreToLevel = (s) => (s <= 4 ? "low" : s <= 9 ? "medium" : s <= 14 ? "high" : "critical");

const VENDOR_AREAS = ["Security", "Privacy", "Compliance", "Financial", "Operational", "Business Continuity"];
const VENDOR_TIERS = ["Tier 1", "Tier 2", "Tier 3"];
const VENDOR_STATUS_META = {
  "Not Assessed": { label: "Not Assessed", hex: "#e4e4e7" },
  "In Review": { label: "In Review", hex: "#0ea5e9" },
  "Assessed": { label: "Assessed", hex: "#6366f1" },
  "Approved": { label: "Approved", hex: "#10b981" },
  "Flagged": { label: "Flagged", hex: "#f43f5e" },
};
const VENDOR_STATUS = Object.keys(VENDOR_STATUS_META);

const RISK_STATUS_META = {
  "Open": { label: "Open", hex: "#f43f5e" },
  "Mitigating": { label: "Mitigating", hex: "#f59e0b" },
  "Monitoring": { label: "Monitoring", hex: "#0ea5e9" },
  "Accepted": { label: "Accepted", hex: "#94a3b8" },
  "Closed": { label: "Closed", hex: "#10b981" },
};
const RISK_STATUS = Object.keys(RISK_STATUS_META);
const TREATMENT_META = {
  "Mitigate": { label: "Mitigate", hex: "#6366f1" },
  "Accept": { label: "Accept", hex: "#94a3b8" },
  "Transfer": { label: "Transfer", hex: "#0ea5e9" },
  "Avoid": { label: "Avoid", hex: "#f59e0b" },
};
const TREATMENTS = Object.keys(TREATMENT_META);
const RISK_CATEGORIES = ["Security", "Compliance", "Operational", "Financial", "Strategic", "Third-party"];
const ASSET_CRIT = ["Low", "Medium", "High", "Critical"];
const ASSET_CLASS = ["FCI", "CUI", "Internal", "Public"];

const countBy = (arr, fn) => { const m = {}; for (const x of arr) { const k = fn(x); m[k] = (m[k] || 0) + 1; } return m; };
const vendorLevel = (v) => { let w = "low"; for (const a of VENDOR_AREAS) { const l = v.areas?.[a] || "low"; if (SEV_RANK[l] > SEV_RANK[w]) w = l; } return w; };
const distroSegs = (counts, order, meta) => order.map((k) => ({ key: k, value: counts[k] || 0, hex: meta[k].hex, label: meta[k].label }));

/* ---- primitives ---- */
function Card({ title, action, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-700">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
function KeyLegend({ order, meta, counts, cols = 2 }) {
  return (
    <div className={`grid gap-x-4 gap-y-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {order.map((k) => (
        <div key={k} className="flex items-center gap-2 text-xs">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta[k].hex }} />
          <span className="text-zinc-600">{meta[k].label}</span>
          <span className="ml-auto font-mono tabular-nums font-medium text-zinc-800">{counts[k] || 0}</span>
        </div>
      ))}
    </div>
  );
}
function HBars({ items }) {
  const max = Math.max(1, ...items.map((i) => i.max ?? i.value));
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="w-36 truncate text-xs text-zinc-600" title={it.label}>{it.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: it.hex }} />
          </div>
          <span className="w-12 text-right font-mono text-[11px] tabular-nums text-zinc-500">{it.display ?? it.value}</span>
        </div>
      ))}
    </div>
  );
}
function StackedBar({ segments, total }) {
  const t = total || segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
      {segments.map((s) => s.value > 0 && <div key={s.key} style={{ width: `${(s.value / t) * 100}%`, background: s.hex }} title={`${s.label}: ${s.value}`} />)}
    </div>
  );
}
function RankList({ items, empty = "No data yet." }) {
  if (!items.length) return <div className="py-6 text-center text-sm text-zinc-400">{empty}</div>;
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="w-4 text-right font-mono text-xs text-zinc-400">{i + 1}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-zinc-700" title={it.name}>{it.name}</span>
          {it.tag && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: it.hex }}>{it.tag}</span>}
          {it.value != null && <span className="w-8 text-right font-mono text-xs tabular-nums text-zinc-500">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}
function HeatMap({ risks }) {
  // impact x (1..5), likelihood y (5..1)
  const cell = (imp, lik) => risks.filter((r) => r.impact === imp && r.likelihood === lik).length;
  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between py-1 text-[10px] text-zinc-400">
        <span>Likelihood ▲</span>
      </div>
      <div>
        <div className="grid grid-cols-5 gap-1">
          {[5, 4, 3, 2, 1].map((lik) =>
            [1, 2, 3, 4, 5].map((imp) => {
              const n = cell(imp, lik);
              const lvl = scoreToLevel(imp * lik);
              return (
                <div key={`${imp}-${lik}`} className="flex h-11 w-11 items-center justify-center rounded text-sm font-semibold"
                  style={{ background: RISK_LEVELS[lvl].hex, opacity: n ? 1 : 0.28, color: "#fff" }} title={`Impact ${imp} × Likelihood ${lik}`}>
                  {n || ""}
                </div>
              );
            })
          )}
        </div>
        <div className="mt-1 text-center text-[10px] text-zinc-400">Impact ▶</div>
      </div>
    </div>
  );
}
function TrendLine({ snapshots }) {
  if (snapshots.length < 2) return <div className="py-8 text-center text-sm text-zinc-400">Take at least two snapshots to see a trend.</div>;
  const pts = snapshots.map((s) => s.avgScore);
  const w = 460, h = 130, pad = 24;
  const max = Math.max(5, ...pts), min = 0;
  const x = (i) => pad + (i / (pts.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const d = pts.map((v, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e4e4e7" />
      <path d={d} fill="none" stroke="#6366f1" strokeWidth="2" />
      {pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#6366f1" />)}
      {snapshots.map((s, i) => (i === 0 || i === snapshots.length - 1) && (
        <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="9" fill="#a1a1aa">{new Date(s.date).toLocaleDateString()}</text>
      ))}
    </svg>
  );
}

/* ---- Risks parent ---- */
function Risks({ sub, ...props }) {
  const TITLES = { assets: "Assets", vendors: "Vendors", register: "Risk Register" };
  const SUBS = { assets: "Your asset inventory and data classifications.", vendors: "Third-party vendor risk posture across your supply chain.", register: "Your enterprise risk register, ratings, and treatment plans." };
  return (
    <div className="space-y-5">
      <header>
        <div className="text-xs font-medium uppercase tracking-wide text-indigo-500">Risks</div>
        <h1 className="text-xl font-semibold">{TITLES[sub]}</h1>
        <p className="text-sm text-zinc-500">{SUBS[sub]}</p>
      </header>
      {sub === "assets" && <AssetsPage assets={props.assets} setAssets={props.setAssets} />}
      {sub === "vendors" && <VendorsPage vendors={props.vendors} setVendors={props.setVendors} />}
      {sub === "register" && <RiskRegisterPage risks={props.risks} setRisks={props.setRisks} snapshots={props.snapshots} setSnapshots={props.setSnapshots} />}
    </div>
  );
}

/* ---- Assets ---- */
function parseCSV(text) {
  const rows = text.replace(/\r/g, "").split("\n").filter((l) => l.trim().length);
  if (!rows.length) return [];
  const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((line) => {
    const cells = line.split(",");
    const o = {};
    headers.forEach((h, i) => (o[h] = (cells[i] || "").trim()));
    return o;
  });
}
function AssetsPage({ assets, setAssets }) {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);
  const remove = (id) => setAssets((p) => p.filter((a) => a.id !== id));
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const rows = parseCSV(String(r.result));
        const added = rows.filter((o) => o.name).map((o) => ({
          id: crypto.randomUUID(), name: o.name, type: o.type || "", owner: o.owner || "",
          classification: o.classification || "Internal", criticality: o.criticality || "Medium", environment: o.environment || "",
        }));
        setAssets((p) => [...p, ...added]);
        setMsg(`Imported ${added.length} asset${added.length === 1 ? "" : "s"}.`);
      } catch { setMsg("Could not parse that CSV."); }
      e.target.value = "";
    };
    r.readAsText(f);
  };
  const critHex = (c) => ({ Low: "#10b981", Medium: "#f59e0b", High: "#f97316", Critical: "#f43f5e" }[c] || "#94a3b8");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-4 text-sm">
          <span className="text-zinc-500">Total assets <span className="font-mono font-semibold text-zinc-800">{assets.length}</span></span>
          <span className="text-zinc-500">CUI assets <span className="font-mono font-semibold text-zinc-800">{assets.filter((a) => a.classification === "CUI").length}</span></span>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv" onChange={onFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Upload size={15} /> Import from CSV
          </button>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={15} /> Create asset
          </button>
        </div>
      </div>
      {msg && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</div>}

      {assets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <Boxes className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">No assets yet</p>
          <p className="text-sm text-zinc-500">Create one, or import a CSV with columns: name, type, owner, classification, criticality, environment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-medium text-zinc-500">
              <tr><th className="px-4 py-2.5">Asset</th><th className="px-3 py-2.5">Type</th><th className="px-3 py-2.5">Owner</th><th className="px-3 py-2.5">Class</th><th className="px-3 py-2.5">Criticality</th><th className="px-3 py-2.5">Environment</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {assets.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2.5 font-medium text-zinc-800">{a.name}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{a.type || "—"}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{a.owner || "—"}</td>
                  <td className="px-3 py-2.5">{a.classification === "CUI" ? <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700">CUI</span> : <span className="text-zinc-600">{a.classification}</span>}</td>
                  <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1.5 text-zinc-700"><span className="h-2 w-2 rounded-full" style={{ background: critHex(a.criticality) }} />{a.criticality}</span></td>
                  <td className="px-3 py-2.5 text-zinc-600">{a.environment || "—"}</td>
                  <td className="px-3 py-2.5 text-right"><button onClick={() => remove(a.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <CreateAssetModal onClose={() => setModal(false)} onSave={(a) => { setAssets((p) => [...p, { ...a, id: crypto.randomUUID() }]); setModal(false); }} />}
    </div>
  );
}
function CreateAssetModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", type: "", owner: "", classification: "Internal", criticality: "Medium", environment: "" });
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  return (
    <ModalShell title="Create asset" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="block text-xs font-medium text-zinc-600">Name</label>
          <input value={f.name} onChange={(e) => up("name", e.target.value)} placeholder="e.g. CUI file server" className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-zinc-600">Type</label>
            <input value={f.type} onChange={(e) => up("type", e.target.value)} placeholder="Server, laptop, SaaS…" className={inputCls} /></div>
          <div><label className="block text-xs font-medium text-zinc-600">Owner</label>
            <input value={f.owner} onChange={(e) => up("owner", e.target.value)} placeholder="Team or person" className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs font-medium text-zinc-600">Classification</label>
            <select value={f.classification} onChange={(e) => up("classification", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{ASSET_CLASS.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-zinc-600">Criticality</label>
            <select value={f.criticality} onChange={(e) => up("criticality", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{ASSET_CRIT.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-zinc-600">Environment</label>
            <input value={f.environment} onChange={(e) => up("environment", e.target.value)} placeholder="Prod, cloud…" className={inputCls} /></div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim()} onClick={() => onSave(f)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Create</button>
      </div>
    </ModalShell>
  );
}

/* ---- Vendors ---- */
function VendorsPage({ vendors, setVendors }) {
  const [modal, setModal] = useState(false);
  const remove = (id) => setVendors((p) => p.filter((v) => v.id !== id));

  const byLevel = countBy(vendors, vendorLevel);
  const byStatus = countBy(vendors, (v) => v.status);
  const assessed = vendors.filter((v) => v.status !== "Not Assessed").length;
  const highCrit = (byLevel.high || 0) + (byLevel.critical || 0);
  const overallLabel = byLevel.critical ? "Critical" : (byLevel.high ? "Elevated" : (byLevel.medium ? "Moderate" : "Low"));
  const overallHex = byLevel.critical ? RISK_LEVELS.critical.hex : byLevel.high ? RISK_LEVELS.high.hex : byLevel.medium ? RISK_LEVELS.medium.hex : RISK_LEVELS.low.hex;

  const areaBars = VENDOR_AREAS.map((area) => {
    const scored = vendors.map((v) => SEV_RANK[v.areas?.[area] || "low"]);
    const avg = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0;
    const lvl = RISK_ORDER[Math.max(0, Math.round(avg) - 1)] || "low";
    return { label: area, value: avg, max: 4, hex: RISK_LEVELS[lvl].hex, display: vendors.length ? RISK_LEVELS[lvl].label : "—" };
  });

  const topVendors = [...vendors].sort((a, b) => SEV_RANK[vendorLevel(b)] - SEV_RANK[vendorLevel(a)]).slice(0, 5)
    .map((v) => ({ name: v.name, tag: RISK_LEVELS[vendorLevel(v)].label, hex: RISK_LEVELS[vendorLevel(v)].hex }));

  const companyRisks = vendors.flatMap((v) => {
    const worst = vendorLevel(v);
    if (SEV_RANK[worst] < 3) return [];
    const area = VENDOR_AREAS.find((a) => (v.areas?.[a] || "low") === worst) || "Security";
    return [{ name: `${v.name} — ${area} exposure`, tag: RISK_LEVELS[worst].label, hex: RISK_LEVELS[worst].hex, rank: SEV_RANK[worst] }];
  }).sort((a, b) => b.rank - a.rank).slice(0, 5);

  const assessedPct = vendors.length ? Math.round((assessed / vendors.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {vendors.length === 0
          ? <p className="text-sm text-zinc-500">Add a vendor and score it across the assessment areas to populate the dashboard.</p>
          : <span />}
        <AddVendorBtn onClick={() => setModal(true)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Overall vendor risk">
          <div className="flex items-center gap-4">
            <Donut segments={distroSegs(byLevel, RISK_ORDER, RISK_LEVELS)} centerTop={vendors.length} centerBottom="vendors" />
            <div>
              <div className="text-lg font-semibold" style={{ color: overallHex }}>{overallLabel}</div>
              <div className="text-xs text-zinc-500">{highCrit} high/critical of {vendors.length}</div>
            </div>
          </div>
        </Card>
        <Card title="Vendor status">
          <div className="flex items-center gap-4">
            <Donut segments={distroSegs(byStatus, VENDOR_STATUS, VENDOR_STATUS_META)} centerTop={vendors.length} centerBottom="total" />
            <div className="flex-1"><KeyLegend order={VENDOR_STATUS} meta={VENDOR_STATUS_META} counts={byStatus} cols={1} /></div>
          </div>
        </Card>
        <Card title="Risk assessments overview">
          <div className="flex items-center gap-4">
            <Donut segments={[{ key: "done", value: assessed, hex: "#6366f1" }, { key: "todo", value: vendors.length - assessed, hex: "#e4e4e7" }]}
              centerTop={`${assessedPct}%`} centerBottom="assessed" />
            <div className="text-sm text-zinc-600">
              <div><span className="font-mono font-semibold text-zinc-800">{assessed}</span> assessed</div>
              <div><span className="font-mono font-semibold text-zinc-800">{vendors.length - assessed}</span> pending</div>
              <div className="text-zinc-400">{byStatus["Flagged"] || 0} flagged</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Vendor risks by tier">
          <div className="space-y-3">
            {VENDOR_TIERS.map((tier) => {
              const list = vendors.filter((v) => v.tier === tier);
              const counts = countBy(list, vendorLevel);
              return (
                <div key={tier}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700">{tier}</span>
                    <span className="font-mono text-zinc-400">{list.length}</span>
                  </div>
                  <StackedBar segments={distroSegs(counts, RISK_ORDER, RISK_LEVELS)} total={list.length} />
                </div>
              );
            })}
            <div className="pt-1"><KeyLegend order={RISK_ORDER} meta={RISK_LEVELS} counts={countBy(vendors, vendorLevel)} cols={4} /></div>
          </div>
        </Card>
        <Card title="Risk by assessment area"><HBars items={areaBars} /></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Top riskiest vendors"><RankList items={topVendors} empty="No vendors scored yet." /></Card>
        <Card title="Top company risks due to vendors"><RankList items={companyRisks} empty="No high or critical vendor exposures." /></Card>
      </div>

      {/* vendor list */}
      {vendors.length > 0 && (
        <Card title="All vendors">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-medium text-zinc-500"><tr><th className="py-2">Vendor</th><th className="py-2">Tier</th><th className="py-2">Status</th><th className="py-2">Overall risk</th><th></th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td className="py-2 font-medium text-zinc-800">{v.name}</td>
                  <td className="py-2 text-zinc-600">{v.tier}</td>
                  <td className="py-2"><span className="inline-flex items-center gap-1.5 text-zinc-600"><span className="h-2 w-2 rounded-full" style={{ background: VENDOR_STATUS_META[v.status]?.hex }} />{v.status}</span></td>
                  <td className="py-2"><span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: RISK_LEVELS[vendorLevel(v)].hex }}>{RISK_LEVELS[vendorLevel(v)].label}</span></td>
                  <td className="py-2 text-right"><button onClick={() => remove(v.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modal && <AddVendorModal onClose={() => setModal(false)} onSave={(v) => { setVendors((p) => [...p, { ...v, id: crypto.randomUUID() }]); setModal(false); }} />}
    </div>
  );
}
function AddVendorBtn({ onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Add vendor</button>;
}
function AddVendorModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("Tier 2");
  const [status, setStatus] = useState("Not Assessed");
  const [areas, setAreas] = useState(() => Object.fromEntries(VENDOR_AREAS.map((a) => [a, "low"])));
  return (
    <ModalShell title="Add vendor" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Vendor name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Cloud Hosting" className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{VENDOR_TIERS.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{VENDOR_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
      </div>
      <label className="mt-3 block text-xs font-medium text-zinc-600">Risk by assessment area</label>
      <div className="mt-1 space-y-1.5">
        {VENDOR_AREAS.map((a) => (
          <div key={a} className="flex items-center gap-2">
            <span className="w-40 text-sm text-zinc-600">{a}</span>
            <select value={areas[a]} onChange={(e) => setAreas((p) => ({ ...p, [a]: e.target.value }))} className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm outline-none">
              {RISK_ORDER.map((l) => <option key={l} value={l}>{RISK_LEVELS[l].label}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), tier, status, areas })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Add vendor</button>
      </div>
    </ModalShell>
  );
}

/* ---- Risk Register ---- */
function RiskRegisterPage({ risks, setRisks, snapshots, setSnapshots }) {
  const [modal, setModal] = useState(false);
  const remove = (id) => setRisks((p) => p.filter((r) => r.id !== id));
  const withScore = risks.map((r) => ({ ...r, score: r.likelihood * r.impact, level: scoreToLevel(r.likelihood * r.impact) }));
  const open = withScore.filter((r) => r.status !== "Closed");
  const avgScore = open.length ? open.reduce((a, r) => a + r.score, 0) / open.length : 0;
  const overallLevel = scoreToLevel(Math.round(avgScore));
  const byLevel = countBy(withScore, (r) => r.level);
  const byStatus = countBy(withScore, (r) => r.status);
  const byTreatment = countBy(withScore, (r) => r.treatment);
  const topRisks = [...withScore].sort((a, b) => b.score - a.score).slice(0, 5)
    .map((r) => ({ name: r.title, tag: RISK_LEVELS[r.level].label, hex: RISK_LEVELS[r.level].hex, value: r.score }));

  const takeSnapshot = () => {
    const snap = { id: crypto.randomUUID(), date: new Date().toISOString(), avgScore: Number(avgScore.toFixed(1)), totalRisks: risks.length, openCount: open.length, counts: { ...byLevel } };
    setSnapshots((p) => [...p, snap]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {risks.length === 0
          ? <p className="text-sm text-zinc-500">Add a risk with a likelihood and impact to build the heat map and ratings.</p>
          : <span />}
        <div className="flex gap-2">
          <button onClick={takeSnapshot} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Camera size={15} /> Take snapshot</button>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Add risk</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Overall risk">
          <div className="flex items-center gap-4">
            <ProgressRing pct={Math.round((avgScore / 25) * 100)} hex={RISK_LEVELS[overallLevel].hex} top={avgScore.toFixed(1)} bottom="avg score" size={120} />
            <div>
              <div className="text-lg font-semibold" style={{ color: RISK_LEVELS[overallLevel].hex }}>{RISK_LEVELS[overallLevel].label}</div>
              <div className="text-xs text-zinc-500">{open.length} open of {risks.length}</div>
            </div>
          </div>
        </Card>
        <Card title="Risk status">
          <div className="flex items-center gap-4">
            <Donut segments={distroSegs(byStatus, RISK_STATUS, RISK_STATUS_META)} centerTop={risks.length} centerBottom="risks" />
            <div className="flex-1"><KeyLegend order={RISK_STATUS} meta={RISK_STATUS_META} counts={byStatus} cols={1} /></div>
          </div>
        </Card>
        <Card title="Risk rating breakdown">
          <div className="flex items-center gap-4">
            <Donut segments={distroSegs(byLevel, RISK_ORDER, RISK_LEVELS)} centerTop={risks.length} centerBottom="risks" />
            <div className="flex-1"><KeyLegend order={RISK_ORDER} meta={RISK_LEVELS} counts={byLevel} cols={1} /></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Risk heat map"><HeatMap risks={withScore} /></Card>
        <Card title="Action plan breakdown">
          <div className="flex items-center gap-4">
            <Donut segments={distroSegs(byTreatment, TREATMENTS, TREATMENT_META)} centerTop={risks.length} centerBottom="risks" />
            <div className="flex-1"><KeyLegend order={TREATMENTS} meta={TREATMENT_META} counts={byTreatment} cols={1} /></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Top company risks"><RankList items={topRisks} /></Card>
        <Card title="Risk trend"><TrendLine snapshots={snapshots} /></Card>
      </div>

      <Card title="Snapshot history">
        {snapshots.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">No snapshots yet. Take one to start tracking your trend.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-medium text-zinc-500"><tr><th className="py-2">Date</th><th className="py-2">Total risks</th><th className="py-2">Open</th><th className="py-2">Avg score</th><th className="py-2">Critical</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {[...snapshots].reverse().map((s) => (
                <tr key={s.id}>
                  <td className="py-2 text-zinc-700">{new Date(s.date).toLocaleString()}</td>
                  <td className="py-2 font-mono text-zinc-600">{s.totalRisks}</td>
                  <td className="py-2 font-mono text-zinc-600">{s.openCount}</td>
                  <td className="py-2 font-mono text-zinc-600">{s.avgScore}</td>
                  <td className="py-2 font-mono text-zinc-600">{s.counts?.critical || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="All risks">
        <table className="w-full text-sm">
          <thead className="text-left text-xs font-medium text-zinc-500"><tr><th className="py-2">Risk</th><th className="py-2">Category</th><th className="py-2">L×I</th><th className="py-2">Rating</th><th className="py-2">Status</th><th className="py-2">Plan</th><th></th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {withScore.map((r) => (
              <tr key={r.id}>
                <td className="py-2 font-medium text-zinc-800">{r.title}</td>
                <td className="py-2 text-zinc-600">{r.category}</td>
                <td className="py-2 font-mono text-zinc-600">{r.likelihood}×{r.impact}={r.score}</td>
                <td className="py-2"><span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: RISK_LEVELS[r.level].hex }}>{RISK_LEVELS[r.level].label}</span></td>
                <td className="py-2 text-zinc-600">{r.status}</td>
                <td className="py-2 text-zinc-600">{r.treatment}</td>
                <td className="py-2 text-right"><button onClick={() => remove(r.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && <AddRiskModal onClose={() => setModal(false)} onSave={(r) => { setRisks((p) => [...p, { ...r, id: crypto.randomUUID() }]); setModal(false); }} />}
    </div>
  );
}
function AddRiskModal({ onClose, onSave }) {
  const [f, setF] = useState({ title: "", description: "", category: "Security", likelihood: 3, impact: 3, status: "Open", treatment: "Mitigate", owner: "" });
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const score = f.likelihood * f.impact;
  const lvl = scoreToLevel(score);
  return (
    <ModalShell title="Add risk" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Title</label>
      <input value={f.title} onChange={(e) => up("title", e.target.value)} placeholder="e.g. Unpatched externally-facing VPN" className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <label className="mt-3 block text-xs font-medium text-zinc-600">Description</label>
      <textarea value={f.description} onChange={(e) => up("description", e.target.value)} rows={2} className="mt-1 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Category</label>
          <select value={f.category} onChange={(e) => up("category", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{RISK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Owner</label>
          <input value={f.owner} onChange={(e) => up("owner", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" /></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Likelihood (1–5)</label>
          <select value={f.likelihood} onChange={(e) => up("likelihood", +e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Impact (1–5)</label>
          <select value={f.impact} onChange={(e) => up("impact", +e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="text-zinc-500">Inherent score</span>
        <span className="rounded-full px-2 py-0.5 font-medium text-white" style={{ background: RISK_LEVELS[lvl].hex }}>{score} · {RISK_LEVELS[lvl].label}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={f.status} onChange={(e) => up("status", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{RISK_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Action plan</label>
          <select value={f.treatment} onChange={(e) => up("treatment", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{TREATMENTS.map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.title.trim()} onClick={() => onSave(f)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Add risk</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  DOCUMENTS — Policies · Procedures · Governance                     */
/* ================================================================== */

const DOC_STATUS_META = {
  "Not Started": { label: "Not Started", hex: "#e4e4e7" },
  "Draft": { label: "Draft", hex: "#0ea5e9" },
  "In Review": { label: "In Review", hex: "#f59e0b" },
  "Approved": { label: "Approved", hex: "#6366f1" },
  "Published": { label: "Published", hex: "#10b981" },
};
const DOC_STATUS = Object.keys(DOC_STATUS_META);
const DOC_CLASS = ["Public", "Internal", "Confidential", "Restricted"];

const famIds = (k) => CONTROLS.filter((c) => c.family === k).map((c) => c.id);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const mkDoc = (type, name, objectives, tags = []) => ({
  id: `${type}-${slug(name)}`, type, name, owner: "", contributor: "", status: "Not Started",
  objectives, reviewDate: "", tags, classification: "Internal", comments: "", updates: "",
  explanation: (typeof EXPLAIN !== "undefined" && EXPLAIN[name]) || "",
});

const POLICY_FAMILIES = [
  ["Access Control Policy", "AC"], ["Awareness & Training Policy", "AT"], ["Audit & Accountability Policy", "AU"],
  ["Configuration Management Policy", "CM"], ["Identification & Authentication Policy", "IA"], ["Incident Response Policy", "IR"],
  ["Maintenance Policy", "MA"], ["Media Protection Policy", "MP"], ["Personnel Security Policy", "PS"],
  ["Physical Protection Policy", "PE"], ["Risk Assessment Policy", "RA"], ["Security Assessment Policy", "CA"],
  ["System & Communications Protection Policy", "SC"], ["System & Information Integrity Policy", "SI"],
];
const POLICY_EXTRA = [
  ["Acceptable Use Policy", ["3.1.1", "3.1.2", "3.1.20", "3.1.21", "3.1.22"], ["access"]],
  ["Antivirus & Malware Protection Policy", ["3.14.2", "3.14.4", "3.14.5"], ["malware"]],
  ["Data Classification & Handling Policy", ["3.1.3", "3.8.1", "3.8.2", "3.8.3", "3.8.4"], ["data"]],
  ["Password Policy", ["3.5.7", "3.5.8", "3.5.9", "3.5.10"], ["identity"]],
];
const PROCEDURE_DEFS = [
  ["Incident Response Procedure", ["3.6.1", "3.6.2", "3.6.3"]],
  ["Access Provisioning & Deprovisioning Procedure", ["3.1.1", "3.5.5", "3.5.6", "3.9.2"]],
  ["User Access Review Procedure", ["3.1.5", "3.1.6"]],
  ["Media Sanitization Procedure", ["3.8.3"]],
  ["Backup & Recovery Procedure", ["3.8.9"]],
  ["Vulnerability Scanning & Remediation Procedure", ["3.11.2", "3.11.3"]],
  ["Patch Management Procedure", ["3.14.1"]],
  ["Change Management Procedure", ["3.4.3", "3.4.4", "3.4.5"]],
  ["Audit Log Review Procedure", ["3.3.1", "3.3.5", "3.3.6"]],
  ["Configuration Baseline Procedure", ["3.4.1", "3.4.2"]],
];
const GOVERNANCE_DEFS = [
  ["System Security Plan (SSP)", ["3.12.4"]],
  ["Plan of Action & Milestones (POA&M)", ["3.12.2"]],
  ["Risk Assessment", ["3.11.1"]],
  ["Risk Treatment Plan", ["3.11.1", "3.11.3"]],
  ["Incident Response Plan", ["3.6.1"]],
  ["Continuous Monitoring Plan", ["3.12.3"]],
  ["Configuration Management Plan", ["3.4.1"]],
  ["Business Continuity & Disaster Recovery Plan", ["3.8.9"]],
];
const PROCEDURE_TEMPLATES = [
  "Incident Response Procedure", "Data Backup & Restoration Procedure", "Media Sanitization Procedure",
  "Account Management Procedure", "Vulnerability Management Procedure", "Patch Management Procedure",
  "Change Management Procedure", "Audit Log Review Procedure", "Secure Configuration Procedure",
  "Removable Media Handling Procedure", "Visitor Access Procedure", "Security Awareness Training Procedure",
];
const FAMILY_POLICY_DETAIL = {
  AC: "controlling who and what can access systems and CUI, enforcing least privilege, and governing remote and wireless access.",
  AT: "making sure managers, admins, and users understand security risks and their security responsibilities.",
  AU: "generating, protecting, and reviewing audit logs so individual actions can be traced and investigated.",
  CM: "establishing secure baseline configurations and controlling changes to systems.",
  IA: "uniquely identifying users and devices and enforcing strong authentication, including multifactor.",
  IR: "preparing for, detecting, analyzing, and responding to security incidents.",
  MA: "performing system maintenance securely, including controls on tools, personnel, and nonlocal maintenance.",
  MP: "protecting, marking, transporting, and sanitizing media that stores CUI.",
  PS: "screening personnel and protecting systems during hiring, transfers, and terminations.",
  PE: "limiting and monitoring physical access to facilities, equipment, and work sites.",
  RA: "identifying, scanning for, and remediating risks and vulnerabilities.",
  CA: "assessing control effectiveness and maintaining the SSP and plans of action.",
  SC: "protecting information in transit and at rest and segmenting networks and boundaries.",
  SI: "identifying and correcting flaws and defending against malicious code.",
};
const EXPLAIN = {};
POLICY_FAMILIES.forEach(([name, fam]) => {
  EXPLAIN[name] = `The ${name} establishes how the organization meets the ${FAMILY_BY_KEY[fam].name} requirements (${FAMILY_BY_KEY[fam].code}) of NIST SP 800-171 — ${FAMILY_POLICY_DETAIL[fam]}`;
});
Object.assign(EXPLAIN, {
  "Acceptable Use Policy": "Defines acceptable use of company systems, accounts, and CUI, including prohibited activities and the use of external and portable systems.",
  "Antivirus & Malware Protection Policy": "Requires anti-malware protection to be deployed, kept up to date, and monitored across all in-scope systems.",
  "Data Classification & Handling Policy": "Defines how data — including CUI — is classified, labeled, stored, shared, and disposed of.",
  "Password Policy": "Sets password complexity, reuse, rotation, temporary-password, and protection requirements.",
  "Incident Response Procedure": "Step-by-step process for detecting, reporting, containing, eradicating, and recovering from security incidents.",
  "Access Provisioning & Deprovisioning Procedure": "How accounts and access are created, modified, and removed as people join, move within, or leave the organization.",
  "User Access Review Procedure": "How access rights are periodically reviewed and reduced to least privilege.",
  "Media Sanitization Procedure": "How media containing CUI is wiped or destroyed before disposal or reuse.",
  "Backup & Recovery Procedure": "How backups are taken, protected, tested, and restored.",
  "Vulnerability Scanning & Remediation Procedure": "How vulnerabilities are scanned for on a schedule and remediated by risk.",
  "Patch Management Procedure": "How patches are identified, tested, and deployed in a timely manner.",
  "Change Management Procedure": "How changes are requested, reviewed for security impact, approved, and logged.",
  "Audit Log Review Procedure": "How audit logs are collected, correlated, and reviewed for suspicious activity.",
  "Configuration Baseline Procedure": "How secure configuration baselines are defined, applied, and maintained.",
  "System Security Plan (SSP)": "Documents the system boundary, environment of operation, and how each requirement is implemented — the foundational CMMC artifact.",
  "Plan of Action & Milestones (POA&M)": "Tracks requirements not yet fully met, with remediation owners, actions, and target dates.",
  "Risk Assessment": "Documents identified risks to operations, assets, and individuals, with likelihood and impact.",
  "Risk Treatment Plan": "Documents how each risk will be mitigated, accepted, transferred, or avoided.",
  "Incident Response Plan": "The overarching plan governing how the organization prepares for and handles incidents.",
  "Continuous Monitoring Plan": "Describes how controls are monitored on an ongoing basis to stay effective.",
  "Configuration Management Plan": "Governs how baselines and changes are managed across the organization.",
  "Business Continuity & Disaster Recovery Plan": "Describes how operations and data are recovered after a disruption.",
});

const DEFAULT_DOCUMENTS = [
  ...POLICY_FAMILIES.map(([name, fam]) => mkDoc("policy", name, famIds(fam), [FAMILY_BY_KEY[fam].name])),
  ...POLICY_EXTRA.map(([name, ids, tags]) => mkDoc("policy", name, ids, tags)),
  ...PROCEDURE_DEFS.map(([name, ids]) => mkDoc("procedure", name, ids, ["procedure"])),
  ...GOVERNANCE_DEFS.map(([name, ids]) => mkDoc("governance", name, ids, ["required"])),
];

const DOC_META = {
  policies: { type: "policy", title: "Policies", sub: "Your policy library, mapped to the requirements each one satisfies." },
  procedures: { type: "procedure", title: "Procedures", sub: "Operational procedures that put your policies into practice." },
  governance: { type: "governance", title: "Governance", sub: "The governance artifacts CMMC Level 2 requires you to maintain." },
};

function ObjectivePicker({ selected, onToggle }) {
  const [q, setQ] = useState("");
  const list = CONTROLS.filter((c) => !q || c.id.includes(q) || c.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter objectives…"
          className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
      </div>
      <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-zinc-200">
        {list.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => onToggle(c.id)} className="accent-indigo-600" />
            <span className="font-mono text-xs text-zinc-500">{c.id}</span>
            <span className="truncate text-zinc-600">{c.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Documents({ sub, documents, setDocuments }) {
  const meta = DOC_META[sub];
  const [modal, setModal] = useState(null); // { mode, doc }
  const [tpl, setTpl] = useState(false);
  const [explain, setExplain] = useState(null);
  const docs = documents.filter((d) => d.type === meta.type);

  const addDoc = (d) => setDocuments((p) => [...p, { ...d, id: crypto.randomUUID(), type: meta.type }]);
  const updateDoc = (id, patch) => setDocuments((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const removeDoc = (id) => setDocuments((p) => p.filter((d) => d.id !== id));

  const noun = meta.type === "policy" ? "policy" : meta.type === "procedure" ? "procedure" : "document";

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-indigo-500">Documents</div>
          <h1 className="text-xl font-semibold">{meta.title}</h1>
          <p className="text-sm text-zinc-500">{meta.sub}</p>
        </div>
        <div className="flex gap-2">
          {meta.type === "procedure" && (
            <button onClick={() => setTpl(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              <Upload size={15} /> Upload from template
            </button>
          )}
          <button onClick={() => setModal({ mode: "create", doc: null })} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={15} /> Add {noun}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {DOC_STATUS.map((s) => (
          <div key={s} className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="h-2 w-2 rounded-full" style={{ background: DOC_STATUS_META[s].hex }} />{s}</div>
            <div className="font-mono text-lg font-semibold text-zinc-800">{docs.filter((d) => d.status === s).length}</div>
          </div>
        ))}
      </div>

      <DocumentTable docs={docs} onEdit={(d) => setModal({ mode: "edit", doc: d })} onRemove={removeDoc} onStatus={(id, v) => updateDoc(id, { status: v })} onExplain={(d) => setExplain(d)} />

      {modal && (
        <DocumentModal noun={noun} initial={modal.doc}
          onClose={() => setModal(null)}
          onSave={(d) => { modal.mode === "edit" ? updateDoc(modal.doc.id, d) : addDoc(d); setModal(null); }} />
      )}
      {tpl && (
        <ModalShell title="Upload procedure from template" onClose={() => setTpl(false)}>
          <p className="mb-3 text-xs text-zinc-500">Start a procedure from a standard template. It's added as a Draft you can fill in.</p>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {PROCEDURE_TEMPLATES.map((name) => {
              const exists = docs.some((d) => d.name === name);
              return (
                <div key={name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
                  <span className="flex-1 text-sm font-medium text-zinc-800">{name}</span>
                  <button disabled={exists}
                    onClick={() => addDoc({ ...mkDoc("procedure", name, [], ["procedure"]), status: "Draft" })}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${exists ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                    {exists ? "Added ✓" : "Use template"}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end"><button onClick={() => setTpl(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Done</button></div>
        </ModalShell>
      )}
      {explain && (
        <ModalShell title={explain.name} onClose={() => setExplain(null)}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium capitalize text-zinc-600">{explain.type}</span>
            <span className="rounded-full px-2 py-0.5 font-medium text-white" style={{ background: DOC_STATUS_META[explain.status]?.hex, color: explain.status === "Not Started" ? "#3f3f46" : "#fff" }}>{explain.status}</span>
            {explain.owner && <span className="text-zinc-500">Owner: {explain.owner}</span>}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">{explain.explanation || "No explanation has been written for this document yet. Use Edit to add one."}</p>
          {explain.objectives?.length > 0 && (
            <div className="mt-4">
              <div className="mb-1 text-xs font-medium text-zinc-600">Requirements this document supports</div>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-100 p-2">
                {explain.objectives.map((id) => {
                  const ctrl = CONTROLS.find((c) => c.id === id);
                  return <div key={id} className="flex gap-2 text-xs"><span className="font-mono font-semibold text-zinc-700">{id}</span><span className="text-zinc-500">{ctrl?.title || ""}</span></div>;
                })}
              </div>
            </div>
          )}
          <div className="mt-5 flex justify-end"><button onClick={() => setExplain(null)} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Close</button></div>
        </ModalShell>
      )}
    </div>
  );
}

function DocumentTable({ docs, onEdit, onRemove, onStatus, onExplain }) {
  if (docs.length === 0) {
    return <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">No documents here yet.</div>;
  }
  const th = "px-3 py-2.5 font-medium";
  const td = "px-3 py-2.5 align-top";
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-sm" style={{ minWidth: 1180 }}>
        <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-zinc-500">
          <tr>
            <th className={th}>Document</th><th className={th}>Owner</th><th className={th}>Contributor</th>
            <th className={th}>Status</th><th className={th}>Objectives</th><th className={th}>Review date</th>
            <th className={th}>Tags</th><th className={th}>Classification</th><th className={th}>Comments</th>
            <th className={th}>Updates</th><th className={th}></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {docs.map((d) => (
            <tr key={d.id}>
              <td className={`${td} font-medium`}>
                <button onClick={() => onExplain(d)} className="text-left text-indigo-600 hover:text-indigo-700 hover:underline">{d.name}</button>
              </td>
              <td className={`${td} text-zinc-600`}>{d.owner || "—"}</td>
              <td className={`${td} text-zinc-600`}>{d.contributor || "—"}</td>
              <td className={td}>
                <select value={d.status} onChange={(e) => onStatus(d.id, e.target.value)}
                  className="rounded-md border px-2 py-1 text-xs font-medium outline-none"
                  style={{ borderColor: DOC_STATUS_META[d.status].hex, color: "#3f3f46" }}>
                  {DOC_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className={td}>
                {d.objectives?.length
                  ? <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700" title={d.objectives.join(", ")}>{d.objectives.length} mapped</span>
                  : <span className="text-zinc-400">—</span>}
              </td>
              <td className={`${td} whitespace-nowrap text-zinc-600`}>{d.reviewDate || "—"}</td>
              <td className={td}>
                <div className="flex max-w-[140px] flex-wrap gap-1">
                  {(d.tags || []).map((t) => <span key={t} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600">{t}</span>)}
                  {!(d.tags || []).length && <span className="text-zinc-400">—</span>}
                </div>
              </td>
              <td className={`${td} text-zinc-600`}>{d.classification}</td>
              <td className={td}><span className="block max-w-[160px] truncate text-zinc-500" title={d.comments}>{d.comments || "—"}</span></td>
              <td className={td}><span className="block max-w-[160px] truncate text-zinc-500" title={d.updates}>{d.updates || "—"}</span></td>
              <td className={`${td} whitespace-nowrap text-right`}>
                <button onClick={() => onEdit(d)} className="mr-2 text-xs font-medium text-indigo-600 hover:text-indigo-700">Edit</button>
                <button onClick={() => onRemove(d.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentModal({ noun, initial, onClose, onSave }) {
  const [f, setF] = useState(() => initial || { name: "", owner: "", contributor: "", status: "Not Started", reviewDate: "", classification: "Internal", comments: "", updates: "", explanation: "" });
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [selected, setSelected] = useState(() => new Set(initial?.objectives || []));
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  const save = () => onSave({ ...f, name: f.name.trim(), tags: tags.split(",").map((t) => t.trim()).filter(Boolean), objectives: [...selected] });

  return (
    <ModalShell title={initial ? `Edit ${noun}` : `Add ${noun}`} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={f.name} onChange={(e) => up("name", e.target.value)} className={inputCls} placeholder="e.g. Access Control Policy" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Owner</label><input value={f.owner} onChange={(e) => up("owner", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Contributor</label><input value={f.contributor} onChange={(e) => up("contributor", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={f.status} onChange={(e) => up("status", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{DOC_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Classification</label>
          <select value={f.classification} onChange={(e) => up("classification", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{DOC_CLASS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Review date</label><input type="date" value={f.reviewDate} onChange={(e) => up("reviewDate", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Tags (comma-separated)</label><input value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="access, cui, annual" /></div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Explanation</label><textarea value={f.explanation || ""} onChange={(e) => up("explanation", e.target.value)} rows={3} className={inputCls} placeholder="What is this document and what does it cover?" /></div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Objectives ({selected.size} mapped)</label><div className="mt-1"><ObjectivePicker selected={selected} onToggle={toggle} /></div></div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Comments</label><textarea value={f.comments} onChange={(e) => up("comments", e.target.value)} rows={2} className={inputCls} /></div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Updates</label><textarea value={f.updates} onChange={(e) => up("updates", e.target.value)} rows={2} className={inputCls} placeholder="Latest change note…" /></div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim()} onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Save</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  MONITORING — Evidence · Systems · People                          */
/* ================================================================== */

const EV_STATUS_META = {
  "Not Started": { label: "Not Started", hex: "#e4e4e7" },
  "Pending": { label: "Pending", hex: "#f59e0b" },
  "In Review": { label: "In Review", hex: "#0ea5e9" },
  "Collected": { label: "Collected", hex: "#10b981" },
  "Expired": { label: "Expired", hex: "#f43f5e" },
};
const EV_STATUS = Object.keys(EV_STATUS_META);

const CONNECTORS = [
  { cat: "Cloud", items: ["Amazon Web Services", "Microsoft Azure", "Google Cloud"] },
  { cat: "Identity", items: ["Okta", "Microsoft Entra ID", "Google Workspace"] },
  { cat: "HR / HRIS", items: ["Workday", "BambooHR", "Gusto", "Rippling"] },
  { cat: "Source Code", items: ["GitHub", "GitLab", "Bitbucket"] },
  { cat: "Endpoint / MDM", items: ["Microsoft Intune", "Jamf", "CrowdStrike"] },
  { cat: "Ticketing", items: ["Jira", "ServiceNow"] },
];
const PERSON_STATUS = ["Active", "Inactive"];
const TRAINING_STATUS = ["Complete", "Pending", "Overdue"];

function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((c) => { const s = String(c ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function Monitoring({ sub, evidence, setEvidence, connectors, setConnectors, people, setPeople }) {
  const META = {
    evidence: { title: "Evidence", sub: "Recurring evidence you collect and monitor against your controls." },
    systems: { title: "Systems", sub: "Connect the systems that evidence and identity data flow from." },
    people: { title: "People", sub: "Your workforce — the basis for personnel security and training controls." },
  }[sub];
  return (
    <div className="space-y-5">
      <header>
        <div className="text-xs font-medium uppercase tracking-wide text-indigo-500">Monitoring</div>
        <h1 className="text-xl font-semibold">{META.title}</h1>
        <p className="text-sm text-zinc-500">{META.sub}</p>
      </header>
      {sub === "evidence" && <EvidenceMonitor evidence={evidence} setEvidence={setEvidence} />}
      {sub === "systems" && <SystemsPage connectors={connectors} setConnectors={setConnectors} />}
      {sub === "people" && <PeoplePage people={people} setPeople={setPeople} />}
    </div>
  );
}

/* ---- Evidence ---- */
function EvidenceMonitor({ evidence, setEvidence }) {
  const [modal, setModal] = useState(null);
  const add = (e) => setEvidence((p) => [...p, { ...e, id: crypto.randomUUID() }]);
  const update = (id, patch) => setEvidence((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id) => setEvidence((p) => p.filter((e) => e.id !== id));
  const exportCSV = () => downloadCSV("evidence.csv", [
    ["Name", "Status", "Due on", "Owner", "Assigned", "Program", "Controls", "Objective"],
    ...evidence.map((e) => [e.name, e.status || "Not Started", e.dueOn || "", e.owner || "", e.assigned || "", e.program || "CMMC Level 2", (e.controlIds || []).join("; "), e.objective || ""]),
  ]);
  const th = "px-3 py-2.5 font-medium", td = "px-3 py-2.5 align-top";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {evidence.length === 0 ? <p className="text-sm text-zinc-500">Add evidence and map it to the controls it satisfies.</p> : <span />}
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={!evidence.length} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"><Download size={15} /> Export</button>
          <button onClick={() => setModal({ mode: "create" })} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Add evidence</button>
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <FolderOpen className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">No evidence yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm" style={{ minWidth: 1080 }}>
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-zinc-500">
              <tr><th className={th}>Evidence</th><th className={th}>Status</th><th className={th}>Due on</th><th className={th}>Owner</th><th className={th}>Assigned</th><th className={th}>Program</th><th className={th}>Control</th><th className={th}>Objective</th><th className={th}></th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {evidence.map((e) => (
                <tr key={e.id}>
                  <td className={`${td} font-medium text-zinc-800`}>{e.name}</td>
                  <td className={td}>
                    <select value={e.status || "Not Started"} onChange={(ev) => update(e.id, { status: ev.target.value })} className="rounded-md border px-2 py-1 text-xs font-medium outline-none" style={{ borderColor: EV_STATUS_META[e.status || "Not Started"].hex, color: "#3f3f46" }}>
                      {EV_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className={`${td} whitespace-nowrap text-zinc-600`}>{e.dueOn || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{e.owner || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{e.assigned || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{e.program || "CMMC Level 2"}</td>
                  <td className={td}>
                    <div className="flex max-w-[150px] flex-wrap gap-1">
                      {(e.controlIds || []).slice(0, 4).map((c) => <span key={c} className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700">{c}</span>)}
                      {(e.controlIds || []).length > 4 && <span className="text-[10px] text-zinc-400">+{e.controlIds.length - 4}</span>}
                      {!(e.controlIds || []).length && <span className="text-zinc-400">—</span>}
                    </div>
                  </td>
                  <td className={td}><span className="block max-w-[160px] truncate text-zinc-500" title={e.objective}>{e.objective || "—"}</span></td>
                  <td className={`${td} whitespace-nowrap text-right`}>
                    <button onClick={() => setModal({ mode: "edit", doc: e })} className="mr-2 text-xs font-medium text-indigo-600 hover:text-indigo-700">Edit</button>
                    <button onClick={() => remove(e.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <EvidenceRowModal initial={modal.doc} onClose={() => setModal(null)} onSave={(e) => { modal.mode === "edit" ? update(modal.doc.id, e) : add(e); setModal(null); }} />}
    </div>
  );
}
function EvidenceRowModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(() => initial || { name: "", status: "Not Started", dueOn: "", owner: "", assigned: "", program: "CMMC Level 2", objective: "", note: "" });
  const [selected, setSelected] = useState(() => new Set(initial?.controlIds || []));
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  return (
    <ModalShell title={initial ? "Edit evidence" : "Add evidence"} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={f.name} onChange={(e) => up("name", e.target.value)} className={inputCls} placeholder="e.g. Quarterly access review export" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={f.status} onChange={(e) => up("status", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{EV_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Due on</label><input type="date" value={f.dueOn} onChange={(e) => up("dueOn", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Owner</label><input value={f.owner} onChange={(e) => up("owner", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Assigned</label><input value={f.assigned} onChange={(e) => up("assigned", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Program</label><input value={f.program} onChange={(e) => up("program", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Objective</label><input value={f.objective} onChange={(e) => up("objective", e.target.value)} className={inputCls} placeholder="What this evidence demonstrates…" /></div>
      <div className="mt-3"><label className="block text-xs font-medium text-zinc-600">Control(s) ({selected.size})</label><div className="mt-1"><ObjectivePicker selected={selected} onToggle={toggle} /></div></div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim()} onClick={() => onSave({ ...f, name: f.name.trim(), controlIds: [...selected] })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Save</button>
      </div>
    </ModalShell>
  );
}

/* ---- Systems ---- */
function SystemsPage({ connectors, setConnectors }) {
  const connected = new Set(connectors);
  const toggle = (name) => setConnectors((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));
  const total = CONNECTORS.reduce((s, g) => s + g.items.length, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <Info size={13} /> Connecting a system is where automated evidence collection will plug in. Live sync isn't enabled in this baseline — connections are tracked here for planning.
      </div>
      <div className="text-sm text-zinc-500"><span className="font-mono font-semibold text-zinc-800">{connected.size}</span> of {total} systems connected</div>
      {CONNECTORS.map((group) => (
        <Card key={group.cat} title={group.cat}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((name) => {
              const on = connected.has(name);
              return (
                <div key={name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-sm font-semibold text-zinc-500">{name[0]}</div>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-zinc-800">{name}</div>{on && <div className="flex items-center gap-1 text-[11px] text-emerald-600"><CheckCircle2 size={11} /> Connected</div>}</div>
                  <button onClick={() => toggle(name)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${on ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                    {on ? "Disconnect" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---- People ---- */
function PeoplePage({ people, setPeople }) {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);
  const remove = (id) => setPeople((p) => p.filter((x) => x.id !== id));
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const rows = parseCSV(String(r.result));
        const added = rows.filter((o) => o.name).map((o) => ({
          id: crypto.randomUUID(), name: o.name, email: o.email || "", role: o.role || o.title || "", department: o.department || "",
          manager: o.manager || "", status: o.status || "Active", training: o.training || "Pending", startDate: o.startdate || o["start date"] || "",
        }));
        setPeople((p) => [...p, ...added]); setMsg(`Imported ${added.length} employee${added.length === 1 ? "" : "s"}.`);
      } catch { setMsg("Could not parse that CSV."); }
      e.target.value = "";
    };
    r.readAsText(f);
  };
  const trainHex = (t) => ({ Complete: "#10b981", Pending: "#f59e0b", Overdue: "#f43f5e" }[t] || "#94a3b8");
  const th = "px-3 py-2.5 font-medium", td = "px-3 py-2.5";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-4 text-sm">
          <span className="text-zinc-500">Employees <span className="font-mono font-semibold text-zinc-800">{people.length}</span></span>
          <span className="text-zinc-500">Training complete <span className="font-mono font-semibold text-zinc-800">{people.filter((p) => p.training === "Complete").length}</span></span>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv" onChange={onFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Upload size={15} /> Import from CSV</button>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Create employee</button>
        </div>
      </div>
      {msg && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</div>}

      {people.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <Users className="mx-auto text-zinc-300" size={32} />
          <p className="mt-2 text-sm font-medium text-zinc-700">No employees yet</p>
          <p className="text-sm text-zinc-500">Add one, or import a CSV with columns: name, email, role, department, manager, status, training, startdate.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm" style={{ minWidth: 900 }}>
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-zinc-500">
              <tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Department</th><th className={th}>Manager</th><th className={th}>Status</th><th className={th}>Training</th><th className={th}>Start date</th><th className={th}></th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {people.map((p) => (
                <tr key={p.id}>
                  <td className={`${td} font-medium text-zinc-800`}>{p.name}</td>
                  <td className={`${td} text-zinc-600`}>{p.email || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{p.role || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{p.department || "—"}</td>
                  <td className={`${td} text-zinc-600`}>{p.manager || "—"}</td>
                  <td className={td}><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${p.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{p.status}</span></td>
                  <td className={td}><span className="inline-flex items-center gap-1.5 text-zinc-600"><span className="h-2 w-2 rounded-full" style={{ background: trainHex(p.training) }} />{p.training}</span></td>
                  <td className={`${td} whitespace-nowrap text-zinc-600`}>{p.startDate || "—"}</td>
                  <td className={`${td} text-right`}><button onClick={() => remove(p.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <CreateEmployeeModal onClose={() => setModal(false)} onSave={(p) => { setPeople((x) => [...x, { ...p, id: crypto.randomUUID() }]); setModal(false); }} />}
    </div>
  );
}
function CreateEmployeeModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", email: "", role: "", department: "", manager: "", status: "Active", training: "Pending", startDate: "" });
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  return (
    <ModalShell title="Create employee" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={f.name} onChange={(e) => up("name", e.target.value)} className={inputCls} placeholder="Full name" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Email</label><input value={f.email} onChange={(e) => up("email", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Role</label><input value={f.role} onChange={(e) => up("role", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Department</label><input value={f.department} onChange={(e) => up("department", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Manager</label><input value={f.manager} onChange={(e) => up("manager", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Status</label>
          <select value={f.status} onChange={(e) => up("status", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{PERSON_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Training</label>
          <select value={f.training} onChange={(e) => up("training", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{TRAINING_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Start date</label><input type="date" value={f.startDate} onChange={(e) => up("startDate", e.target.value)} className={inputCls} /></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim()} onClick={() => onSave(f)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Create</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  INTEGRATIONS — create & manage connections                         */
/* ================================================================== */

const INTEGRATIONS = [
  { name: "Jira", category: "Ticketing", fields: [["Site URL", "url"], ["Email", "email"], ["API token", "token"]] },
  { name: "GitHub", category: "Source Code", fields: [["Organization", "org"], ["Personal access token", "token"]] },
  { name: "GitLab", category: "Source Code", fields: [["Instance URL", "url"], ["Access token", "token"]] },
  { name: "Bitbucket", category: "Source Code", fields: [["Workspace", "workspace"], ["App password", "token"]] },
  { name: "Slack", category: "Communication", fields: [["Workspace", "workspace"], ["Bot token", "token"]] },
  { name: "Microsoft Teams", category: "Communication", fields: [["Tenant ID", "tenant"], ["Client secret", "token"]] },
  { name: "Amazon Web Services", category: "Cloud", fields: [["Account ID", "account"], ["Access key ID", "key"], ["Secret access key", "token"]] },
  { name: "Microsoft Azure", category: "Cloud", fields: [["Tenant ID", "tenant"], ["Client ID", "key"], ["Client secret", "token"]] },
  { name: "Google Cloud", category: "Cloud", fields: [["Project ID", "project"], ["Service account key", "token"]] },
  { name: "Okta", category: "Identity", fields: [["Domain", "url"], ["API token", "token"]] },
  { name: "Microsoft Entra ID", category: "Identity", fields: [["Tenant ID", "tenant"], ["Client secret", "token"]] },
  { name: "ServiceNow", category: "Ticketing", fields: [["Instance URL", "url"], ["API token", "token"]] },
  { name: "Microsoft Intune", category: "Endpoint", fields: [["Tenant ID", "tenant"], ["Client secret", "token"]] },
  { name: "Jamf", category: "Endpoint", fields: [["Server URL", "url"], ["API token", "token"]] },
  { name: "Confluence", category: "Documentation", fields: [["Site URL", "url"], ["API token", "token"]] },
];
const CONN_STATUS_META = {
  "Connected": { hex: "#10b981" }, "Error": { hex: "#f43f5e" }, "Disabled": { hex: "#94a3b8" },
};
const relTime = (iso) => {
  if (!iso) return "never";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};

function Integrations({ connections, setConnections }) {
  const [modal, setModal] = useState(null); // { provider } | { custom:true } | { pick:true }
  const [q, setQ] = useState("");
  const add = (c) => setConnections((p) => [...p, { ...c, id: crypto.randomUUID(), status: "Connected", createdAt: new Date().toISOString(), lastSync: new Date().toISOString() }]);
  const remove = (id) => setConnections((p) => p.filter((c) => c.id !== id));
  const sync = (id) => setConnections((p) => p.map((c) => (c.id === id ? { ...c, lastSync: new Date().toISOString(), status: "Connected" } : c)));
  const toggle = (id) => setConnections((p) => p.map((c) => (c.id === id ? { ...c, status: c.status === "Disabled" ? "Connected" : "Disabled" } : c)));

  const connectedNames = new Set(connections.map((c) => c.provider));
  const catalog = INTEGRATIONS.filter((i) => !q || i.name.toLowerCase().includes(q.toLowerCase()) || i.category.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="text-sm text-zinc-500">Create connections to the tools your evidence and data live in.</p>
        </div>
        <button onClick={() => setModal({ pick: true })} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Add connection</button>
      </header>

      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <Info size={13} /> Connections are saved locally for planning. Live sync and secure credential vaulting are part of the automation layer and aren't active in this baseline.
      </div>

      {/* Active connections */}
      <Card title={`Your connections (${connections.length})`}>
        {connections.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-400">No connections yet. Add one from the catalog below.</div>
        ) : (
          <div className="space-y-2">
            {connections.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-sm font-semibold text-zinc-500">{c.provider[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-800">{c.name}</div>
                  <div className="text-xs text-zinc-400">{c.provider} · {c.category} · synced {relTime(c.lastSync)}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: CONN_STATUS_META[c.status].hex }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: CONN_STATUS_META[c.status].hex }} />{c.status}
                </span>
                <button onClick={() => sync(c.id)} className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50">Sync</button>
                <button onClick={() => toggle(c.id)} className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50">{c.status === "Disabled" ? "Enable" : "Disable"}</button>
                <button onClick={() => remove(c.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Catalog */}
      <Card title="Available integrations" action={
        <div className="relative w-52">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
        </div>
      }>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((i) => (
            <div key={i.name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-sm font-semibold text-zinc-500">{i.name[0]}</div>
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-zinc-800">{i.name}</div><div className="text-xs text-zinc-400">{i.category}</div></div>
              <button onClick={() => setModal({ provider: i })} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">Connect</button>
            </div>
          ))}
          <button onClick={() => setModal({ custom: true })} className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 p-3 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-400"><Plus size={16} /></div>
            <div><div className="text-sm font-medium text-zinc-800">Custom connection</div><div className="text-xs text-zinc-400">Connect anything else</div></div>
          </button>
        </div>
      </Card>

      {modal && <ConnectionModal state={modal} onClose={() => setModal(null)} onSave={(c) => { add(c); setModal(null); }} onPick={(m) => setModal(m)} />}
    </div>
  );
}

function ConnectionModal({ state, onClose, onSave, onPick }) {
  // provider selection step
  if (state.pick) {
    return (
      <ModalShell title="Add connection" onClose={onClose}>
        <p className="mb-3 text-xs text-zinc-500">Choose a tool to connect, or create a custom connection.</p>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {INTEGRATIONS.map((i) => (
            <button key={i.name} onClick={() => onPick({ provider: i })} className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-left hover:bg-zinc-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-sm font-semibold text-zinc-500">{i.name[0]}</div>
              <div className="flex-1"><div className="text-sm font-medium text-zinc-800">{i.name}</div><div className="text-xs text-zinc-400">{i.category}</div></div>
              <ChevronRight size={15} className="text-zinc-400" />
            </button>
          ))}
          <button onClick={() => onPick({ custom: true })} className="flex w-full items-center gap-3 rounded-lg border border-dashed border-zinc-300 p-3 text-left hover:bg-zinc-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-400"><Plus size={15} /></div>
            <div className="flex-1"><div className="text-sm font-medium text-zinc-800">Custom connection</div><div className="text-xs text-zinc-400">Connect anything else</div></div>
          </button>
        </div>
      </ModalShell>
    );
  }
  return <ConnectionConfig state={state} onClose={onClose} onSave={onSave} />;
}

function ConnectionConfig({ state, onClose, onSave }) {
  const custom = !!state.custom;
  const provider = state.provider;
  const fields = custom ? [["Base URL", "url"], ["API token", "token"]] : provider.fields;
  const [name, setName] = useState(custom ? "" : provider.name);
  const [category, setCategory] = useState(custom ? "" : provider.category);
  const [cfg, setCfg] = useState({});
  const up = (k, v) => setCfg((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  const providerName = custom ? (name || "Custom") : provider.name;

  return (
    <ModalShell title={custom ? "Custom connection" : `Connect ${provider.name}`} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Connection name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder={custom ? "e.g. Internal wiki" : `${provider.name} (production)`} />
      {custom && (
        <>
          <label className="mt-3 block text-xs font-medium text-zinc-600">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} placeholder="e.g. Ticketing" />
        </>
      )}
      {fields.map(([label, key]) => (
        <div key={key} className="mt-3">
          <label className="block text-xs font-medium text-zinc-600">{label}</label>
          <input type={key === "token" ? "password" : "text"} value={cfg[key] || ""} onChange={(e) => up(key, e.target.value)} className={inputCls} placeholder={key === "token" ? "••••••••" : ""} />
        </div>
      ))}
      <p className="mt-3 flex items-center gap-1 text-[11px] text-zinc-400"><Info size={11} /> Credentials are stored locally in this workspace only.</p>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!name.trim()} onClick={() => onSave({ provider: providerName, name: name.trim(), category: category || "Other", config: cfg })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Connect</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  AUDITS                                                             */
/* ================================================================== */

const AUDIT_TYPES = {
  framework: { label: "Audit a framework", desc: "Assess readiness against a full framework.", Icon: Layers },
  controlset: { label: "Audit a control set", desc: "Audit a specific set of controls.", Icon: ListChecks },
  thirdparty: { label: "Third-party audit", desc: "Record a formal external (C3PAO) assessment.", Icon: Building2 },
};
const AUDIT_STATUS_META = { "Planned": { hex: "#94a3b8" }, "In Progress": { hex: "#0ea5e9" }, "Completed": { hex: "#10b981" } };
const AUDIT_STATUS = Object.keys(AUDIT_STATUS_META);
const auditResults = (type) => type === "thirdparty"
  ? ["Not Determined", "Certified", "Conditional (POA&M)", "Not Certified"]
  : ["Not Determined", "Passed", "Passed with findings", "Failed"];

function Audits({ audits, setAudits, frameworks, controlSets, assessment, evidenceByControl }) {
  const [openId, setOpenId] = useState(null);
  const [start, setStart] = useState(false);
  const open = audits.find((a) => a.id === openId);
  const update = (id, patch) => setAudits((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id) => { setAudits((p) => p.filter((a) => a.id !== id)); setOpenId(null); };

  if (open) return <AuditDetail audit={open} assessment={assessment} evidenceByControl={evidenceByControl} onBack={() => setOpenId(null)} onUpdate={(patch) => update(open.id, patch)} onRemove={() => remove(open.id)} />;

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Audits</h1>
          <p className="text-sm text-zinc-500">Run internal readiness audits or track a formal external assessment.</p>
        </div>
        <button onClick={() => setStart(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={15} /> Start an audit</button>
      </header>

      {audits.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(AUDIT_TYPES).map(([k, t]) => (
            <button key={k} onClick={() => setStart(true)} className="rounded-xl border border-zinc-200 bg-white p-5 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
              <t.Icon size={20} className="text-indigo-500" />
              <div className="mt-2 font-medium text-zinc-800">{t.label}</div>
              <div className="text-sm text-zinc-500">{t.desc}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map((a) => {
            const c = complianceTally(a.controlIds, assessment, evidenceByControl);
            return (
              <div key={a.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900">{a.name}</span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">{AUDIT_TYPES[a.type].label}</span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {a.scopeName} · {a.controlIds.length} controls
                      {a.lead ? ` · Lead: ${a.lead}` : ""}{a.assessor ? ` · Assessor: ${a.assessor}` : ""}{a.dueDate ? ` · Due ${a.dueDate}` : ""}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: AUDIT_STATUS_META[a.status].hex }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: AUDIT_STATUS_META[a.status].hex }} />{a.status}
                  </span>
                  <button onClick={() => setOpenId(a.id)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Open</button>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-medium text-zinc-700">{c.compliancePct}% compliant across scope</span>
                    {a.result && a.result !== "Not Determined" && <span className="font-medium text-zinc-700">Result: {a.result}</span>}
                  </div>
                  <StackedBar segments={complianceSegments(c)} total={c.total} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {start && <StartAuditModal frameworks={frameworks} controlSets={controlSets} onClose={() => setStart(false)}
        onCreate={(a) => { setAudits((p) => [...p, { ...a, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]); setStart(false); }} />}
    </div>
  );
}

function StartAuditModal({ frameworks, controlSets, onClose, onCreate }) {
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [assessor, setAssessor] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [scopeId, setScopeId] = useState("");
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";

  const fwOptions = frameworks.filter((f) => f.controlIds.length > 0);
  const setOptions = [BASELINE_SET, ...controlSets];

  const create = () => {
    let controlIds = [], scopeName = "";
    if (type === "framework") { const fw = fwOptions.find((f) => f.id === scopeId) || fwOptions[0]; controlIds = fw.controlIds; scopeName = fw.name; }
    else if (type === "controlset") { const s = setOptions.find((s) => s.id === scopeId) || setOptions[0]; controlIds = s.controlIds; scopeName = s.name; }
    else { controlIds = CONTROLS.map((c) => c.id); scopeName = "CMMC Level 2 (full scope)"; }
    onCreate({ name: name.trim() || AUDIT_TYPES[type].label, type, scopeName, controlIds, lead, assessor, dueDate, status: "Planned", result: "Not Determined", notes: "" });
  };

  if (!type) {
    return (
      <ModalShell title="Start an audit" onClose={onClose}>
        <p className="mb-3 text-xs text-zinc-500">What do you want to audit?</p>
        <div className="space-y-2">
          {Object.entries(AUDIT_TYPES).map(([k, t]) => (
            <button key={k} onClick={() => { setType(k); setName(t.label); }} className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
              <t.Icon size={18} className="text-indigo-500" />
              <div className="flex-1"><div className="text-sm font-medium text-zinc-800">{t.label}</div><div className="text-xs text-zinc-400">{t.desc}</div></div>
              <ChevronRight size={15} className="text-zinc-400" />
            </button>
          ))}
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={AUDIT_TYPES[type].label} onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Audit name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />

      {type === "framework" && (
        <>
          <label className="mt-3 block text-xs font-medium text-zinc-600">Framework</label>
          <select value={scopeId} onChange={(e) => setScopeId(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">
            {fwOptions.map((f) => <option key={f.id} value={f.id}>{f.name} ({f.controlIds.length})</option>)}
          </select>
        </>
      )}
      {type === "controlset" && (
        <>
          <label className="mt-3 block text-xs font-medium text-zinc-600">Control set</label>
          <select value={scopeId} onChange={(e) => setScopeId(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">
            {setOptions.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.controlIds.length})</option>)}
          </select>
        </>
      )}
      {type === "thirdparty" && (
        <>
          <label className="mt-3 block text-xs font-medium text-zinc-600">Assessor / C3PAO</label>
          <input value={assessor} onChange={(e) => setAssessor(e.target.value)} className={inputCls} placeholder="Assessment organization" />
          <p className="mt-2 text-[11px] text-zinc-400">Scope defaults to the full 110 CMMC Level 2 controls.</p>
        </>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">{type === "thirdparty" ? "Point of contact" : "Audit lead"}</label><input value={lead} onChange={(e) => setLead(e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Target date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} /></div>
      </div>

      <div className="mt-5 flex justify-between">
        <button onClick={() => setType(null)} className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100">← Back</button>
        <button onClick={create} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Start audit</button>
      </div>
    </ModalShell>
  );
}

function AuditDetail({ audit, assessment, evidenceByControl, onBack, onUpdate, onRemove }) {
  const [gapsOnly, setGapsOnly] = useState(true);
  const c = complianceTally(audit.controlIds, assessment, evidenceByControl);
  const scoped = CONTROLS.filter((x) => audit.controlIds.includes(x.id));
  const rows = scoped.map((x) => ({ ...x, cs: complianceStatus(x.id, assessment, evidenceByControl) }))
    .filter((x) => (gapsOnly ? !["compliant", "notApplicable"].includes(x.cs) : true));
  const results = auditResults(audit.type);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800"><ChevronLeft size={15} /> All audits</button>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{audit.name}</h1>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">{AUDIT_TYPES[audit.type].label}</span>
          </div>
          <p className="text-sm text-zinc-500">{audit.scopeName} · {audit.controlIds.length} controls{audit.assessor ? ` · ${audit.assessor}` : ""}{audit.dueDate ? ` · Due ${audit.dueDate}` : ""}</p>
        </div>
        <button onClick={onRemove} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-rose-500"><Trash2 size={15} /> Delete</button>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Readiness">
          <div className="flex items-center gap-4">
            <Donut segments={complianceSegments(c)} centerTop={`${c.compliancePct}%`} centerBottom="compliant" />
            <div className="flex-1"><KeyLegend order={COMPLIANCE_KEYS} meta={COMPLIANCE} counts={c} cols={1} /></div>
          </div>
        </Card>
        <Card title="Audit status" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-zinc-600">Status</label>
              <select value={audit.status} onChange={(e) => onUpdate({ status: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{AUDIT_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-zinc-600">Result</label>
              <select value={audit.result} onChange={(e) => onUpdate({ result: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{results.map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
          <label className="mt-3 block text-xs font-medium text-zinc-600">Notes</label>
          <textarea value={audit.notes} onChange={(e) => onUpdate({ notes: e.target.value })} rows={3} className="mt-1 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="Auditor notes, scope caveats, evidence requests…" />
        </Card>
      </div>

      <Card title={`Findings (${rows.length})`} action={
        <label className="flex items-center gap-2 text-xs text-zinc-500"><input type="checkbox" checked={gapsOnly} onChange={(e) => setGapsOnly(e.target.checked)} className="accent-indigo-600" /> Gaps only</label>
      }>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">{gapsOnly ? "No open gaps in scope — everything is compliant or N/A." : "No controls in scope."}</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs font-medium text-zinc-500"><tr><th className="py-2">Control</th><th className="py-2">Requirement</th><th className="py-2">Status</th></tr></thead>
              <tbody className="divide-y divide-zinc-100">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-2 align-top font-mono text-xs font-semibold text-zinc-800">{r.id}</td>
                    <td className="py-2 pr-2 align-top text-zinc-600">{r.title}</td>
                    <td className="py-2 align-top"><span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: COMPLIANCE[r.cs].hex }}>{COMPLIANCE[r.cs].label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ================================================================== */
/*  TRUST — portal, resources, NDA approval requests                   */
/* ================================================================== */

const DEFAULT_TRUST = {
  company: "Your Company",
  tagline: "Our security & compliance posture at a glance",
  published: false,
  resources: [
    { id: "r1", name: "CMMC Level 2 Status", description: "Current assessment status and SPRS score.", category: "Compliance", access: "public" },
    { id: "r2", name: "Security Overview", description: "Summary of our security program.", category: "Overview", access: "public" },
    { id: "r3", name: "System Security Plan (SSP)", description: "Full SSP, available under NDA.", category: "Document", access: "nda" },
    { id: "r4", name: "Penetration Test Report", description: "Latest third-party pentest, under NDA.", category: "Report", access: "nda" },
  ],
  requests: [],
};
const REQ_STATUS_META = { "Pending": { hex: "#f59e0b" }, "Approved": { hex: "#10b981" }, "Denied": { hex: "#f43f5e" } };

function Trust({ trust, setTrust, sprs, overall }) {
  const [addRes, setAddRes] = useState(false);
  const [reqModal, setReqModal] = useState(null); // { preset }
  const setField = (k, v) => setTrust((p) => ({ ...p, [k]: v }));
  const addResource = (r) => setTrust((p) => ({ ...p, resources: [...p.resources, { ...r, id: crypto.randomUUID() }] }));
  const toggleAccess = (id) => setTrust((p) => ({ ...p, resources: p.resources.map((r) => (r.id === id ? { ...r, access: r.access === "public" ? "nda" : "public" } : r)) }));
  const removeResource = (id) => setTrust((p) => ({ ...p, resources: p.resources.filter((r) => r.id !== id) }));
  const addRequest = (rq) => setTrust((p) => ({ ...p, requests: [{ ...rq, id: crypto.randomUUID(), date: new Date().toISOString() }, ...p.requests] }));
  const updateRequest = (id, patch) => setTrust((p) => ({ ...p, requests: p.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const removeRequest = (id) => setTrust((p) => ({ ...p, requests: p.requests.filter((r) => r.id !== id) }));

  const band = sprs >= 110 ? "Meets Level 2" : sprs >= 88 ? "Conditional Level 2" : "In progress";
  const pending = trust.requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Trust</h1>
          <p className="text-sm text-zinc-500">Your public trust portal and access requests.</p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
          <input type="checkbox" checked={trust.published} onChange={(e) => setField("published", e.target.checked)} className="accent-emerald-600" />
          <span className={trust.published ? "font-medium text-emerald-600" : "text-zinc-500"}>{trust.published ? "Portal published" : "Portal unpublished"}</span>
        </label>
      </header>

      {/* Portal preview */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center gap-2 text-xs text-slate-300"><ShieldCheck size={14} /> Trust Center {trust.published && <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">Live</span>}</div>
          <input value={trust.company} onChange={(e) => setField("company", e.target.value)} className="mt-1 w-full bg-transparent text-xl font-semibold text-white outline-none" />
          <input value={trust.tagline} onChange={(e) => setField("tagline", e.target.value)} className="w-full bg-transparent text-sm text-slate-300 outline-none" />
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs"><span className="text-slate-400">SPRS </span><span className="font-mono font-semibold">{sprs}</span></span>
            <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs"><span className="text-slate-400">Readiness </span><span className="font-mono font-semibold">{overall.scorePct}%</span></span>
            <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium">{band}</span>
          </div>
          <div className="mt-3 font-mono text-[11px] text-slate-400">trust.{slug(trust.company) || "your-company"}.com</div>
        </div>
        <div className="p-5">
          <div className="mb-2 text-sm font-medium text-zinc-700">How visitors see your resources</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {trust.resources.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-800">{r.name}</div>
                  <div className="truncate text-xs text-zinc-400">{r.description}</div>
                </div>
                {r.access === "public"
                  ? <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">View</button>
                  : <button onClick={() => setReqModal({ preset: r.id })} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"><Lock size={12} /> Request under NDA</button>}
              </div>
            ))}
            {trust.resources.length === 0 && <div className="text-sm text-zinc-400">No resources published yet.</div>}
          </div>
        </div>
      </div>

      {/* Manage resources */}
      <Card title="Resources on your trust page" action={
        <button onClick={() => setAddRes(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={14} /> Add to trust page</button>
      }>
        {trust.resources.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">Add a resource to publish on your trust page.</div>
        ) : (
          <div className="space-y-2">
            {trust.resources.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-800">{r.name}</div>
                  <div className="text-xs text-zinc-400">{r.category}</div>
                </div>
                <button onClick={() => toggleAccess(r.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${r.access === "nda" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {r.access === "nda" ? <><Lock size={11} /> NDA required</> : <>Public</>}
                </button>
                <button onClick={() => removeResource(r.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Approval requests */}
      <Card title={`Approval requests${pending ? ` · ${pending} pending` : ""}`} action={
        <button onClick={() => setReqModal({})} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Plus size={14} /> New request</button>
      }>
        {trust.requests.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">No access requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: 820 }}>
              <thead className="text-left text-xs font-medium text-zinc-500"><tr><th className="py-2">Requester</th><th className="py-2">Resource</th><th className="py-2">NDA</th><th className="py-2">Status</th><th className="py-2 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-zinc-100">
                {trust.requests.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 align-top"><div className="font-medium text-zinc-800">{r.name}</div><div className="text-xs text-zinc-400">{r.company || r.email}</div></td>
                    <td className="py-2 align-top text-zinc-600">{r.resourceName}</td>
                    <td className="py-2 align-top">
                      {r.ndaRequired ? (
                        r.ndaStatus === "Signed"
                          ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={12} /> Signed</span>
                          : r.ndaStatus === "Sent"
                            ? <button onClick={() => updateRequest(r.id, { ndaStatus: "Signed" })} className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50">Mark signed</button>
                            : <button onClick={() => updateRequest(r.id, { ndaStatus: "Sent" })} className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"><Lock size={11} /> Send NDA</button>
                      ) : <span className="text-xs text-zinc-400">Not required</span>}
                    </td>
                    <td className="py-2 align-top"><span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: REQ_STATUS_META[r.status].hex }}><span className="h-2 w-2 rounded-full" style={{ background: REQ_STATUS_META[r.status].hex }} />{r.status}</span></td>
                    <td className="py-2 align-top text-right">
                      {r.status === "Pending" ? (
                        <span className="inline-flex gap-1.5">
                          <button disabled={r.ndaRequired && r.ndaStatus !== "Signed"} onClick={() => updateRequest(r.id, { status: "Approved" })}
                            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-40" title={r.ndaRequired && r.ndaStatus !== "Signed" ? "NDA must be signed first" : ""}>Approve</button>
                          <button onClick={() => updateRequest(r.id, { status: "Denied" })} className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50">Deny</button>
                        </span>
                      ) : <button onClick={() => removeRequest(r.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={14} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {addRes && <AddResourceModal onClose={() => setAddRes(false)} onSave={(r) => { addResource(r); setAddRes(false); }} />}
      {reqModal && <NewRequestModal resources={trust.resources} preset={reqModal.preset} onClose={() => setReqModal(null)}
        onSave={(rq) => { addRequest(rq); setReqModal(null); }} />}
    </div>
  );
}

function AddResourceModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", description: "", category: "Document", access: "public" });
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  return (
    <ModalShell title="Add to trust page" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Name</label>
      <input value={f.name} onChange={(e) => up("name", e.target.value)} className={inputCls} placeholder="e.g. SOC 2 Type II Report" />
      <label className="mt-3 block text-xs font-medium text-zinc-600">Description</label>
      <input value={f.description} onChange={(e) => up("description", e.target.value)} className={inputCls} />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Category</label><input value={f.category} onChange={(e) => up("category", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Access</label>
          <select value={f.access} onChange={(e) => up("access", e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none"><option value="public">Public</option><option value="nda">NDA required</option></select></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim()} onClick={() => onSave({ ...f, name: f.name.trim() })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Add</button>
      </div>
    </ModalShell>
  );
}

function NewRequestModal({ resources, preset, onClose, onSave }) {
  const [f, setF] = useState({ name: "", email: "", company: "" });
  const [resourceId, setResourceId] = useState(preset || resources[0]?.id || "");
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  const res = resources.find((r) => r.id === resourceId);
  const save = () => {
    const ndaRequired = res?.access === "nda";
    onSave({ name: f.name.trim(), email: f.email.trim(), company: f.company.trim(), resourceName: res?.name || "—", ndaRequired, ndaStatus: ndaRequired ? "Not sent" : "—", status: "Pending" });
  };
  return (
    <ModalShell title="New access request" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Requester name</label>
      <input value={f.name} onChange={(e) => up("name", e.target.value)} className={inputCls} />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Email</label><input value={f.email} onChange={(e) => up("email", e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-zinc-600">Company</label><input value={f.company} onChange={(e) => up("company", e.target.value)} className={inputCls} /></div>
      </div>
      <label className="mt-3 block text-xs font-medium text-zinc-600">Resource requested</label>
      <select value={resourceId} onChange={(e) => setResourceId(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">
        {resources.map((r) => <option key={r.id} value={r.id}>{r.name}{r.access === "nda" ? " (NDA)" : ""}</option>)}
      </select>
      {res?.access === "nda" && <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-600"><Lock size={11} /> This resource requires a signed NDA before access is granted.</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!f.name.trim() || !resourceId} onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Submit request</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  REPORTS                                                            */
/* ================================================================== */

function toCSV(rows) {
  return rows.map((r) => r.map((c) => { const s = String(c ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(",")).join("\n");
}
const mimeFor = (ext) => (ext === "html" ? "text/html" : ext === "csv" ? "text/csv" : ext === "doc" ? "application/msword" : "text/plain");
function triggerDownload(filename, content, ext) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeFor(ext) }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
function printHTML(html) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed"; iframe.style.right = "0"; iframe.style.bottom = "0"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document; doc.open(); doc.write(html); doc.close();
  const go = () => { try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) {} };
  iframe.onload = go; setTimeout(go, 400); setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) {} }, 60000);
}

function svgGaugeStr(score) {
  const frac = Math.max(0, Math.min(110, score)) / 110, L = Math.PI * 100;
  const band = score >= 110 ? "#059669" : score >= 88 ? "#d97706" : "#e11d48";
  return `<svg viewBox="0 0 240 150" width="220" height="138" xmlns="http://www.w3.org/2000/svg">
<path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="#e4e4e7" stroke-width="16" stroke-linecap="round"/>
<path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="${band}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${frac * L} ${L}"/>
<text x="120" y="106" text-anchor="middle" font-size="42" font-weight="700" fill="#18181b" font-family="monospace">${score}</text>
<text x="120" y="126" text-anchor="middle" font-size="11" fill="#a1a1aa" font-family="monospace">/ 110</text></svg>`;
}
function svgDonutStr(segments, opts = {}) {
  const size = opts.size || 150, thickness = opts.thickness || 26, r = (size - thickness) / 2, cx = size / 2, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0, arcs = "";
  if (total === 0) arcs = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="#eef0f2" stroke-width="${thickness}"/>`;
  else segments.forEach((s) => { if (!s.value) return; const dash = (s.value / total) * circ; arcs += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}" stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-acc}" transform="rotate(-90 ${cx} ${cx})"/>`; acc += dash; });
  const ct = opts.centerTop != null ? `<text x="${cx}" y="${cx - 1}" text-anchor="middle" dominant-baseline="middle" font-size="${size * 0.2}" font-weight="700" fill="#18181b" font-family="monospace">${opts.centerTop}</text>` : "";
  const cb = opts.centerBottom != null ? `<text x="${cx}" y="${cx + size * 0.14}" text-anchor="middle" font-size="${size * 0.088}" fill="#a1a1aa">${opts.centerBottom}</text>` : "";
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${arcs}${ct}${cb}</svg>`;
}
const legendStr = (items) => `<div style="display:inline-block;vertical-align:middle;margin-left:18px">${items.map((i) => `<div style="font-size:12px;margin:3px 0"><span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${i.color};margin-right:7px;vertical-align:middle"></span>${i.label} — <b>${i.value}</b></div>`).join("")}</div>`;
const chartRow = (svg, legend) => `<div style="margin:8px 0"><div style="display:inline-block;vertical-align:middle">${svg}</div>${legend || ""}</div>`;

const EXEC_SECTIONS = [
  ["cover", "Cover page"], ["posture", "Executive posture"], ["status", "Requirement status"], ["families", "Progress by family"],
  ["poam", "Open POA&M items"], ["risks", "Risk register"], ["vendors", "Vendor risk"], ["assets", "Asset inventory"],
  ["people", "Workforce"], ["documents", "Document register"], ["audits", "Audits"],
];
const defaultExecOpts = () => ({ title: "CMMC Level 2 — Executive Report", preparedFor: "", logo: true, sections: Object.fromEntries(EXEC_SECTIONS.map(([k]) => [k, true])) });

function buildExecReport(d, o = defaultExecOpts()) {
  const c = d.overall, org = d.orgName || "Your Organization", sec = o.sections || {};
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const monogram = (org.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase();
  const logo = o.logo ? `<div class="logo">${esc(monogram)}</div>` : "";
  const band = d.sprs >= 110 ? "Meets Level 2" : d.sprs >= 88 ? "Conditional Level 2" : "In progress";
  const bar = (val, max, color) => `<div style="background:#eef0f2;border-radius:6px;height:10px;overflow:hidden"><div style="width:${max ? (val / max) * 100 : 0}%;height:100%;background:${color}"></div></div>`;
  const openPoam = d.actions.filter((a) => a.status !== "Done");
  const fam = FAMILIES.map((f) => { const list = CONTROLS.filter((x) => x.family === f.key); const yes = list.filter((x) => d.assessment[x.id]?.status === "yes").length; return { f, total: list.length, yes }; });
  const statusSegs = [{ value: c.yes, color: "#10b981", label: "Yes" }, { value: c.partial, color: "#f59e0b", label: "Partially" }, { value: c.no, color: "#f43f5e", label: "No" }, { value: c.na, color: "#94a3b8", label: "Not applicable" }, { value: c.notAnswered, color: "#e4e4e7", label: "Not answered" }];
  const distro = (arr, keyfn) => { const m = {}; RISK_ORDER.forEach((k) => (m[k] = 0)); arr.forEach((x) => m[keyfn(x)]++); return RISK_ORDER.map((k) => ({ value: m[k], color: RISK_LEVELS[k].hex, label: RISK_LEVELS[k].label })); };
  const riskSegs = distro(d.risks, (r) => scoreToLevel(r.likelihood * r.impact));
  const vendSegs = distro(d.vendors, (v) => vendorLevel(v));
  const heat = () => { let rows = ""; [5, 4, 3, 2, 1].forEach((lik) => { let cells = ""; [1, 2, 3, 4, 5].forEach((imp) => { const n = d.risks.filter((r) => r.impact === imp && r.likelihood === lik).length; const col = RISK_LEVELS[scoreToLevel(imp * lik)].hex; cells += `<td style="background:${col};color:#fff;text-align:center;font-weight:700;width:34px;height:30px;border:2px solid #fff;opacity:${n ? 1 : 0.3}">${n || ""}</td>`; }); rows += `<tr>${cells}</tr>`; }); return `<div style="display:inline-block;vertical-align:middle"><table style="border-collapse:collapse;width:auto"><tbody>${rows}</tbody></table><div style="font-size:10px;color:#a1a1aa;text-align:center;margin-top:2px">Impact →</div></div>`; };
  const page = (inner) => `<div class="page">${inner}</div>`;
  const tbl = (head, rows) => `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${head.length}" style="color:#a1a1aa">None</td></tr>`}</tbody></table>`;

  const pages = [];
  if (sec.cover) pages.push(page(`<div class="cover">${logo}<h1>${esc(o.title || "Executive Report")}</h1><div class="muted" style="font-size:15px">${esc(org)}</div>${o.preparedFor ? `<div class="muted">Prepared for: ${esc(o.preparedFor)}</div>` : ""}<div class="muted" style="margin-top:24px">Generated ${new Date().toLocaleString()}</div><div class="muted">Framework: CMMC Level 2 · NIST SP 800-171 Rev 2</div></div>`));
  if (sec.posture) pages.push(page(`<h2>Executive posture</h2>
    ${chartRow(svgGaugeStr(d.sprs), legendStr([{ color: "#10b981", label: "Readiness", value: c.scorePct + "%" }, { color: "#6366f1", label: "Answered", value: (c.total - c.notAnswered) + "/110" }, { color: (d.sprs >= 110 ? "#059669" : d.sprs >= 88 ? "#d97706" : "#e11d48"), label: "Status", value: band }]))}
    <div style="margin:12px 0"><span class="kpi">SPRS<br><b>${d.sprs}</b> / 110</span><span class="kpi">Readiness<br><b>${c.scorePct}%</b></span><span class="kpi">Answered<br><b>${c.total - c.notAnswered}</b> / 110</span><span class="kpi">Status<br><b>${band}</b></span></div>
    <p class="muted">This report summarizes the organization's readiness against the 110 CMMC Level 2 requirements. The SPRS score is an estimate; reconcile with the official DoD Assessment Methodology before formal submission.</p>`));
  if (sec.status) pages.push(page(`<h2>Requirement status</h2>${chartRow(svgDonutStr(statusSegs, { centerTop: `${c.scorePct}%`, centerBottom: "readiness" }), legendStr(statusSegs))}${tbl(["Status", "Count", "Share"],
    [["Compliant (Yes)", c.yes, `${Math.round(c.yes / 110 * 100)}%`], ["Partially", c.partial, `${Math.round(c.partial / 110 * 100)}%`], ["Not compliant (No)", c.no, `${Math.round(c.no / 110 * 100)}%`], ["Not applicable", c.na, `${Math.round(c.na / 110 * 100)}%`], ["Not answered", c.notAnswered, `${Math.round(c.notAnswered / 110 * 100)}%`]])}`));
  if (sec.families) pages.push(page(`<h2>Progress by control family</h2>${tbl(["Family", "Compliant", "Progress"],
    fam.map((r) => [`${r.f.code} ${r.f.name}`, `${r.yes}/${r.total}`, bar(r.yes, r.total, "#10b981")]))}`));
  if (sec.poam) pages.push(page(`<h2>Open POA&amp;M items (${openPoam.length})</h2>${tbl(["Title", "Control", "Priority", "Status"],
    openPoam.map((a) => [esc(a.title), a.controlId || "—", a.priority, a.status]))}`));
  if (sec.risks) pages.push(page(`<h2>Risk register (${d.risks.length})</h2>
    ${chartRow(svgDonutStr(riskSegs, { centerTop: d.risks.length, centerBottom: "risks" }), legendStr(riskSegs))}
    <div style="margin:6px 0 4px;font-size:12px;color:#71717a">Likelihood × impact heat map</div>${heat()}
    ${tbl(["Risk", "Category", "L×I", "Rating", "Status", "Plan"],
    d.risks.map((r) => { const s = r.likelihood * r.impact; return [esc(r.title), r.category, `${r.likelihood}×${r.impact}=${s}`, RISK_LEVELS[scoreToLevel(s)].label, r.status, r.treatment]; }))}`));
  if (sec.vendors) pages.push(page(`<h2>Vendor risk (${d.vendors.length})</h2>${chartRow(svgDonutStr(vendSegs, { centerTop: d.vendors.length, centerBottom: "vendors" }), legendStr(vendSegs))}${tbl(["Vendor", "Tier", "Status", "Overall risk"],
    d.vendors.map((v) => [esc(v.name), v.tier, v.status, RISK_LEVELS[vendorLevel(v)].label]))}`));
  if (sec.assets) pages.push(page(`<h2>Asset inventory (${d.assets.length})</h2>${tbl(["Asset", "Type", "Classification", "Criticality"],
    d.assets.map((a) => [esc(a.name), esc(a.type), a.classification, a.criticality]))}`));
  if (sec.people) pages.push(page(`<h2>Workforce (${d.people.length})</h2>${tbl(["Name", "Role", "Department", "Training"],
    d.people.map((p) => [esc(p.name), esc(p.role), esc(p.department), p.training]))}`));
  if (sec.documents) { const byType = (t) => d.documents.filter((x) => x.type === t); pages.push(page(`<h2>Document register</h2>${tbl(["Type", "Total", "Published/Approved"],
    [["Policies", byType("policy").length, byType("policy").filter((x) => ["Published", "Approved"].includes(x.status)).length], ["Procedures", byType("procedure").length, byType("procedure").filter((x) => ["Published", "Approved"].includes(x.status)).length], ["Governance", byType("governance").length, byType("governance").filter((x) => ["Published", "Approved"].includes(x.status)).length]])}`)); }
  if (sec.audits) pages.push(page(`<h2>Audits (${d.audits.length})</h2>${tbl(["Name", "Type", "Status", "Result"],
    d.audits.map((a) => [esc(a.name), a.type, a.status, a.result]))}`));

  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(o.title || "Executive Report")}</title><style>
body{font-family:system-ui,Segoe UI,Arial,sans-serif;color:#18181b;margin:0;background:#fff}
.page{padding:40px 48px;max-width:820px;margin:0 auto;box-sizing:border-box;border-bottom:1px solid #f0f0f0}
h1{font-size:28px;margin:12px 0 4px}h2{font-size:16px;color:#3730a3;border-bottom:2px solid #6366f1;padding-bottom:5px;margin:0 0 12px}
table{border-collapse:collapse;width:100%;font-size:12px;margin-top:4px}th,td{border:1px solid #e4e4e7;padding:6px 8px;text-align:left;vertical-align:middle}th{background:#f4f4f5}
.muted{color:#71717a;font-size:13px;margin:2px 0}.logo{width:52px;height:52px;border-radius:10px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px}
.cover{min-height:70vh;display:flex;flex-direction:column;justify-content:center}
.kpi{display:inline-block;margin:0 10px 8px 0;padding:10px 14px;border:1px solid #e4e4e7;border-radius:8px;font-size:11px;color:#71717a}.kpi b{font-size:20px;color:#18181b}
@media print{.page{page-break-after:always;border:0;padding:0}@page{margin:22mm}}
</style></head><body>${pages.join("")}</body></html>`;
}
const answerLabel = (assessment, id) => { const s = assessment[id]?.status; return s ? STATUS[s].label : "Not Answered"; };

const REPORT_TYPES = [
  {
    id: "exec", name: "Executive Report", category: "Overview", ext: "html", configurable: true,
    description: "Multipage leadership report — configurable sections, logo, Word/PDF.",
    build: (d) => buildExecReport(d),
  },
  {
    id: "framework", name: "Framework Compliance Report", category: "Frameworks", ext: "csv",
    description: "All 110 CMMC L2 controls with current status.",
    build: (d) => toCSV([["Control", "Family", "Requirement", "SPRS weight", "Answer"],
    ...CONTROLS.map((c) => [c.id, FAMILY_BY_KEY[c.family].name, c.title, weightOf(c.id), answerLabel(d.assessment, c.id)])]),
  },
  {
    id: "gap", name: "Gap Report", category: "Frameworks", ext: "csv",
    description: "Controls not yet compliant, with SPRS points at stake.",
    build: (d) => toCSV([["Control", "Requirement", "Answer", "SPRS weight", "Points at risk"],
    ...CONTROLS.filter((c) => { const s = d.assessment[c.id]?.status; return s !== "yes" && s !== "na"; })
      .map((c) => [c.id, c.title, answerLabel(d.assessment, c.id), weightOf(c.id), deduction(d.assessment[c.id]?.status, c.id)])]),
  },
  {
    id: "poam", name: "POA&M Report", category: "Frameworks", ext: "csv",
    description: "Plan of action & milestones export.",
    build: (d) => toCSV([["Title", "Control", "Priority", "Status", "Description", "Corrective action"],
    ...d.actions.map((a) => [a.title, a.controlId || "", a.priority, a.status, a.description || "", a.correctiveAction || ""])]),
  },
  {
    id: "evidence", name: "Evidence Report", category: "Monitoring", ext: "csv",
    description: "Evidence items and their control mappings.",
    build: (d) => toCSV([["Name", "Status", "Due on", "Owner", "Assigned", "Program", "Controls", "Objective"],
    ...d.evidence.map((e) => [e.name, e.status || "", e.dueOn || "", e.owner || "", e.assigned || "", e.program || "", (e.controlIds || []).join("; "), e.objective || ""])]),
  },
  {
    id: "risks", name: "Risk Register Report", category: "Risk", ext: "csv",
    description: "Full risk register with ratings.",
    build: (d) => toCSV([["Title", "Category", "Likelihood", "Impact", "Score", "Rating", "Status", "Treatment", "Owner"],
    ...d.risks.map((r) => { const sc = r.likelihood * r.impact; return [r.title, r.category, r.likelihood, r.impact, sc, RISK_LEVELS[scoreToLevel(sc)].label, r.status, r.treatment, r.owner || ""]; })]),
  },
  {
    id: "vendors", name: "Vendor Risk Report", category: "Risk", ext: "csv",
    description: "Vendors, tiers, and overall risk.",
    build: (d) => toCSV([["Vendor", "Tier", "Status", "Overall risk", ...VENDOR_AREAS],
    ...d.vendors.map((v) => [v.name, v.tier, v.status, RISK_LEVELS[vendorLevel(v)].label, ...VENDOR_AREAS.map((a) => RISK_LEVELS[v.areas?.[a] || "low"].label)])]),
  },
  {
    id: "assets", name: "Asset Inventory", category: "Risk", ext: "csv",
    description: "Asset inventory export.",
    build: (d) => toCSV([["Name", "Type", "Owner", "Classification", "Criticality", "Environment"],
    ...d.assets.map((a) => [a.name, a.type, a.owner, a.classification, a.criticality, a.environment])]),
  },
  {
    id: "people", name: "Employee Roster", category: "People", ext: "csv",
    description: "Workforce roster and training status.",
    build: (d) => toCSV([["Name", "Email", "Role", "Department", "Manager", "Status", "Training", "Start date"],
    ...d.people.map((p) => [p.name, p.email, p.role, p.department, p.manager, p.status, p.training, p.startDate])]),
  },
  {
    id: "documents", name: "Document Register", category: "Documents", ext: "csv",
    description: "Policies, procedures, and governance docs.",
    build: (d) => toCSV([["Document", "Type", "Owner", "Status", "Classification", "Review date", "Objectives", "Tags"],
    ...d.documents.map((x) => [x.name, x.type, x.owner, x.status, x.classification, x.reviewDate, (x.objectives || []).length, (x.tags || []).join("; ")])]),
  },
  {
    id: "audits", name: "Audit Report", category: "Audits", ext: "csv",
    description: "Audit records and results.",
    build: (d) => toCSV([["Name", "Type", "Scope", "Status", "Result", "Lead", "Assessor", "Target date"],
    ...d.audits.map((a) => [a.name, a.type, a.scopeName, a.status, a.result, a.lead || "", a.assessor || "", a.dueDate || ""])]),
  },
];
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly"];
const nextRunDate = (freq) => { const d = new Date(); const add = { Daily: 1, Weekly: 7, Monthly: 30, Quarterly: 90 }[freq] || 7; d.setDate(d.getDate() + add); return d.toISOString(); };

function Reports({ data, generated, setGenerated, scheduled, setScheduled }) {
  const [emailFor, setEmailFor] = useState(null);
  const [schedFor, setSchedFor] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [configFor, setConfigFor] = useState(null);

  const generateExec = (t, opts, format) => {
    const html = buildExecReport(data, opts);
    const ext = format === "word" ? "doc" : format === "pdf" ? "pdf" : "html";
    const rec = { id: crypto.randomUUID(), name: opts.title || t.name, ext: "html", content: html, date: new Date().toISOString(), delivery: format === "word" ? "Downloaded (Word)" : format === "pdf" ? "Printed to PDF" : "Viewed" };
    setGenerated((p) => [rec, ...p]);
    if (format === "word") triggerDownload(`${slug(rec.name)}.doc`, html, "doc");
    else if (format === "pdf") printHTML(html);
    else setViewer(rec);
    setConfigFor(null);
  };

  const doView = (t) => {
    const content = t.build(data);
    const rec = { id: crypto.randomUUID(), name: t.name, ext: t.ext, content, date: new Date().toISOString(), delivery: "Viewed" };
    setGenerated((p) => [rec, ...p]);
    setViewer(rec);
  };
  const doEmail = (t, recipient) => {
    const content = t.build(data);
    setGenerated((p) => [{ id: crypto.randomUUID(), name: t.name, ext: t.ext, content, date: new Date().toISOString(), delivery: `Emailed to ${recipient}` }, ...p]);
  };
  const doSchedule = (t, freq, recipient) => {
    setScheduled((p) => [...p, { id: crypto.randomUUID(), typeId: t.id, name: t.name, frequency: freq, recipient, enabled: true, nextRun: nextRunDate(freq) }]);
  };
  const runNow = (s) => { const t = REPORT_TYPES.find((x) => x.id === s.typeId); if (!t) return; doView(t); };

  const cats = [...new Set(REPORT_TYPES.map((t) => t.category))];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-sm text-zinc-500">Generate, download, email, and schedule reports across your whole program.</p>
      </header>

      {cats.map((cat) => (
        <Card key={cat} title={cat}>
          <div className="grid gap-3 lg:grid-cols-2">
            {REPORT_TYPES.filter((t) => t.category === cat).map((t) => (
              <div key={t.id} className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-800">{t.name}</div>
                    <div className="text-xs text-zinc-400">{t.description} · .{t.ext}</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {t.configurable
                    ? <button onClick={() => setConfigFor(t)} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"><FileBarChart size={13} /> Configure &amp; generate</button>
                    : <button onClick={() => doView(t)} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"><FileBarChart size={13} /> View report</button>}
                  <button onClick={() => setEmailFor(t)} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"><Mail size={13} /> Email</button>
                  <button onClick={() => setSchedFor(t)} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"><CalendarClock size={13} /> Schedule</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card title={`Generated reports (${generated.length})`}>
        {generated.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">No reports generated yet.</div>
        ) : (
          <div className="space-y-2">
            {generated.map((g) => (
              <div key={g.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <FileBarChart size={16} className="text-indigo-500" />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-zinc-800">{g.name}</div><div className="text-xs text-zinc-400">{new Date(g.date).toLocaleString()} · {g.delivery}</div></div>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">{g.ext}</span>
                <button onClick={() => setViewer(g)} className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50">View</button>
                <button onClick={() => setGenerated((p) => p.filter((x) => x.id !== g.id))} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={`Scheduled reports (${scheduled.length})`}>
        {scheduled.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-400">No scheduled reports. Use Schedule on any report above.</div>
        ) : (
          <div className="space-y-2">
            {scheduled.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <CalendarClock size={16} className="text-indigo-500" />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-zinc-800">{s.name}</div><div className="text-xs text-zinc-400">{s.frequency} · to {s.recipient} · next {new Date(s.nextRun).toLocaleDateString()}</div></div>
                <button onClick={() => runNow(s)} className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">Run now</button>
                <button onClick={() => setScheduled((p) => p.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)))} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${s.enabled ? "bg-emerald-50 text-emerald-700" : "border border-zinc-200 text-zinc-500"}`}>{s.enabled ? "Enabled" : "Paused"}</button>
                <button onClick={() => setScheduled((p) => p.filter((x) => x.id !== s.id))} className="text-zinc-300 hover:text-rose-500"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {emailFor && <EmailReportModal report={emailFor} onClose={() => setEmailFor(null)} onSend={(to) => { doEmail(emailFor, to); setEmailFor(null); }} />}
      {schedFor && <ScheduleReportModal report={schedFor} onClose={() => setSchedFor(null)} onSave={(freq, to) => { doSchedule(schedFor, freq, to); setSchedFor(null); }} />}
      {viewer && <ReportViewerModal report={viewer} onClose={() => setViewer(null)} />}
      {configFor && <ReportConfigModal report={configFor} orgName={data.orgName} onClose={() => setConfigFor(null)} onGenerate={(opts, format) => generateExec(configFor, opts, format)} />}
    </div>
  );
}

function ReportViewerModal({ report, onClose }) {
  const isHtml = report.ext === "html" || report.ext === "doc" || report.ext === "pdf" || /^\s*</.test(report.content || "");
  return (
    <ModalShell title={report.name} onClose={onClose}>
      <div className="mb-2 text-xs text-zinc-400">Generated {new Date(report.date).toLocaleString()} · {report.delivery}</div>
      {isHtml
        ? <iframe title={report.name} srcDoc={report.content} className="h-[28rem] w-full rounded-lg border border-zinc-200 bg-white" />
        : <pre className="max-h-96 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700" style={{ whiteSpace: "pre-wrap" }}>{report.content}</pre>}
      <div className="mt-4 flex justify-end"><button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Close</button></div>
    </ModalShell>
  );
}

function ReportConfigModal({ report, orgName, onClose, onGenerate }) {
  const [title, setTitle] = useState(defaultExecOpts().title);
  const [preparedFor, setPreparedFor] = useState("");
  const [logo, setLogo] = useState(true);
  const [sections, setSections] = useState(() => Object.fromEntries(EXEC_SECTIONS.map(([k]) => [k, true])));
  const toggle = (k) => setSections((p) => ({ ...p, [k]: !p[k] }));
  const opts = () => ({ title, preparedFor, logo, sections });
  return (
    <ModalShell title="Configure report" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-600">Report title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
      <label className="mt-3 block text-xs font-medium text-zinc-600">Prepared for (optional)</label>
      <input value={preparedFor} onChange={(e) => setPreparedFor(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="Client, auditor, or leadership" />

      <label className="mt-4 flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" checked={logo} onChange={(e) => setLogo(e.target.checked)} className="accent-indigo-600" />
        Include logo on cover {logo && orgName ? <span className="text-xs text-zinc-400">(monogram from “{orgName}”)</span> : null}
      </label>

      <div className="mt-4 text-xs font-medium text-zinc-600">Sections to include</div>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {EXEC_SECTIONS.map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 rounded-lg border border-zinc-100 px-2.5 py-1.5 text-sm text-zinc-700">
            <input type="checkbox" checked={!!sections[k]} onChange={() => toggle(k)} className="accent-indigo-600" />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button onClick={() => onGenerate(opts(), "view")} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><FileBarChart size={14} /> View</button>
        <button onClick={() => onGenerate(opts(), "word")} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Download size={14} /> Word (.doc)</button>
        <button onClick={() => onGenerate(opts(), "pdf")} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Download size={14} /> PDF</button>
      </div>
      <p className="mt-2 text-[11px] text-zinc-400">PDF opens your browser's print dialog — choose “Save as PDF”. Word downloads a document you can open and edit.</p>
    </ModalShell>
  );
}

function EmailReportModal({ report, onClose, onSend }) {
  const [to, setTo] = useState("");
  return (
    <ModalShell title={`Email · ${report.name}`} onClose={onClose}>
      <p className="mb-3 text-xs text-zinc-500">Send a copy of this report. (Delivery is simulated in this baseline and logged under generated reports.)</p>
      <label className="block text-xs font-medium text-zinc-600">Recipient email</label>
      <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="name@company.com" />
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!to.trim()} onClick={() => onSend(to.trim())} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Send</button>
      </div>
    </ModalShell>
  );
}
function ScheduleReportModal({ report, onClose, onSave }) {
  const [freq, setFreq] = useState("Weekly");
  const [to, setTo] = useState("");
  return (
    <ModalShell title={`Schedule · ${report.name}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-zinc-600">Frequency</label>
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm outline-none">{FREQUENCIES.map((f) => <option key={f}>{f}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-zinc-600">Deliver to</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="name@company.com" /></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
        <button disabled={!to.trim()} onClick={() => onSave(freq, to.trim())} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">Schedule</button>
      </div>
    </ModalShell>
  );
}

/* ================================================================== */
/*  HOME & SETTINGS                                                    */
/* ================================================================== */

function HomePage({ orgName, sprs, overall, stats, onGoto }) {
  const band = sprs >= 110 ? { t: "Meets Level 2", c: "#059669" } : sprs >= 88 ? { t: "Conditional Level 2", c: "#d97706" } : { t: "In progress", c: "#e11d48" };
  const tiles = [
    { label: "Controls", metric: `${overall.total - overall.notAnswered}/110`, sub: "answered", view: "controls", Icon: ListChecks },
    { label: "POA&M", metric: stats.openActions, sub: "open items", view: "poam", Icon: ClipboardList },
    { label: "Risks", metric: stats.risks, sub: "tracked", view: "risks:register", Icon: ShieldAlert },
    { label: "Vendors", metric: stats.vendors, sub: "vendors", view: "risks:vendors", Icon: Building2 },
    { label: "Documents", metric: stats.documents, sub: "policies & more", view: "documents:policies", Icon: FileText },
    { label: "Evidence", metric: stats.evidence, sub: "artifacts", view: "monitoring:evidence", Icon: FolderOpen },
    { label: "Audits", metric: stats.audits, sub: "audits", view: "audits", Icon: Gavel },
    { label: "Trust requests", metric: stats.pendingTrust, sub: "pending", view: "trust", Icon: ShieldCheck },
  ];
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Welcome{orgName ? `, ${orgName}` : ""}</h1>
        <p className="text-sm text-zinc-500">Your CMMC Level 2 program at a glance.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 self-start text-sm font-medium text-zinc-700">SPRS score</div>
          <SprsGauge score={sprs} />
        </div>
        <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 self-start text-sm font-medium text-zinc-700">Assessment readiness</div>
          <ProgressRing pct={overall.scorePct} hex={band.c} bottom="readiness" />
          <div className="mt-2 text-sm font-semibold" style={{ color: band.c }}>{band.t}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 text-sm font-medium text-zinc-700">Quick actions</div>
          <div className="space-y-2">
            <button onClick={() => onGoto("controls")} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50">Answer control questions →</button>
            <button onClick={() => onGoto("monitoring:evidence")} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50">Add evidence →</button>
            <button onClick={() => onGoto("audits")} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50">Start an audit →</button>
            <button onClick={() => onGoto("reports")} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50">Generate a report →</button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-zinc-700">Across your program</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((t) => (
            <button key={t.label} onClick={() => onGoto(t.view)} className="rounded-xl border border-zinc-200 bg-white p-4 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
              <t.Icon size={18} className="text-indigo-500" />
              <div className="mt-2 font-mono text-xl font-semibold text-zinc-800">{t.metric}</div>
              <div className="text-sm font-medium text-zinc-700">{t.label}</div>
              <div className="text-xs text-zinc-400">{t.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ settings, setSettings, onExport, onImport, onReset, onLoadDemo }) {
  const [msg, setMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);
  const up = (k, v) => setSettings((p) => ({ ...p, [k]: v }));
  const inputCls = "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { onImport(JSON.parse(String(r.result))); setMsg("Workspace imported."); } catch { setMsg("That file couldn't be read as a workspace export."); } e.target.value = ""; };
    r.readAsText(f);
  };
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-zinc-500">Workspace profile, program details, and data management.</p>
      </header>

      <Card title="Organization profile">
        <div className="grid gap-3 sm:grid-cols-3">
          <div><label className="block text-xs font-medium text-zinc-600">Organization name</label><input value={settings.orgName} onChange={(e) => up("orgName", e.target.value)} className={inputCls} placeholder="Acme Defense LLC" /></div>
          <div><label className="block text-xs font-medium text-zinc-600">Compliance point of contact</label><input value={settings.poc} onChange={(e) => up("poc", e.target.value)} className={inputCls} /></div>
          <div><label className="block text-xs font-medium text-zinc-600">Target assessment date</label><input type="date" value={settings.targetDate} onChange={(e) => up("targetDate", e.target.value)} className={inputCls} /></div>
        </div>
      </Card>

      <Card title="Program">
        <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between border-b border-zinc-100 py-1"><dt className="text-zinc-500">Framework</dt><dd className="font-medium text-zinc-800">CMMC Level 2</dd></div>
          <div className="flex justify-between border-b border-zinc-100 py-1"><dt className="text-zinc-500">Standard</dt><dd className="font-medium text-zinc-800">NIST SP 800-171 Rev 2</dd></div>
          <div className="flex justify-between border-b border-zinc-100 py-1"><dt className="text-zinc-500">Controls</dt><dd className="font-medium text-zinc-800">110 across 14 families</dd></div>
          <div className="flex justify-between border-b border-zinc-100 py-1"><dt className="text-zinc-500">Scoring</dt><dd className="font-medium text-zinc-800">SPRS methodology (estimate)</dd></div>
        </dl>
        <p className="mt-2 flex items-center gap-1 text-[11px] text-zinc-400"><Info size={11} /> SPRS point weights are pre-populated estimates; reconcile with the official DoD Assessment Methodology template before formal use.</p>
      </Card>

      <Card title="Data management">
        <p className="text-sm text-zinc-500">Everything you enter is stored in this workspace. Back it up, restore it, or start over.</p>
        {msg && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</div>}
        <div className="mt-3 flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".json" onChange={onFile} className="hidden" />
          <button onClick={onExport} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Download size={15} /> Export workspace (JSON)</button>
          <button onClick={() => { fileRef.current?.click(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"><Upload size={15} /> Import workspace</button>
          <button onClick={() => { onLoadDemo(); setMsg("Demo data loaded."); }} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"><Boxes size={15} /> Load demo data</button>
          <button onClick={() => { if (confirmReset) { onReset(); setConfirmReset(false); setMsg("Workspace reset."); } else { setConfirmReset(true); } }} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"><RotateCcw size={15} /> {confirmReset ? "Click again to confirm reset" : "Reset workspace"}</button>
        </div>
      </Card>

      <Card title="About">
        <div className="text-sm text-zinc-600">Rampart — CMMC Level 2 compliance console.</div>
        <div className="text-xs text-zinc-400">Baseline build · manual data entry · automation layer not yet enabled.</div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MODAL SHELL                                                         */
/* ------------------------------------------------------------------ */

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

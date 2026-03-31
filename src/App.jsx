import { useState } from "react";

// ============================================================
// DATA
// ============================================================

const ROLE = {
  title: "Senior Backend Engineer",
  team: "Platform Team",
  location: "Remote (EU)",
};

const SIGNALS = [
  { id: "s1", label: "Systems", full: "Can design and own complex systems independently" },
  { id: "s2", label: "Team", full: "Will elevate the team's technical standards" },
  { id: "s3", label: "Comms", full: "Clear, async-first communicator" },
  { id: "s4", label: "Motivation", full: "Genuinely motivated by the problem space" },
  { id: "s5", label: "Comp", full: "Compensation expectations are alignable" },
];

const STAGES = ["Application Review", "Technical Screen", "Take-home", "Final Interview"];

const CANDIDATES = [
  {
    id: "maria",
    name: "Maria Chen",
    initials: "MC",
    color: "#4f46e5",
    role: "Staff Engineer at Dataflow",
    source: "Referred by Sarah Kim (your tech lead)",
    stage: 1,
    daysInProcess: 12,
    urgency: { label: "Competing offers", level: "high" },
    decisionStatus: "almost",
    decisionLabel: "Almost ready — 1 signal missing before offer",
    signals: {
      s1: {
        status: "strong",
        items: [
          "Led payment system migration to event-driven microservices at Dataflow (team of 8)",
          "OSS project 'routekit' (2.3k GitHub stars) — clean distributed system design",
        ],
      },
      s2: {
        status: "strong",
        items: [
          "Mentored 3 junior engineers into mid-level promotions",
          "Conference speaker — 'Designing for Failure' at GotoCon 2025",
        ],
      },
      s3: {
        status: "strong",
        items: [
          "Technical blog (15k monthly readers) — clear, structured, opinionated writing",
          "Referrer: 'Best async communicator I've worked with'",
        ],
      },
      s4: {
        status: "strong",
        items: [
          "Cover letter references specific scaling challenges from your engineering blog",
          "Asked detailed product questions about multi-tenancy in initial call",
        ],
      },
      s5: {
        status: "none",
        items: [],
        nextAction: "Schedule a 15-min comp call this week. She's fielding competing offers — this is the only thing between you and an offer.",
        urgency: "high",
      },
    },
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    color: "#059669",
    role: "Backend Engineer at Quill",
    source: "Applied via careers page",
    stage: 0,
    daysInProcess: 8,
    urgency: { label: "Applied broadly", level: "medium" },
    decisionStatus: "partial",
    decisionLabel: "Strong signal — 2 gaps to close before she's decidable",
    signals: {
      s1: {
        status: "strong",
        items: [
          "Published 'Scaling Write-Heavy Systems' — practical, production-tested",
          "Built a distributed task queue handling 50k jobs/min (GitHub)",
        ],
      },
      s2: {
        status: "strong",
        items: [
          "Runs engineering blog (8k subscribers), organises backend meetup",
        ],
      },
      s3: {
        status: "strong",
        items: [
          "Application answers are exceptionally clear and well-reasoned",
        ],
      },
      s4: {
        status: "none",
        items: [],
        nextAction: "She applied broadly — have an informal call to find out if this is a top choice before investing more.",
        urgency: "medium",
      },
      s5: {
        status: "none",
        items: [],
        nextAction: "Discuss comp expectations early. Don't run 3 more stages then discover you're misaligned.",
        urgency: "medium",
      },
    },
  },
  {
    id: "tom",
    name: "Tom Baker",
    initials: "TB",
    color: "#d97706",
    role: "Developer at FreshBooks",
    source: "Recruiter outreach",
    stage: 2,
    daysInProcess: 18,
    urgency: { label: "Passive — sourced", level: "low" },
    decisionStatus: "weak",
    decisionLabel: "Insufficient signal — 18 days in, only 1 of 5 areas covered",
    signals: {
      s1: {
        status: "some",
        items: [
          "Take-home submitted — reviewer hasn't looked at it yet",
        ],
        nextAction: "Review take-home today. 18 days in and this is your only technical signal.",
        urgency: "medium",
      },
      s2: {
        status: "none",
        items: [],
        nextAction: "No data. Ask about team contributions in next conversation.",
        urgency: "low",
      },
      s3: {
        status: "none",
        items: [],
        nextAction: "Only had brief scheduling interactions. No real communication sample.",
        urgency: "low",
      },
      s4: {
        status: "none",
        items: [],
        nextAction: "He was sourced, not inbound. Does he actually want this role?",
        urgency: "medium",
      },
      s5: {
        status: "strong",
        items: [
          "Discussed in recruiter screen — expects £75-85k, within budget",
        ],
      },
    },
  },
  {
    id: "james",
    name: "James Wilson",
    initials: "JW",
    color: "#dc2626",
    role: "Senior Developer at Cobalt",
    source: "Applied via LinkedIn",
    stage: 3,
    daysInProcess: 24,
    urgency: { label: "Active — day 24", level: "medium" },
    decisionStatus: "danger",
    decisionLabel: "Do not proceed to offer — critical gaps in technical signal",
    signals: {
      s1: {
        status: "none",
        items: [],
        nextAction: "No one has tested his system design ability. Run a technical deep-dive before any offer conversation.",
        urgency: "high",
      },
      s2: {
        status: "none",
        items: [],
        nextAction: "Zero signal on team elevation. Ask for concrete mentoring examples.",
        urgency: "high",
      },
      s3: {
        status: "strong",
        items: [
          "Articulate and confident in all interviews — clear communicator",
          "Interviewer: 'Great presence, easy to talk to'",
        ],
      },
      s4: {
        status: "some",
        items: [
          "Said 'I love the mission' but couldn't name specifics",
        ],
        nextAction: "Generic enthusiasm isn't signal. Dig deeper before proceeding.",
        urgency: "medium",
      },
      s5: {
        status: "strong",
        items: [
          "Expects £85-95k, within budget",
        ],
      },
    },
  },
];

// ============================================================
// HELPERS
// ============================================================

const getStrong = (c) => SIGNALS.filter(s => c.signals[s.id].status === "strong").length;
const getTotal = () => SIGNALS.length;

const sortedCandidates = [...CANDIDATES].sort((a, b) => getStrong(b) - getStrong(a));

const getRankLabel = (index) => {
  switch (index) {
    case 0: return { text: "Nearest to offer", color: "#166534", bg: "#dcfce7" };
    case 1: return { text: "Strong — 2 gaps", color: "#1e40af", bg: "#dbeafe" };
    default: return { text: "Significant gaps", color: "#64748b", bg: "#f1f5f9" };
  }
};

const urgencyTagStyles = {
  high: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  medium: { color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  low: { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

const getStatusColor = (status) => {
  switch (status) {
    case "strong": return { bg: "#dcfce7", border: "#86efac", text: "#166534" };
    case "some": return { bg: "#fef9c3", border: "#fde047", text: "#854d0e" };
    default: return { bg: "#f1f5f9", border: "#e2e8f0", text: "#64748b" };
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "strong": return "Strong";
    case "some": return "Some";
    default: return "None";
  }
};

const decisionStyles = {
  almost: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
  partial: { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  weak: { bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
  danger: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
};

// ============================================================
// COMPONENTS
// ============================================================

// ---------- Pipeline View ----------

const PipelineView = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {STAGES.map((stage, si) => {
        const sc = CANDIDATES.filter(c => c.stage === si);
        return (
          <div key={stage}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 12, padding: "0 4px",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                {stage}
              </span>
              <span style={{
                fontSize: 11, color: "#94a3b8", fontWeight: 600,
                backgroundColor: "#f1f5f9", borderRadius: 10, padding: "2px 8px",
              }}>{sc.length}</span>
            </div>
            <div style={{
              backgroundColor: "#f8fafc", borderRadius: 12, padding: 8,
              minHeight: 180, border: "1px solid #f1f5f9",
            }}>
              {sc.map(c => (
                <div key={c.id} style={{
                  backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 8,
                  border: "1px solid #e8ecf1",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", backgroundColor: c.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>{c.initials}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Day {c.daysInProcess} · {c.source.split("(")[0].trim()}
                  </div>
                </div>
              ))}
              {sc.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>No candidates</div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    <div style={{
      marginTop: 24, padding: "14px 18px", borderRadius: 10,
      backgroundColor: "#fffbeb", border: "1px solid #fde68a",
      fontSize: 13, color: "#92400e", lineHeight: 1.6,
    }}>
      <span style={{ fontWeight: 700 }}>This view can't tell you who to hire.</span>{" "}
      Four candidates in four different stages — but which one are you closest to making an offer to?
      Which one has dangerous gaps? What's the single most valuable thing you could do right now to fill this role?
      {" "}Switch to <span style={{ fontWeight: 700 }}>Readiness View</span> to find out.
    </div>
  </div>
);

// ---------- Signal / Pipeline Comparison Bars ----------

const ComparisonBars = ({ candidate }) => {
  const strong = getStrong(candidate);
  const total = getTotal();
  const signalPct = (strong / total) * 100;
  const stagePct = ((candidate.stage + 1) / STAGES.length) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em", minWidth: 50 }}>
          Signal
        </span>
        <div style={{ flex: 1, height: 8, backgroundColor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${signalPct}%`, height: "100%", borderRadius: 4,
            backgroundColor: signalPct >= 80 ? "#22c55e" : signalPct >= 40 ? "#eab308" : "#ef4444",
            transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", minWidth: 28, textAlign: "right" }}>
          {strong}/{total}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#c4c9d2", textTransform: "uppercase", letterSpacing: "0.04em", minWidth: 50 }}>
          Pipeline
        </span>
        <div style={{ flex: 1, height: 5, backgroundColor: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${stagePct}%`, height: "100%", borderRadius: 3,
            backgroundColor: "#cbd5e1", transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 28, textAlign: "right" }}>
          {candidate.stage + 1}/{STAGES.length}
        </span>
      </div>
    </div>
  );
};

// ---------- Path to Hire — with skipped stages ----------

const PathToHire = () => {
  const lead = sortedCandidates[0];
  const backup = sortedCandidates[1];
  const strong = getStrong(lead);
  const total = getTotal();
  const gaps = SIGNALS.filter(s => lead.signals[s.id].status !== "strong");

  // Determine which stages Maria would still need in a pipeline
  const currentStage = lead.stage; // 0-indexed, she's in stage 1 (Technical Screen)
  const remainingStages = STAGES.slice(currentStage + 1); // stages she hasn't done yet

  // Find the highest-urgency gap's next action
  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  const sortedGaps = [...gaps].sort((a, b) => {
    const aUrg = lead.signals[a.id].urgency || "low";
    const bUrg = lead.signals[b.id].urgency || "low";
    return urgencyOrder[aUrg] - urgencyOrder[bUrg];
  });
  const topGap = sortedGaps[0];
  const topAction = topGap ? lead.signals[topGap.id].nextAction : "All signals strong. Ready to extend offer.";

  return (
    <div style={{
      margin: "0 0 8px 0", padding: "18px 20px",
      backgroundColor: "#f0fdf4", borderRadius: 12, border: "1px solid #86efac",
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#166534", textTransform: "uppercase",
        letterSpacing: "0.05em", marginBottom: 10,
      }}>
        Path to hire
      </div>

      {/* Lead candidate */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", backgroundColor: lead.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>{lead.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>{lead.name}</span> — {strong} of {total} signals strong.
            {gaps.length === 1
              ? " One step to offer:"
              : ` ${gaps.length} steps to offer. Most urgent:`
            }
          </div>

          {/* The action */}
          <div style={{
            marginTop: 8, padding: "8px 12px", borderRadius: 6,
            backgroundColor: "#ffffff", border: "1px solid #86efac",
            fontSize: 13, color: "#1e293b", lineHeight: 1.5,
          }}>
            <span style={{ fontWeight: 700, color: "#166534" }}>→ {topGap ? topGap.label : "Offer"}:</span> {topAction}
          </div>

          {/* Skipped stages — the revolutionary moment */}
          {remainingStages.length > 0 && (
            <div style={{
              marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Skip:</span>
              {remainingStages.map((stage, i) => (
                <span key={i} style={{
                  fontSize: 11.5, fontWeight: 600, color: "#94a3b8",
                  textDecoration: "line-through",
                  backgroundColor: "#f1f5f9", padding: "3px 10px", borderRadius: 4,
                  border: "1px solid #e2e8f0",
                }}>
                  {stage}
                </span>
              ))}
              <span style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>
                — signal already exists
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Backup candidate — one line */}
      <div style={{
        paddingTop: 12, borderTop: "1px solid #bbf7d0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", backgroundColor: backup.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0,
        }}>{backup.initials}</div>
        <span style={{ fontSize: 12.5, color: "#475569" }}>
          <span style={{ fontWeight: 600 }}>Backup: {backup.name}</span> — {getStrong(backup)}/{total} signals strong, {SIGNALS.filter(s => backup.signals[s.id].status !== "strong").length} gaps remaining.
          {backup.urgency.level === "medium" && (
            <span style={{ color: "#92400e" }}> {backup.urgency.label} — keep engaged.</span>
          )}
        </span>
      </div>
    </div>
  );
};

// ---------- Readiness View ----------

const ReadinessView = ({ expandedId, onToggle }) => (
  <div>
    <PathToHire />

    {/* Column headers */}
    <div style={{
      display: "grid", gridTemplateColumns: "1fr repeat(5, 80px) 32px",
      gap: 0, padding: "14px 20px 10px 20px", borderBottom: "1px solid #e8ecf1",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Ranked by nearest to decision
      </div>
      {SIGNALS.map(s => (
        <div key={s.id} style={{
          fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase",
          letterSpacing: "0.03em", textAlign: "center",
        }} title={s.full}>{s.label}</div>
      ))}
      <div />
    </div>

    {sortedCandidates.map((candidate, rankIndex) => {
      const isExpanded = expandedId === candidate.id;
      const rank = getRankLabel(rankIndex);
      const ut = urgencyTagStyles[candidate.urgency.level];

      return (
        <div key={candidate.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div
            onClick={() => onToggle(candidate.id)}
            style={{
              display: "grid", gridTemplateColumns: "1fr repeat(5, 80px) 32px",
              gap: 0, padding: "14px 20px", cursor: "pointer",
              backgroundColor: isExpanded ? "#fafbfd" : "transparent",
              transition: "background-color 0.15s ease", alignItems: "center",
            }}
            onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = "#fafbfd"; }}
            onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", backgroundColor: candidate.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{candidate.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{candidate.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: rank.color, backgroundColor: rank.bg,
                    padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.03em",
                  }}>{rank.text}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: ut.color, backgroundColor: ut.bg,
                    padding: "2px 8px", borderRadius: 4, border: `1px solid ${ut.border}`,
                  }}>{candidate.urgency.label}</span>
                  <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{candidate.role}</span>
                </div>
                <ComparisonBars candidate={candidate} />
              </div>
            </div>

            {SIGNALS.map(s => {
              const sig = candidate.signals[s.id];
              const colors = getStatusColor(sig.status);
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    backgroundColor: colors.bg, border: `2px solid ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {sig.status === "strong" && (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke={colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {sig.status === "some" && (
                      <div style={{ width: 8, height: 2, backgroundColor: colors.text, borderRadius: 1 }} />
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", justifyContent: "center", color: "#94a3b8" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Expanded detail */}
          {isExpanded && (
            <div style={{ padding: "0 20px 16px 70px", backgroundColor: "#fafbfd" }}>
              {/* Decision badge */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  padding: "8px 14px", borderRadius: 8,
                  backgroundColor: decisionStyles[candidate.decisionStatus].bg,
                  border: `1px solid ${decisionStyles[candidate.decisionStatus].border}`,
                  fontSize: 12.5, fontWeight: 600,
                  color: decisionStyles[candidate.decisionStatus].text, lineHeight: 1.4,
                }}>
                  {candidate.decisionLabel}
                </div>
              </div>

              {/* Gaps — full cards */}
              {SIGNALS.filter(s => candidate.signals[s.id].status !== "strong").length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase",
                    letterSpacing: "0.05em", marginBottom: 8,
                  }}>Gaps to close</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {SIGNALS.filter(s => candidate.signals[s.id].status !== "strong").map(s => {
                      const sig = candidate.signals[s.id];
                      const colors = getStatusColor(sig.status);
                      return (
                        <div key={s.id} style={{
                          backgroundColor: "#fff", borderRadius: 8, padding: "10px 14px",
                          border: `1px solid ${colors.border}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: sig.items.length > 0 || sig.nextAction ? 6 : 0 }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%",
                              backgroundColor: colors.bg, border: `2px solid ${colors.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              {sig.status === "some" && (
                                <div style={{ width: 5, height: 1.5, backgroundColor: colors.text, borderRadius: 1 }} />
                              )}
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>{s.label}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>{s.full}</span>
                            <span style={{
                              fontSize: 10, color: colors.text, backgroundColor: colors.bg,
                              padding: "1px 6px", borderRadius: 3, fontWeight: 600, marginLeft: "auto", flexShrink: 0,
                            }}>{getStatusLabel(sig.status)}</span>
                          </div>

                          {sig.items.map((item, i) => (
                            <div key={i} style={{ fontSize: 11.5, color: "#475569", lineHeight: 1.45, marginLeft: 22, marginBottom: 2 }}>
                              {item}
                            </div>
                          ))}

                          {sig.nextAction && (
                            <div style={{
                              marginTop: 4, marginLeft: 22,
                              padding: "6px 10px", borderRadius: 5,
                              backgroundColor: sig.urgency === "high" ? "#fef2f2" : "#fffbeb",
                              border: `1px solid ${sig.urgency === "high" ? "#fecaca" : "#fde68a"}`,
                              fontSize: 11.5,
                              color: sig.urgency === "high" ? "#991b1b" : "#92400e",
                              lineHeight: 1.4,
                            }}>
                              <span style={{ fontWeight: 700 }}>→</span> {sig.nextAction}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Strong signals — compressed */}
              {SIGNALS.filter(s => candidate.signals[s.id].status === "strong").length > 0 && (
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
                    letterSpacing: "0.05em", marginBottom: 6,
                  }}>Strong signal</div>
                  <div style={{
                    backgroundColor: "#fff", borderRadius: 8, padding: "8px 14px",
                    border: "1px solid #e8ecf1",
                    display: "flex", flexWrap: "wrap", gap: 6,
                  }}>
                    {SIGNALS.filter(s => candidate.signals[s.id].status === "strong").map(s => (
                      <div key={s.id} style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 6,
                        backgroundColor: "#dcfce7", border: "1px solid #86efac",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7L6 10L11 4" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ---------- Main App ----------

export default function App() {
  const [view, setView] = useState("pipeline");
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  const toggleCandidate = (id) => {
    setExpandedCandidate(prev => prev === id ? null : id);
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      minHeight: "100vh", backgroundColor: "#ffffff", color: "#1e293b",
    }}>
      <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #e8ecf1" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4,
            }}>{ROLE.team} · {ROLE.location} · 1 opening</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
              {ROLE.title}
            </h1>
          </div>

          <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: 10, padding: 3 }}>
            {[
              { key: "pipeline", label: "Pipeline View" },
              { key: "readiness", label: "Readiness View" },
            ].map(v => (
              <button
                key={v.key}
                onClick={() => { setView(v.key); setExpandedCandidate(null); }}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s ease",
                  backgroundColor: view === v.key ? "#ffffff" : "transparent",
                  color: view === v.key ? "#0f172a" : "#64748b",
                  boxShadow: view === v.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >{v.label}</button>
            ))}
          </div>
        </div>

        {view === "readiness" && (
          <p style={{ margin: "12px 0 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
            One role, one hire. Candidates ranked by who you're nearest to making a decision on — not by where they are in your process.
          </p>
        )}
      </div>

      <div style={{ padding: view === "pipeline" ? "24px 28px" : "16px 16px" }}>
        {view === "pipeline" && <PipelineView />}
        {view === "readiness" && (
          <ReadinessView expandedId={expandedCandidate} onToggle={toggleCandidate} />
        )}
      </div>
    </div>
  );
}

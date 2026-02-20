import { useState, useEffect, useCallback } from "react";

// ─── Theme (Navy tone) ───
const t = {
  bg: "#FAFBFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  accent: "#162550",
  accentLight: "#1E3368",
  accentGlow: "rgba(22,37,80,0.08)",
  heart: "#E53E5F",
  heartBg: "rgba(229,62,95,0.08)",
  green: "#0EA563",
  greenBg: "rgba(14,165,99,0.08)",
  orange: "#E6930A",
  orangeBg: "rgba(230,147,10,0.08)",
  red: "#DC3545",
  redBg: "rgba(220,53,69,0.08)",
  blue: "#2563EB",
  blueBg: "rgba(37,99,235,0.08)",
  text: "#1A1D23",
  sub: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  borderDark: "#D1D5DB",
  barFill: "#162550",
  barBg: "#E5E7EB",
};

const font = `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// ─── Steps Config ───
const STEPS = [
  { key: "basic", label: "기본 정보", icon: "building" },
  { key: "plan", label: "사업계획", icon: "chart" },
  { key: "value", label: "기업가치", icon: "bar" },
  { key: "invest", label: "투자 매력도", icon: "heart" },
];

// ─── Icons ───
function StepIcon({ type, active, size = 28 }) {
  const color = active ? (type === "heart" ? t.heart : t.accent) : t.muted;
  const bg = active ? (type === "heart" ? t.heartBg : t.accentGlow) : "transparent";
  return (
    <div style={{
      width: size + 16, height: size + 16, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s",
    }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {type === "building" && <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><path d="M9 18h6v4H9z"/></>}
        {type === "chart" && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>}
        {type === "bar" && <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
        {type === "heart" && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={active ? t.heart : "none"} stroke={color} />}
      </svg>
    </div>
  );
}

// ─── Step Navigation ───
function StepNav({ current, onStep }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 0 28px" }}>
      {STEPS.map((s, i) => (
        <div
          key={s.key}
          onClick={() => i <= current && onStep(i)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            cursor: i <= current ? "pointer" : "default", opacity: i <= current ? 1 : 0.4,
            minWidth: 72, transition: "opacity 0.2s",
          }}
        >
          <StepIcon type={s.icon} active={i === current} />
          <span style={{
            fontSize: 11, fontWeight: i === current ? 700 : 500,
            color: i === current ? (s.icon === "heart" ? t.heart : t.accent) : t.muted,
          }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── 1~5 Radio Scale ───
function ScaleRadio({ desc, value, onChange }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {desc && <div style={{ fontSize: 14, color: t.sub, marginBottom: 12, lineHeight: 1.6 }}>{desc}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} onClick={() => onChange(n)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: value === n ? t.accent : t.surface,
              border: `2px solid ${value === n ? t.accent : t.borderDark}`,
              transition: "all 0.15s",
            }} />
            <span style={{ fontSize: 12, color: value === n ? t.accent : t.muted, fontWeight: value === n ? 700 : 400 }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Circular Score Gauge ───
function ScoreGauge({ score, max = 100 }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / 1500, 1);
      setAnim(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(run);
    };
    run();
  }, [score]);
  const r = 90, stroke = 10;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-225deg)" }}>
        <circle cx="110" cy="110" r={r} fill="none" stroke={t.barBg} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} />
        <circle cx="110" cy="110" r={r} fill="none" stroke={t.accentLight} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ * 0.75 * (anim / max)} ${circ - circ * 0.75 * (anim / max)}`} />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: t.sub, marginBottom: 2 }}>점수</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{anim}점</div>
      </div>
    </div>
  );
}

// ─── Form Components ───
function Field({ label, placeholder, type = "text", half, value, onChange, suffix }) {
  return (
    <div style={{ marginBottom: 16, flex: half ? 1 : undefined }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.sub, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{
            width: "100%", padding: "11px 14px", paddingRight: suffix ? 44 : 14,
            borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 14,
            color: t.text, fontFamily: font, outline: "none", background: t.surface, boxSizing: "border-box",
          }}
        />
        {suffix && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: t.muted }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SelectField({ label, options }) {
  return (
    <div style={{ marginBottom: 16, flex: 1 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.sub, marginBottom: 6 }}>{label}</label>
      <select style={{
        width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${t.border}`,
        fontSize: 14, color: t.text, fontFamily: font, outline: "none", background: t.surface,
        appearance: "none", cursor: "pointer", boxSizing: "border-box",
      }}>
        <option value="">선택</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, primary, onClick, full, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: primary ? t.accent : t.surface,
      color: primary ? "#fff" : t.sub,
      border: primary ? "none" : `1px solid ${t.border}`,
      borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 600, fontFamily: font,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
      boxShadow: primary ? "0 2px 8px rgba(22,37,80,0.2)" : "none", transition: "all 0.15s",
    }}>
      {children}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: t.bg, borderRadius: 10, padding: 18, marginBottom: 20, border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.accent, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, color = t.accent }) {
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10,
      padding: "16px 18px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: color }} />
      <div style={{ fontSize: 12, color: t.muted, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: t.sub, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ════════════════════════════════════════
// STEP 0: 기본 정보
// ════════════════════════════════════════
function PageBasic({ next }) {
  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>기본 정보</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="회사명 *" placeholder="회사명을 입력하세요" half />
        <SelectField label="업종 *" options={["AI / SaaS", "핀테크", "바이오", "이커머스", "제조업", "신재생에너지", "기타"]} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="설립연도 *" placeholder="2020" type="number" half />
        <SelectField label="현재 단계 *" options={["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "성장기", "성숙기"]} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="대표자명" placeholder="홍길동" half />
        <Field label="임직원 수" placeholder="50" type="number" half />
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn primary full onClick={next}>다음 단계 →</Btn>
      </div>
    </>
  );
}

// ════════════════════════════════════════
// STEP 1: 사업계획 (Forward EV/EBITDA 입력)
// ════════════════════════════════════════
function PagePlan({ next, prev, setFormData, formData }) {
  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));
  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>사업계획</h2>

      <Section title="현재 재무 실적">
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="최근 연 매출 (억원) *" placeholder="50" type="number" half
            value={formData.revenue} onChange={(e) => update("revenue", e.target.value)} suffix="억" />
          <Field label="최근 EBITDA (억원) *" placeholder="8" type="number" half
            value={formData.ebitda} onChange={(e) => update("ebitda", e.target.value)} suffix="억" />
        </div>
      </Section>

      <Section title="향후 3년 매출 전망 (억원)">
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="1년차 *" placeholder="70" type="number" half
            value={formData.rev1} onChange={(e) => update("rev1", e.target.value)} suffix="억" />
          <Field label="2년차 *" placeholder="100" type="number" half
            value={formData.rev2} onChange={(e) => update("rev2", e.target.value)} suffix="억" />
          <Field label="3년차 *" placeholder="150" type="number" half
            value={formData.rev3} onChange={(e) => update("rev3", e.target.value)} suffix="억" />
        </div>
      </Section>

      <Section title="EBITDA 마진 전망 (%)">
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="1년차 *" placeholder="18" type="number" half
            value={formData.margin1} onChange={(e) => update("margin1", e.target.value)} suffix="%" />
          <Field label="2년차 *" placeholder="22" type="number" half
            value={formData.margin2} onChange={(e) => update("margin2", e.target.value)} suffix="%" />
          <Field label="3년차 *" placeholder="28" type="number" half
            value={formData.margin3} onChange={(e) => update("margin3", e.target.value)} suffix="%" />
        </div>
      </Section>

      <Section title="시장 정보">
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="목표 시장 TAM (억원)" placeholder="5000" type="number" half
            value={formData.tam} onChange={(e) => update("tam", e.target.value)} suffix="억" />
          <Field label="투자 필요 금액 (억원)" placeholder="30" type="number" half
            value={formData.investment} onChange={(e) => update("investment", e.target.value)} suffix="억" />
        </div>
      </Section>

      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <Btn onClick={prev}>← 이전</Btn>
        <Btn primary full onClick={next}>기업가치 산출 →</Btn>
      </div>
    </>
  );
}

// ════════════════════════════════════════
// STEP 2: 기업가치 (Forward EV/EBITDA 자동 산출)
// ════════════════════════════════════════
function PageValue({ next, prev, formData }) {
  const rev3 = parseFloat(formData.rev3) || 150;
  const margin3 = parseFloat(formData.margin3) || 28;
  const forwardEbitda = rev3 * (margin3 / 100);
  const currentRevenue = parseFloat(formData.revenue) || 50;

  const baseMultiple = 12.5;
  const ev = Math.round(forwardEbitda * baseMultiple);
  const evLow = Math.round(forwardEbitda * 8);
  const evHigh = Math.round(forwardEbitda * 18);
  const cagr = currentRevenue > 0 ? (Math.pow(rev3 / currentRevenue, 1 / 3) - 1) * 100 : 0;

  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      setAnimVal(Math.round((1 - Math.pow(1 - p, 3)) * ev));
      if (p < 1) requestAnimationFrame(run);
    };
    run();
  }, [ev]);

  const peerMultiples = [
    { name: "업종 평균", multiple: 12.5 },
    { name: "상위 25%", multiple: 18.0 },
    { name: "하위 25%", multiple: 8.0 },
  ];

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>기업가치 산출</h2>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
        borderRadius: 14, padding: "36px 24px", textAlign: "center", marginBottom: 20,
        color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Forward EV/EBITDA 기반 추정 기업가치</div>
        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>₩ {animVal}억</div>
        <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.15)" }}>
            적용 멀티플: {baseMultiple}x
          </span>
          <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.15)" }}>
            Forward EBITDA: {forwardEbitda.toFixed(1)}억
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <MetricCard label="3년차 예상 매출" value={`₩ ${rev3}억`} color={t.accent} />
        <MetricCard label="3년차 EBITDA 마진" value={`${margin3}%`} sub={`EBITDA ${forwardEbitda.toFixed(1)}억`} color={t.green} />
        <MetricCard label="매출 CAGR" value={`${cagr.toFixed(1)}%`} sub="3개년 연평균" color={t.blue} />
      </div>

      {/* Range */}
      <Section title="밸류에이션 레인지">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "하위 (8.0x)", value: `₩ ${evLow}억`, c: t.sub, bg: t.surface, border: t.border },
            { label: `기본 (${baseMultiple}x)`, value: `₩ ${ev}억`, c: t.accent, bg: t.accentGlow, border: t.accent },
            { label: "상위 (18.0x)", value: `₩ ${evHigh}억`, c: t.green, bg: t.greenBg, border: t.green },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", borderRadius: 8, background: item.bg, border: `1px solid ${item.border}`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: item.c }}>{item.label}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: item.c }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Peer */}
      <Section title="Peer EV/EBITDA 멀티플">
        {peerMultiples.map((peer, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${t.border}` : "none" }}>
            <span style={{ fontSize: 14, color: t.sub }}>{peer.name}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{peer.multiple}x</span>
          </div>
        ))}
      </Section>

      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <Btn onClick={prev}>← 이전</Btn>
        <Btn primary full onClick={next}>투자 매력도 평가 →</Btn>
      </div>
    </>
  );
}

// ════════════════════════════════════════
// STEP 3: 투자 매력도 평가 (정성적)
// ════════════════════════════════════════
function PageInvest({ next, prev }) {
  const [scores, setScores] = useState({ team1: 1, team2: 1, market1: 3, market2: 4, tech1: 1, tech2: 3 });
  const set = (k, v) => setScores((p) => ({ ...p, [k]: v }));

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>투자 매력도 평가</h2>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>팀 실행력</h3>
        <ScaleRadio desc="최근 6개월 내 중요한 기능을 기획→개발→출시한 경험이 있다" value={scores.team1} onChange={(v) => set("team1", v)} />
        <ScaleRadio desc="핵심 기술/사업 인력을 내부에 보유하고 있다" value={scores.team2} onChange={(v) => set("team2", v)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>시장 및 고객 이해</h3>
        <ScaleRadio desc="10명 이상의 고객/고객사의 피드백을 들었다" value={scores.market1} onChange={(v) => set("market1", v)} />
        <ScaleRadio desc="고객의 Pain Point와 기존 솔루션의 한계를 명확히 인지하고 있다" value={scores.market2} onChange={(v) => set("market2", v)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>기술력/해자</h3>
        <ScaleRadio desc="당사 기술은 경쟁사 대비 명확한 차별성과 방어력을 가진다" value={scores.tech1} onChange={(v) => set("tech1", v)} />
        <ScaleRadio desc="특허/데이터셋/SDK 등 진입장벽이 되는 유무형 자산을 보유하고 있다" value={scores.tech2} onChange={(v) => set("tech2", v)} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <Btn onClick={prev}>← 이전</Btn>
        <Btn primary full onClick={next}>결과보기 →</Btn>
      </div>
    </>
  );
}

// ════════════════════════════════════════
// Results
// ════════════════════════════════════════
function PageResults({ restart, onPrev, formData }) {
  const rev3 = parseFloat(formData.rev3) || 150;
  const margin3 = parseFloat(formData.margin3) || 28;
  const forwardEbitda = rev3 * (margin3 / 100);
  const ev = Math.round(forwardEbitda * 12.5);

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>종합 평가 결과</h2>

      <div style={{
        background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
        borderRadius: 14, padding: "28px 24px", textAlign: "center", marginBottom: 24, color: "#fff",
      }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>추정 기업가치 (Forward EV/EBITDA)</div>
        <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>₩ {ev}억</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>적용 멀티플 12.5x · Forward EBITDA {forwardEbitda.toFixed(1)}억</div>
      </div>

      <ScoreGauge score={85} />

      <div style={{ textAlign: "center", marginTop: 16, marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: t.sub, marginBottom: 16 }}>투자 매력도 점수</div>
        <div style={{ padding: "16px 24px", background: t.heartBg, borderRadius: 12, display: "inline-block" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.heart, marginBottom: 10 }}>
            결과치에 대한 상담을 받아 보시겠습니까?
          </div>
          <Btn primary onClick={() => window.open("https://forms.gle/gHEzFtMbb5Kigb6CA", "_blank")}>상담 신청</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn onClick={onPrev}>← 이전 단계</Btn>
        <Btn primary onClick={restart}>홈으로 →</Btn>
      </div>
    </>
  );
}

// ─── Loading ───
function Loading({ onDone }) {
  const [pct, setPct] = useState(0);
  const msgs = ["사업계획 분석 중...", "Forward EBITDA 산출 중...", "Peer 멀티플 비교 중...", "리포트 생성 중..."];
  useEffect(() => {
    const iv = setInterval(() => {
      setPct((p) => { if (p >= 100) { clearInterval(iv); setTimeout(onDone, 200); return 100; } return p + 1; });
    }, 25);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, margin: "0 auto 20px",
        background: t.accentGlow, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 24, height: 24, border: `3px solid ${t.border}`, borderTopColor: t.accent, borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: t.text }}>기업가치 산출 중</div>
      <div style={{ fontSize: 14, color: t.sub, marginBottom: 24 }}>{msgs[Math.min(Math.floor(pct / 25), 3)]}</div>
      <div style={{ height: 4, background: t.barBg, borderRadius: 2, margin: "0 60px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: t.accent, borderRadius: 2, transition: "width 0.08s" }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// App
// ════════════════════════════════════════
export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    revenue: "", ebitda: "",
    rev1: "", rev2: "", rev3: "",
    margin1: "", margin2: "", margin3: "",
    tam: "", investment: "",
  });

  const navStep = step <= 1 ? step : step === 3 ? 2 : step === 4 ? 3 : step === 6 ? 3 : -1;
  const onValueDone = useCallback(() => setStep(3), []);
  const onResultDone = useCallback(() => setStep(6), []);

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${t.bg}; }
        input:focus, select:focus { border-color: ${t.accent} !important; outline: none; box-shadow: 0 0 0 3px ${t.accentGlow}; }
        input::placeholder { color: ${t.muted}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ fontFamily: font, color: t.text, minHeight: "100vh", background: t.bg }}>
        <header style={{
          height: 52, borderBottom: `1px solid ${t.border}`,
          display: "flex", alignItems: "center", padding: "0 20px",
          background: t.surface, position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 7, background: t.accent,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="20" height="22" viewBox="0 0 24 28" fill="none">
                <path d="M1 2h9v2.4H3.8v5.2h5.6v2.4H3.8v5.2H10v2.4H1V2z" fill="#fff"/>
                <path d="M10 2h3.2l4.4 8.8L22 2h2v17.6h-2.8V8.4l-3.6 7.2h-1.6L12.6 8.4v11.2H10V2z" fill="#fff" opacity="0.95"/>
                <text x="12" y="26.5" fill="#fff" fontSize="4.2" fontFamily="Arial,sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="1.8">EXIT MAKER</text>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: t.accent, letterSpacing: "0.06em" }}>EXIT MAKER</span>
          </div>
        </header>

        {(step <= 1 || step === 3 || step === 4) && (
          <StepNav current={navStep} onStep={(i) => {
            if (i === 0) setStep(0);
            else if (i === 1) setStep(1);
            else if (i === 2) setStep(3);
            else if (i === 3) setStep(4);
          }} />
        )}

        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 20px 60px", animation: "fadeUp 0.25s ease" }} key={step}>
          {step === 0 && <PageBasic next={() => setStep(1)} />}
          {step === 1 && <PagePlan next={() => setStep(2)} prev={() => setStep(0)} formData={formData} setFormData={setFormData} />}
          {step === 2 && <Loading onDone={onValueDone} />}
          {step === 3 && <PageValue next={() => setStep(4)} prev={() => setStep(1)} formData={formData} />}
          {step === 4 && <PageInvest next={() => setStep(5)} prev={() => setStep(3)} />}
          {step === 5 && <Loading onDone={onResultDone} />}
          {step === 6 && <PageResults restart={() => setStep(0)} onPrev={() => setStep(4)} formData={formData} />}
        </div>
      </div>
    </>
  );
}

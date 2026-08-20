import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const CITIES = [
  { id: 1,  name: "Delhi",       country: "India",       flag: "🇮🇳", aqi: 168, pm25: 95,  pm10: 245, no2: 89, so2: 42, co: 8.2, o3: 65,  trend: "up",     lat: 28.6, lon: 77.2,  pop: "32M",  desc: "India's capital, one of Asia's most polluted mega-cities." },
  { id: 2,  name: "Bengaluru",   country: "India",       flag: "🇮🇳", aqi: 89,  pm25: 38,  pm10: 88,  no2: 55, so2: 18, co: 3.2, o3: 42,  trend: "stable", lat: 12.9, lon: 77.6,  pop: "13M",  desc: "India's tech hub. Air improving but traffic still a concern." },
  { id: 3,  name: "Mumbai",      country: "India",       flag: "🇮🇳", aqi: 155, pm25: 88,  pm10: 185, no2: 72, so2: 35, co: 6.4, o3: 55,  trend: "up",     lat: 19.0, lon: 72.8,  pop: "21M",  desc: "India's financial capital. High sea-breeze PM2.5 and vehicle emissions." },
  { id: 4,  name: "Beijing",     country: "China",       flag: "🇨🇳", aqi: 132, pm25: 72,  pm10: 142, no2: 76, so2: 35, co: 5.4, o3: 48,  trend: "down",   lat: 39.9, lon: 116.4, pop: "22M",  desc: "China's capital. Significant improvements in the last decade." },
  { id: 5,  name: "London",      country: "UK",          flag: "🇬🇧", aqi: 42,  pm25: 11,  pm10: 32,  no2: 48, so2: 8,  co: 1.1, o3: 55,  trend: "down",   lat: 51.5, lon: -0.1,  pop: "9M",   desc: "Generally clean air. Occasional NO₂ spikes near busy roads." },
  { id: 6,  name: "New York",    country: "USA",         flag: "🇺🇸", aqi: 58,  pm25: 22,  pm10: 44,  no2: 62, so2: 14, co: 2.1, o3: 58,  trend: "stable", lat: 40.7, lon: -74.0, pop: "8M",   desc: "Good air quality with occasional summer ozone events." },
  { id: 7,  name: "Sydney",      country: "Australia",   flag: "🇦🇺", aqi: 28,  pm25: 7,   pm10: 15,  no2: 22, so2: 4,  co: 0.6, o3: 38,  trend: "down",   lat: -33.9, lon: 151.2, pop: "5M",  desc: "Some of the world's cleanest urban air. Excellent quality." },
  { id: 8,  name: "Lahore",      country: "Pakistan",    flag: "🇵🇰", aqi: 195, pm25: 112, pm10: 220, no2: 88, so2: 48, co: 9.1, o3: 62,  trend: "up",     lat: 31.5, lon: 74.3,  pop: "14M",  desc: "Consistently among the world's worst air quality cities." },
  { id: 9,  name: "Tokyo",       country: "Japan",       flag: "🇯🇵", aqi: 55,  pm25: 18,  pm10: 38,  no2: 44, so2: 10, co: 1.8, o3: 52,  trend: "stable", lat: 35.7, lon: 139.7, pop: "37M",  desc: "Asia's cleanest megacity. Excellent emission controls." },
  { id: 10, name: "Cairo",       country: "Egypt",       flag: "🇪🇬", aqi: 138, pm25: 76,  pm10: 148, no2: 66, so2: 38, co: 5.8, o3: 44,  trend: "up",     lat: 30.0, lon: 31.2,  pop: "21M",  desc: "Desert dust and vehicle emissions create challenging air quality." },
  { id: 11, name: "Shanghai",    country: "China",       flag: "🇨🇳", aqi: 95,  pm25: 44,  pm10: 88,  no2: 58, so2: 22, co: 3.8, o3: 50,  trend: "down",   lat: 31.2, lon: 121.5, pop: "24M",  desc: "Large improvements due to China's air quality action plans." },
  { id: 12, name: "Paris",       country: "France",      flag: "🇫🇷", aqi: 47,  pm25: 14,  pm10: 28,  no2: 52, so2: 9,  co: 1.3, o3: 48,  trend: "stable", lat: 48.9, lon: 2.3,   pop: "11M",  desc: "Good quality with some NO₂ issues from traffic." },
];

const TIPS = [
  { icon: "💧", title: "Stay hydrated",    body: "Drink 2–3L water daily. It helps flush pollutants from your system." },
  { icon: "😷", title: "N95 Mask",         body: "When AQI > 100, wear a properly fitted N95 mask for 95% PM2.5 filtration." },
  { icon: "🌿", title: "Indoor plants",    body: "Peace lily, snake plant, and areca palm naturally filter indoor air." },
  { icon: "🏃", title: "Time your runs",   body: "Exercise between 10am–12pm when pollution is typically lowest." },
  { icon: "🪟", title: "Close windows",    body: "When AQI > 150, keep windows closed and run an air purifier." },
  { icon: "🍃", title: "Air purifier",     body: "A HEPA air purifier reduces indoor PM2.5 by up to 90%." },
  { icon: "🚗", title: "Car mode",         body: "Use your car's recirculate mode in traffic to reduce cabin pollution." },
  { icon: "🌞", title: "Check before going out", body: "Always check AQI on AirLens before any outdoor activity." },
];

function getAqiInfo(aqi) {
  if (aqi <= 50)  return { cat: "Good",              color: "#22c55e", light: "#dcfce7", emoji: "😊", risk: "Low",      mask: "None needed",   advice: "Perfect day outside! Enjoy all outdoor activities freely." };
  if (aqi <= 100) return { cat: "Moderate",           color: "#f59e0b", light: "#fef3c7", emoji: "😐", risk: "Low-Med",  mask: "Optional",      advice: "Acceptable. Very sensitive people may want to limit long outdoor exertion." };
  if (aqi <= 150) return { cat: "Unhealthy for SG",   color: "#f97316", light: "#ffedd5", emoji: "😷", risk: "Medium",   mask: "Recommended",   advice: "Sensitive groups (elderly, children, asthma) should limit outdoor time." };
  if (aqi <= 200) return { cat: "Unhealthy",           color: "#ef4444", light: "#fee2e2", emoji: "🚫", risk: "High",     mask: "N95 required",  advice: "Everyone may experience effects. Move exercise indoors, wear N95." };
  if (aqi <= 300) return { cat: "Very Unhealthy",      color: "#a855f7", light: "#f3e8ff", emoji: "⚠️",  risk: "Very High", mask: "P100 required", advice: "Health alert. Stay indoors. Seal windows and run air purifier." };
  return           { cat: "Hazardous",                 color: "#dc2626", light: "#fef2f2", emoji: "☠️", risk: "Critical",  mask: "Full respirator", advice: "EMERGENCY. Do not go outside. Seek medical help if breathing issues." };
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
function AqiRing({ aqi, size = 120 }) {
  const info = getAqiInfo(aqi);
  const pct = Math.min(aqi / 500, 1);
  const r = size * 0.4, cx = size / 2, cy = size / 2;
  const toR = d => (d * Math.PI) / 180;
  const sA = -200, eA = 20;
  const fA = sA + pct * (eA - sA);
  const arc = (a1, a2) => {
    const x1 = cx + r * Math.cos(toR(a1)), y1 = cy + r * Math.sin(toR(a1));
    const x2 = cx + r * Math.cos(toR(a2)), y2 = cy + r * Math.sin(toR(a2));
    const lg = (a2 - a1 > 180) ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={arc(sA, eA)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={size * 0.07} strokeLinecap="round" />
      <path d={arc(sA, fA)} fill="none" stroke={info.color} strokeWidth={size * 0.07} strokeLinecap="round" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize={size * 0.22} fontWeight="700" fontFamily="monospace">{aqi}</text>
      <text x={cx} y={cy + size * 0.2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size * 0.1} fontFamily="sans-serif">AQI</text>
    </svg>
  );
}

function PollBar({ name, val, max, color, unit }) {
  const pct = Math.min((val / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "baseline" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{name}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "monospace" }}>{val} <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.6 }}>{unit}</span></span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.23,1,0.32,1)" }} />
      </div>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em", background: color + "22", color, border: `1px solid ${color}44` }}>{label}</span>
  );
}

// ─── PROFILE MODAL ───────────────────────────────────────────────────────────
function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile });
  const [tab, setTab] = useState("info");
  const fileRef = useRef();

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  }

  const tabs = [["info", "👤 Info"], ["health", "🫁 Health"], ["notif", "🔔 Alerts"], ["appear", "🎨 Theme"]];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: 380, height: "100vh", background: "linear-gradient(160deg, #0a1628, #060c1a)", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", animation: "slideRight 0.35s cubic-bezier(0.16,1,0.3,1)", overflow: "hidden" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #00f5ff, #a3ff47, #bf5fff, #ff5f7e)" }} />

        {/* Header */}
        <div style={{ padding: "1.25rem 1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>My Profile</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1rem 1rem" }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current.click()}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: form.avatar ? "transparent" : "linear-gradient(135deg,#00f5ff,#bf5fff)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(0,245,255,0.3)", overflow: "hidden" }}>
              {form.avatar ? <img src={form.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" /> : <span style={{ fontSize: 28, fontWeight: 900, color: "#020510" }}>{(form.name || "U")[0].toUpperCase()}</span>}
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, borderRadius: "50%", background: "#00f5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, border: "2px solid #060c1a" }}>📷</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 10 }}>{form.name || "Your Name"}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{form.email || "your@email.com"}</div>
          <div style={{ marginTop: 8, padding: "3px 12px", borderRadius: 99, background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.25)", fontSize: 11, color: "#00f5ff", fontFamily: "monospace" }}>✦ AirLens Member</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "0 1rem 1rem" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: "none", background: tab === id ? "rgba(0,245,255,0.15)" : "rgba(255,255,255,0.05)", color: tab === id ? "#00f5ff" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 10, fontWeight: tab === id ? 700 : 400 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem 1.25rem" }}>
          {tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["name","Full Name","👤","John Doe"],["email","Email","📧","you@example.com"],["phone","Phone","📱","+91 98765 43210"],["city","Home City","📍","Bengaluru"]].map(([key, label, icon, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, display: "block", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{icon} {label}</label>
                  <input value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, display: "block", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>📝 Bio</label>
                <textarea value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit" }} />
              </div>
            </div>
          )}
          {tab === "health" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, display: "block", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>🫁 Health Sensitivity</label>
                <select value={form.sensitivity || "normal"} onChange={e => setForm(f => ({ ...f, sensitivity: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0a1628", color: "white", fontSize: 13, outline: "none" }}>
                  <option value="normal">Normal (General public)</option>
                  <option value="sensitive">Sensitive (Asthma / Respiratory)</option>
                  <option value="heart">Cardiovascular condition</option>
                  <option value="elderly">Elderly (65+)</option>
                  <option value="child">Child (under 12)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, display: "block", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>📅 Age Group</label>
                <select value={form.ageGroup || "25-34"} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0a1628", color: "white", fontSize: 13, outline: "none" }}>
                  {["Under 18","18–24","25–34","35–44","45–54","55–64","65+"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, display: "block", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>🏠 Default City</label>
                <select value={form.defaultCity || "Bengaluru"} onChange={e => setForm(f => ({ ...f, defaultCity: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0a1628", color: "white", fontSize: 13, outline: "none" }}>
                  {CITIES.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.2)", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                💡 Your health profile helps ARIA give you personalised AQI advice tailored to your specific needs.
              </div>
            </div>
          )}
          {tab === "notif" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                ["aqi150", "AQI Alerts", "Notify when AQI exceeds 150", true],
                ["hazard",  "Hazard Warnings", "Emergency: AQI > 300", true],
                ["daily",   "Daily Summary", "Morning air quality briefing", false],
                ["weekly",  "Weekly Report", "Weekly trend digest", false],
                ["outdoor", "Outdoor Tips", "Tips before going outside", true],
              ].map(([key, label, desc, def]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{desc}</div>
                  </div>
                  <div onClick={() => setForm(f => ({ ...f, [key]: f[key] === undefined ? !def : !f[key] }))}
                    style={{ width: 44, height: 24, borderRadius: 99, background: (form[key] === undefined ? def : form[key]) ? "#00f5ff" : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 3, left: (form[key] === undefined ? def : form[key]) ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "appear" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>🎨 Accent Color</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["#00f5ff","#a3ff47","#bf5fff","#ff5f7e","#ffb830","#38bdf8"].map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, accent: c }))} style={{ width: 36, height: 36, borderRadius: 10, background: c, cursor: "pointer", border: form.accent === c ? "3px solid white" : "3px solid transparent", transition: "border 0.15s" }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>🗂️ Dashboard layout</div>
                {["Grid","List","Compact"].map(l => (
                  <div key={l} onClick={() => setForm(f => ({ ...f, layout: l }))} style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${form.layout === l ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.08)"}`, background: form.layout === l ? "rgba(0,245,255,0.08)" : "rgba(255,255,255,0.03)", color: form.layout === l ? "#00f5ff" : "rgba(255,255,255,0.55)", cursor: "pointer", marginBottom: 7, fontSize: 13 }}>
                    {l === "Grid" ? "⊞" : l === "List" ? "☰" : "▤"} {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={() => onSave(form)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00f5ff, #a3ff47)", color: "#020510", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            ✓ Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function AirLensUltimate() {
  const [page, setPage] = useState("home");
  const [selCity, setSelCity] = useState(null);
  const [profile, setProfile] = useState({ name: "Sueep Rathod", email: "sueep@airlens.app", city: "Bengaluru", sensitivity: "normal", accent: "#00f5ff", layout: "Grid" });
  const [showProfile, setShowProfile] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [toast, setToast] = useState(null);
  const [predictVals, setPredictVals] = useState({ pm25: 35, pm10: 60, no2: 40, so2: 20, co: 2, o3: 50 });
  const [predictResult, setPredictResult] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [search, setSearch] = useState("");
  const msgEnd = useRef(null);
  const recRef = useRef(null);
  const accent = profile.accent || "#00f5ff";

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      recRef.current = new SR();
      recRef.current.lang = "en-US";
      recRef.current.onresult = e => { const t = e.results[0][0].transcript; setAiInput(t); setListening(false); setTimeout(() => doSend(t), 150); };
      recRef.current.onerror = () => setListening(false);
      recRef.current.onend = () => setListening(false);
    }
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function saveProfile(p) {
    setProfile(p);
    setShowProfile(false);
    showToast("Profile saved successfully! ✓");
  }

  function speak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, "").slice(0, 450));
      u.rate = 1.05; u.pitch = 1.1;
      const vs = window.speechSynthesis.getVoices();
      const v = vs.find(x => x.lang === "en-US" && x.name.includes("Google")) || vs.find(x => x.lang === "en-US");
      if (v) u.voice = v;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  }

  const doSend = useCallback(async (txt) => {
    const msg = (txt || aiInput).trim();
    if (!msg) return;
    setAiInput(""); setShowAI(true);
    setMsgs(prev => [...prev, { role: "user", content: msg }]);
    setAiLoad(true);
    const sys = `You are ARIA, the friendly AI assistant for AirLens — an air quality app built by Sueep Rathod.
You're casual, warm, and knowledgeable about:
- AQI scale (0-500), what each level means
- Pollutants: PM2.5, PM10, NO2, SO2, CO, O3
- Health effects and precautions by AQI level
- City-specific air quality data

Live city data: ${CITIES.map(c => `${c.name}(AQI:${c.aqi},${getAqiInfo(c.aqi).cat})`).join(" | ")}

User's profile: Name=${profile.name}, City=${profile.city || "Unknown"}, Health=${profile.sensitivity || "normal"}

Be concise (3-5 sentences max unless asked for detail). Use friendly casual language. Give specific numbers.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, system: sys, messages: [...msgs.map(m => ({ role: m.role, content: m.content })), { role: "user", content: msg }] })
      });
      const d = await res.json();
      const reply = d.content?.[0]?.text || "Sorry, I couldn't connect. Try again!";
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Oops! Connection issue. Please try again." }]);
    }
    setAiLoad(false);
  }, [aiInput, msgs, profile]);

  const h = new Date().getHours();
  const greetEmoji = h < 12 ? "🌅" : h < 17 ? "☀️" : h < 21 ? "🌆" : "🌙";
  const greetText = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 21 ? "Good evening" : "Good night";

  const polls = [
    { id: "pm25", name: "PM2.5", unit: "μg/m³", color: "#f97316", max: 300 },
    { id: "pm10", name: "PM10",  unit: "μg/m³", color: "#eab308", max: 500 },
    { id: "no2",  name: "NO₂",   unit: "μg/m³", color: "#00f5ff", max: 400 },
    { id: "so2",  name: "SO₂",   unit: "μg/m³", color: "#a3ff47", max: 200 },
    { id: "co",   name: "CO",    unit: "mg/m³",  color: "#bf5fff", max: 20,  step: 0.1 },
    { id: "o3",   name: "O₃",    unit: "μg/m³", color: "#ff5f7e", max: 200 },
  ];

  const liveAqi = Math.min(500, Math.round(Math.max(predictVals.pm25 * 1.4, predictVals.pm10 * 0.5, predictVals.no2 * 0.7, predictVals.so2 * 0.9, predictVals.co * 12, predictVals.o3 * 0.8)));
  const liveInfo = getAqiInfo(liveAqi);

  const CHECKLIST_ITEMS = [
    "Checked today's AQI before going out",
    "Wore N95 mask (if AQI > 100)",
    "Ran air purifier at home",
    "Drank 2+ litres of water",
    "Avoided heavy outdoor exercise",
    "Kept windows closed (if AQI > 150)",
    "Took prescribed medication",
    "Checked on elderly family members",
    "Rinsed nose after being outside",
    "Reported unusual haze to local authorities",
  ];

  const navItems = [
    ["home",       "🏠", "Home"],
    ["cities",     "🌍", "Cities"],
    ["predict",    "🔬", "Predict"],
    ["tips",       "💡", "Tips"],
    ["checklist",  "✅", "Checklist"],
    ["about",      "ℹ️",  "About"],
  ];

  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.aqi - a.aqi);

  const worstCity = [...CITIES].sort((a, b) => b.aqi - a.aqi)[0];
  const bestCity  = [...CITIES].sort((a, b) => a.aqi - b.aqi)[0];
  const avgAqi    = Math.round(CITIES.reduce((s, c) => s + c.aqi, 0) / CITIES.length);

  return (
    <div style={{ minHeight: "100vh", background: "#020510", color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes slideRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes toastIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=range] { height: 4px; cursor: pointer; }
        select option { background: #0a1628; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .nav-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .city-card:hover { border-color: rgba(255,255,255,0.2) !important; transform: translateY(-2px); }
        .tip-card:hover { transform: translateY(-3px); }
      `}</style>

      {/* Aurora */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[{ t: "-15%", l: "-5%", w: 600, h: 500, c: accent }, { t: "-10%", r: "-10%", w: 500, h: 600, c: "#bf5fff" }, { b: "0%", l: "20%", w: 400, h: 350, c: "#a3ff47" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.t, left: o.l, right: o.r, bottom: o.b, width: o.w, height: o.h, borderRadius: "50%", background: `radial-gradient(ellipse, ${o.c}14, transparent 70%)`, filter: "blur(80px)" }} />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 70, right: 16, zIndex: 9998, padding: "10px 18px", borderRadius: 10, background: toast.type === "error" ? "#450a0a" : "#052e0a", border: `1px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}44`, color: toast.type === "error" ? "#f87171" : "#4ade80", fontSize: 13, fontFamily: "monospace", animation: "toastIn 0.3s ease", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
          {toast.msg}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 500, height: 56, background: "rgba(2,5,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 1rem", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${accent}, #bf5fff)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#020510" }}>AL</div>
          <span style={{ fontWeight: 800, fontSize: 16, background: `linear-gradient(90deg, ${accent}, #bf5fff)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AirLens</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "1px 5px" }}>AI</span>
        </div>

        <div style={{ display: "flex", gap: 2 }}>
          {navItems.map(([p, icon, label]) => (
            <button key={p} className="nav-btn" onClick={() => { setPage(p); setSelCity(null); }} style={{ background: page === p ? `${accent}18` : "none", border: page === p ? `1px solid ${accent}33` : "1px solid transparent", color: page === p ? accent : "rgba(255,255,255,0.4)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: page === p ? 700 : 400, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4 }}>
              <span>{icon}</span>
              <span style={{ display: "none", "@media(min-width:700px)": { display: "inline" } }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 8 }}>
          <button onClick={() => setShowAI(s => !s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 9, border: `1px solid ${showAI ? accent : "rgba(255,255,255,0.12)"}`, background: showAI ? `${accent}12` : "rgba(255,255,255,0.04)", color: showAI ? accent : "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
            <span style={{ animation: speaking ? "pulse 0.6s infinite" : "none" }}>🤖</span> ARIA
          </button>
          {/* Profile button */}
          <button onClick={() => setShowProfile(true)} style={{ width: 36, height: 36, borderRadius: "50%", background: profile.avatar ? "transparent" : `linear-gradient(135deg, ${accent}, #bf5fff)`, border: `2px solid ${accent}55`, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#020510", transition: "border-color 0.2s" }}>
            {profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" /> : (profile.name || "U")[0].toUpperCase()}
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.25rem" }}>

            {/* ── HOME ── */}
            {page === "home" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                {/* Greeting hero */}
                <div style={{ textAlign: "center", padding: "2rem 1rem 2.5rem" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>
                    <span style={{ fontSize: 18 }}>{greetEmoji}</span>
                    {greetText}, <strong style={{ color: accent }}>{profile.name?.split(" ")[0] || "there"}</strong>!
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <h1 style={{ fontSize: "clamp(2rem,7vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 14 }}>
                    <span style={{ display: "block", color: "white" }}>Know what</span>
                    <span style={{ display: "block", background: `linear-gradient(90deg, ${accent}, #a3ff47, #bf5fff, #ff5f7e)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>you breathe</span>
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.7 }}>
                    Real-time AQI · 12 cities · AI assistant ARIA · voice-guided health precautions
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => setPage("cities")} style={{ padding: "11px 24px", borderRadius: 11, border: "none", background: `linear-gradient(135deg, ${accent}, #a3ff47)`, color: "#020510", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🌍 Browse Cities</button>
                    <button onClick={() => setPage("predict")} style={{ padding: "11px 24px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>🔬 Predict AQI</button>
                    <button onClick={() => { setShowAI(true); doSend(`${greetText}! Give me a quick air quality briefing for today.`); }} style={{ padding: "11px 24px", borderRadius: 11, border: `1px solid ${accent}44`, background: `${accent}0f`, color: accent, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>🎙 Ask ARIA</button>
                  </div>
                </div>

                {/* Global summary cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Global Avg AQI", value: avgAqi, color: getAqiInfo(avgAqi).color, icon: "🌐" },
                    { label: "Most Polluted", value: worstCity.name, sub: `AQI ${worstCity.aqi}`, color: "#ef4444", icon: "⚠️" },
                    { label: "Cleanest City", value: bestCity.name, sub: `AQI ${bestCity.aqi}`, color: "#22c55e", icon: "✨" },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.color}33`, borderRadius: 14, padding: "1rem", textAlign: "center" }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: c.color, fontFamily: "monospace" }}>{c.value}</div>
                      {c.sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.sub}</div>}
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* City grid preview */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Featured cities — tap for full dashboard</div>
                    <button onClick={() => setPage("cities")} style={{ fontSize: 11, color: accent, background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}>See all →</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                    {CITIES.slice(0, 6).map(city => {
                      const info = getAqiInfo(city.aqi);
                      return (
                        <div key={city.id} className="city-card" onClick={() => { setSelCity(city); setPage("cityDetail"); }} style={{ background: `linear-gradient(135deg, ${info.color}10, rgba(255,255,255,0.02))`, border: `1px solid ${info.color}28`, borderRadius: 14, padding: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{city.flag}</div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{city.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{city.country}</div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: info.color, fontFamily: "monospace" }}>{city.aqi}</div>
                          <div style={{ fontSize: 10, color: info.color, marginTop: 2 }}>{info.cat}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick tips */}
                <div style={{ background: `${accent}0a`, border: `1px solid ${accent}20`, borderRadius: 16, padding: "1.25rem" }}>
                  <div style={{ fontSize: 12, color: accent, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Quick questions for ARIA</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Which city has the worst air?", "Is it safe to exercise in Delhi?", "What is PM2.5?", "How to protect my lungs?"].map(q => (
                      <button key={q} onClick={() => { setShowAI(true); doSend(q); }} style={{ padding: "7px 13px", borderRadius: 8, border: `1px solid ${accent}30`, background: `${accent}0c`, color: accent, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>{q} ↗</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CITIES ── */}
            {page === "cities" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Live rankings</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 14px" }}>Global Air Quality</h2>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search city or country…"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredCities.map((city, i) => {
                    const info = getAqiInfo(city.aqi);
                    return (
                      <div key={city.id} className="city-card" onClick={() => { setSelCity(city); setPage("cityDetail"); }} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${info.color}25`, borderRadius: 14, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", width: 24, textAlign: "center" }}>#{i + 1}</div>
                        <div style={{ fontSize: 26 }}>{city.flag}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{city.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{city.country} · {city.pop}</div>
                          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 99, marginTop: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min((city.aqi / 280) * 100, 100)}%`, background: info.color, borderRadius: 99 }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "monospace", color: info.color }}>{city.aqi}</div>
                          <Tag label={info.cat} color={info.color} />
                          <div style={{ fontSize: 10, color: city.trend === "up" ? "#ef4444" : city.trend === "down" ? "#22c55e" : "rgba(255,255,255,0.3)", marginTop: 4 }}>
                            {city.trend === "up" ? "↑ Rising" : city.trend === "down" ? "↓ Improving" : "→ Stable"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCities.length === 0 && <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>No cities found for "{search}"</div>}
                </div>
              </div>
            )}

            {/* ── CITY DETAIL ── */}
            {page === "cityDetail" && selCity && (() => {
              const info = getAqiInfo(selCity.aqi);
              const prec = {
                "Good": ["Go outside freely — enjoy the fresh air!", "Open your windows for natural ventilation", "Perfect for a run or cycle", "No mask needed today"],
                "Moderate": ["Sensitive people: limit intense outdoor exercise", "Check AQI before jogging", "Keep an eye on symptoms if you have asthma", "Generally safe for most people"],
                "Unhealthy for SG": ["Wear N95 mask if you're sensitive", "Limit outdoor time to under 30 minutes", "Run HEPA purifier indoors", "Keep windows closed during rush hour"],
                "Unhealthy": ["Wear N95 mask for all outdoor trips", "Move all exercise indoors", "Close windows, run purifier on high", "Stay hydrated — drink 3L water"],
                "Very Unhealthy": ["Stay indoors as much as possible", "Wear P100 respirator if you must go out", "Seal gaps around doors and windows", "Check on elderly and children"],
                "Hazardous": ["DO NOT go outside", "This is a public health emergency", "Seek medical help if you feel chest pain or breathlessness", "Follow evacuation orders if issued"],
              };
              return (
                <div style={{ animation: "fadeUp 0.35s ease" }}>
                  <button onClick={() => setPage("cities")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, marginBottom: 18 }}>← Back to cities</button>

                  <div style={{ background: `linear-gradient(135deg, ${info.color}14, transparent)`, border: `1px solid ${info.color}40`, borderRadius: 20, padding: "1.75rem", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                      <AqiRing aqi={selCity.aqi} size={130} />
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Live AQI · {selCity.name}</div>
                        <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 3 }}>{selCity.flag} {selCity.name}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{selCity.country} · Pop. {selCity.pop}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 12, maxWidth: 320 }}>{selCity.desc}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Tag label={info.cat} color={info.color} />
                          <Tag label={`Risk: ${info.risk}`} color={info.color} />
                          <Tag label={`Mask: ${info.mask}`} color="#f59e0b" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.1rem" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Pollutant levels</div>
                      <PollBar name="PM2.5" val={selCity.pm25} max={150} color="#f97316" unit="μg/m³" />
                      <PollBar name="PM10"  val={selCity.pm10} max={300} color="#eab308" unit="μg/m³" />
                      <PollBar name="NO₂"   val={selCity.no2}  max={200} color="#00d9ff" unit="μg/m³" />
                      <PollBar name="SO₂"   val={selCity.so2}  max={150} color="#a3ff47" unit="μg/m³" />
                      <PollBar name="CO"    val={selCity.co}   max={15}  color="#bf5fff" unit="mg/m³" />
                      <PollBar name="O₃"    val={selCity.o3}   max={150} color="#ff5f7e" unit="μg/m³" />
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.1rem" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Health precautions</div>
                      {(prec[info.cat] || prec["Good"]).map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: info.color, flexShrink: 0, marginTop: 6 }} />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{tip}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8, background: `${info.color}12`, border: `1px solid ${info.color}25`, fontSize: 12, color: info.color, lineHeight: 1.5 }}>
                        {info.advice}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { setShowAI(true); doSend(`Tell me about air quality in ${selCity.name}, ${selCity.country}. Current AQI is ${selCity.aqi} (${info.cat}). Give health advice.`); }} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${accent}, #a3ff47)`, color: "#020510", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                    🤖 Ask ARIA about {selCity.name} →
                  </button>
                </div>
              );
            })()}

            {/* ── PREDICT ── */}
            {page === "predict" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>EPA AQI · 6 pollutants</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 5px", background: `linear-gradient(90deg, ${accent}, #a3ff47, #bf5fff)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Predict Air Quality</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Enter pollutant values and get an instant AQI score with health guidance.</p>
                </div>

                {/* City quick-load */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>Quick load →</div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {[["🇮🇳","delhi"], ["🇮🇳","bengaluru"], ["🇨🇳","beijing"], ["🇬🇧","london"], ["🇺🇸","newyork"], ["🇦🇺","sydney"]].map(([flag, name]) => {
                      const cityMap = { delhi: CITIES[0], bengaluru: CITIES[1], beijing: CITIES[3], london: CITIES[4], newyork: CITIES[5], sydney: CITIES[6] };
                      const c = cityMap[name];
                      return (
                        <button key={name} onClick={() => setPredictVals({ pm25: c.pm25, pm10: c.pm10, no2: c.no2, so2: c.so2, co: c.co, o3: c.o3 })} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>
                          {flag} {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {polls.map(p => (
                    <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${p.color}28`, borderRadius: 13, padding: "0.9rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}</span>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{p.unit}</span>
                      </div>
                      <input type="number" min="0" max={p.max} step={p.step || 1} value={predictVals[p.id]}
                        onChange={e => setPredictVals(v => ({ ...v, [p.id]: parseFloat(e.target.value) || 0 }))}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${p.color}35`, borderRadius: 8, color: "white", fontSize: 20, fontWeight: 700, fontFamily: "monospace", padding: "7px 10px", outline: "none", marginBottom: 7 }} />
                      <input type="range" min="0" max={p.max} step={p.step || 1} value={predictVals[p.id]}
                        onChange={e => setPredictVals(v => ({ ...v, [p.id]: parseFloat(e.target.value) }))}
                        style={{ width: "100%", accentColor: p.color }} />
                    </div>
                  ))}
                </div>

                {/* Live preview */}
                <div style={{ background: `linear-gradient(135deg, ${liveInfo.color}12, transparent)`, border: `1px solid ${liveInfo.color}35`, borderRadius: 13, padding: "0.9rem 1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 2 }}>Live estimate</div>
                    <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace", color: liveInfo.color }}>{liveAqi}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: liveInfo.color, marginBottom: 5 }}>{liveInfo.emoji} {liveInfo.cat}</div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min((liveAqi / 500) * 100, 100)}%`, background: liveInfo.color, borderRadius: 99, transition: "width 0.25s ease" }} />
                    </div>
                  </div>
                </div>

                <button onClick={() => { setPredictResult({ aqi: liveAqi, info: liveInfo, vals: { ...predictVals } }); }} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${accent}, #a3ff47)`, color: "#020510", fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 12 }}>
                  ⚡ Analyse Air Quality
                </button>

                {predictResult && (
                  <div style={{ background: `linear-gradient(135deg, ${predictResult.info.color}12, transparent)`, border: `1px solid ${predictResult.info.color}40`, borderRadius: 16, padding: "1.25rem", animation: "fadeUp 0.4s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                      <AqiRing aqi={predictResult.aqi} size={100} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: predictResult.info.color, marginBottom: 5 }}>{predictResult.info.emoji} {predictResult.info.cat}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 250 }}>{predictResult.info.advice}</div>
                      </div>
                    </div>
                    <button onClick={() => { setShowAI(true); doSend(`My AQI reading: PM2.5=${predictResult.vals.pm25}, PM10=${predictResult.vals.pm10}, NO2=${predictResult.vals.no2}, SO2=${predictResult.vals.so2}, CO=${predictResult.vals.co}, O3=${predictResult.vals.o3}. AQI = ${predictResult.aqi} (${predictResult.info.cat}). Give me health advice.`); }}
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      🤖 Get AI health advice for these readings →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── TIPS ── */}
            {page === "tips" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Health intelligence</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>Air Quality Tips</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 5 }}>Science-backed advice to protect your health every day.</p>
                </div>

                {/* AQI scale guide */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>AQI Scale — what each level means</div>
                  {[
                    { range: "0–50",   cat: "Good",              color: "#22c55e", what: "Perfect air. Enjoy any outdoor activity." },
                    { range: "51–100", cat: "Moderate",           color: "#f59e0b", what: "Acceptable. Very sensitive people limit long exertion." },
                    { range: "101–150",cat: "Unhealthy for SG",   color: "#f97316", what: "Sensitive groups (asthma, elderly, kids) take care." },
                    { range: "151–200",cat: "Unhealthy",           color: "#ef4444", what: "Everyone may feel effects. Wear N95 outdoors." },
                    { range: "201–300",cat: "Very Unhealthy",      color: "#a855f7", what: "Health alert. Stay indoors. Seal windows." },
                    { range: "300+",   cat: "Hazardous",           color: "#dc2626", what: "Emergency. Do not go outside. Seek help if needed." },
                  ].map((l, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "11px 14px", borderRadius: 11, background: `${l.color}0d`, border: `1px solid ${l.color}25`, marginBottom: 7, alignItems: "center" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: l.color, fontWeight: 700, minWidth: 55 }}>{l.range}</div>
                      <div style={{ width: 3, height: 36, background: l.color, borderRadius: 99, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: l.color }}>{l.cat}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{l.what}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tips grid */}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Practical tips</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {TIPS.map((tip, i) => (
                    <div key={i} className="tip-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.25rem", transition: "all 0.2s", cursor: "default" }}>
                      <div style={{ fontSize: 26, marginBottom: 10 }}>{tip.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{tip.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{tip.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CHECKLIST ── */}
            {page === "checklist" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Daily routine</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>Air Quality Checklist</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 5 }}>Tick off what you've done today to protect your health.</p>
                </div>

                {/* Progress */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1.1rem", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Today's progress</span>
                    <span style={{ fontFamily: "monospace", fontSize: 13, color: accent }}>{Object.values(checklist).filter(Boolean).length}/{CHECKLIST_ITEMS.length}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(Object.values(checklist).filter(Boolean).length / CHECKLIST_ITEMS.length) * 100}%`, background: `linear-gradient(90deg, ${accent}, #a3ff47)`, borderRadius: 99, transition: "width 0.4s ease" }} />
                  </div>
                  {Object.values(checklist).filter(Boolean).length === CHECKLIST_ITEMS.length && (
                    <div style={{ marginTop: 10, fontSize: 13, color: "#22c55e", fontWeight: 600 }}>🎉 All done for today! You're protecting your health like a pro.</div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <div key={i} onClick={() => setChecklist(c => ({ ...c, [i]: !c[i] }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${checklist[i] ? `${accent}40` : "rgba(255,255,255,0.08)"}`, background: checklist[i] ? `${accent}0d` : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checklist[i] ? accent : "rgba(255,255,255,0.2)"}`, background: checklist[i] ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        {checklist[i] && <span style={{ fontSize: 13, color: "#020510", fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 14, color: checklist[i] ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)", textDecoration: checklist[i] ? "line-through" : "none", transition: "all 0.2s" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                  <button onClick={() => setChecklist({})} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 13 }}>Reset Checklist</button>
                  <button onClick={() => { setShowAI(true); doSend("Give me personalised daily air quality tips I should follow every morning."); }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${accent}40`, background: `${accent}0d`, color: accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🤖 Personalise with AI →</button>
                </div>
              </div>
            )}

            {/* ── ABOUT ── */}
            {page === "about" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>About the platform</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>AirLens AI</h2>
                </div>

                {/* Developer card */}
                <div style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.06), rgba(191,95,255,0.06))", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ height: 3, background: "linear-gradient(90deg, #00f5ff, #a3ff47, #bf5fff, #ff5f7e)" }} />
                  <div style={{ padding: "1.75rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div style={{ width: 90, height: 90, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #bf5fff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "#020510", flexShrink: 0, border: "3px solid rgba(255,255,255,0.15)" }}>SR</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 11, color: accent, fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 5 }}>Developer · Builder</div>
                      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>Sueep Rathod</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 14, lineHeight: 1.6 }}>
                        Full-stack developer passionate about using technology for real-world impact. Built AirLens to make air quality data accessible, beautiful, and actionable for everyone.
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                        {["Python", "Flask", "React", "ML", "scikit-learn", "Data Science", "UI/UX"].map(skill => (
                          <span key={skill} style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>{skill}</span>
                        ))}
                      </div>
                      {/* Social links */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[
                          { label: "GitHub", icon: "🐙", url: "https://github.com/sueep-rathod", color: "rgba(255,255,255,0.7)" },
                          { label: "LinkedIn", icon: "💼", url: "https://linkedin.com/in/sueep-rathod", color: "#5aadff" },
                          { label: "Twitter", icon: "🐦", url: "https://twitter.com/sueep_rathod", color: "#1d9bf0" },
                          { label: "Email", icon: "📧", url: "mailto:sueep.rathod@example.com", color: accent },
                          { label: "Instagram", icon: "📸", url: "https://instagram.com/sueep.rathod", color: "#f98ab4" },
                        ].map(s => (
                          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: s.color, textDecoration: "none", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }}>
                            {s.icon} {s.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* App info */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: "🌍", label: "Cities tracked", value: "12 global cities" },
                    { icon: "🔬", label: "AQI standard", value: "US EPA (0–500 scale)" },
                    { icon: "🤖", label: "AI assistant", value: "ARIA — powered by Claude" },
                    { icon: "⚡", label: "Built with", value: "Flask · React · scikit-learn" },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 3, fontFamily: "monospace" }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", padding: "1rem 0" }}>
                  Built with ♥ by Sueep Rathod · AirLens AI · EPA AQI Standard · Open Source
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ARIA AI PANEL ── */}
        {showAI && (
          <div style={{ width: 350, borderLeft: "1px solid rgba(255,255,255,0.07)", background: "rgba(2,5,16,0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", animation: "slideRight 0.3s ease", position: "relative" }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, ${accent}, #bf5fff, #ff5f7e)` }} />
            <div style={{ padding: "0.9rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #bf5fff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>ARIA</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{speaking ? "🔊 Speaking…" : listening ? "🎙 Listening…" : "AI Air Quality Assistant"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a3ff47", animation: "pulse 1.5s infinite" }} />
                  <span style={{ fontSize: 9, color: "#a3ff47", fontFamily: "monospace" }}>LIVE</span>
                </div>
              </div>
              <button onClick={() => setShowAI(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 17, padding: 3 }}>✕</button>
            </div>

            {msgs.length === 0 && (
              <div style={{ padding: "0.9rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Try asking…</div>
                {["Which city has the worst air today?", "Is it safe to go jogging in Delhi?", "Explain PM2.5 simply", "What mask should I wear?"].map(q => (
                  <button key={q} onClick={() => doSend(q)} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 11px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 12, marginBottom: 5 }}>
                    {q} ↗
                  </button>
                ))}
              </div>
            )}

            <div style={{ flex: 1, overflowY: "auto", padding: "0.9rem 1.1rem", display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 7, flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "fadeUp 0.25s ease" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: m.role === "user" ? "linear-gradient(135deg,#bf5fff,#ff5f7e)" : `linear-gradient(135deg,${accent},#a3ff47)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>
                    {m.role === "user" ? (profile.name || "U")[0].toUpperCase() : "🤖"}
                  </div>
                  <div style={{ maxWidth: "82%", padding: "9px 12px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "rgba(191,95,255,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${m.role === "user" ? "rgba(191,95,255,0.2)" : "rgba(255,255,255,0.07)"}`, fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.88)", whiteSpace: "pre-wrap" }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoad && (
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #a3ff47)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>
                  <div style={{ padding: "9px 14px", borderRadius: "4px 14px 14px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 5 }}>
                    {[0, 0.18, 0.36].map(d => <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: accent, animation: `pulse 1s ${d}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={msgEnd} />
            </div>

            <div style={{ padding: "0.9rem 1.1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => { if (recRef.current && !listening) { setListening(true); recRef.current.start(); } }} style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${listening ? accent : "rgba(255,255,255,0.1)"}`, background: listening ? `${accent}18` : "rgba(255,255,255,0.04)", color: listening ? accent : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: listening ? "pulse 0.8s infinite" : "none" }}>🎙</button>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && doSend()}
                  placeholder="Ask ARIA anything…"
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                <button onClick={() => doSend()} disabled={aiLoad} style={{ width: 38, height: 38, borderRadius: 9, border: "none", background: aiLoad ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${accent}, #a3ff47)`, color: aiLoad ? "rgba(255,255,255,0.2)" : "#020510", cursor: aiLoad ? "not-allowed" : "pointer", fontSize: 16, flexShrink: 0 }}>↑</button>
              </div>
              {speaking && (
                <button onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false); }} style={{ marginTop: 7, width: "100%", padding: 6, borderRadius: 7, border: "1px solid rgba(255,95,126,0.25)", background: "rgba(255,95,126,0.07)", color: "#ff5f7e", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>⏹ Stop speaking</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && <ProfileModal profile={profile} onSave={saveProfile} onClose={() => setShowProfile(false)} />}
    </div>
  );
}

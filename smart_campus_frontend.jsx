import { useState, useCallback } from "react";

const INITIAL_STUDENTS = {
  "105": { id: "105", name: "Arjun", age: 21, scores: 85.0, grade: "B", remark: "Very Good", courses: [], fees: { tuition: 0, hostel: 0, transport: 0, total: 0 } },
  "102": { id: "102", name: "Meera", age: 20, scores: 92.0, grade: "A", remark: "Excellent", courses: [], fees: { tuition: 0, hostel: 0, transport: 0, total: 0 } },
};

const MAX_COURSES = 5;

function evaluateGrade(score) {
  if (score < 0 || score > 100) throw new Error("Score must be between 0 and 100.");
  if (score >= 90) return ["A", "Excellent"];
  if (score >= 75) return ["B", "Very Good"];
  if (score >= 60) return ["C", "Good"];
  if (score >= 40) return ["D", "Average"];
  return ["F", "Needs Improvement"];
}

function calculateFee(tuition, hostel = 0, transport = 0) {
  return tuition + hostel + transport;
}

function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
}

function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
    [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

function linearSearch(arr, t) { return arr.indexOf(t); }
function binarySearch(arr, t) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) return mid;
    arr[mid] < t ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}

const GRADE_COLOR = { A: "#1D9E75", B: "#378ADD", C: "#BA7517", D: "#D85A30", F: "#E24B4A" };
const GRADE_BG = { A: "#E1F5EE", B: "#E6F1FB", C: "#FAEEDA", D: "#FAECE7", F: "#FCEBEB" };

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏛️" },
  { id: "register", label: "Register", icon: "📝" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "fees", label: "Fees", icon: "💳" },
  { id: "records", label: "Records", icon: "📁" },
  { id: "sort", label: "Sort & Search", icon: "🔍" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];

function Badge({ grade }) {
  return (
    <span style={{ background: GRADE_BG[grade] || "#F1EFE8", color: GRADE_COLOR[grade] || "#5F5E5A", fontWeight: 600, fontSize: 13, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${GRADE_COLOR[grade] || "#5F5E5A"}33` }}>
      {grade}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "1.25rem 1.5rem", ...style }}>
      {children}
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "error" ? "#FCEBEB" : "#EAF3DE";
  const cl = type === "error" ? "#A32D2D" : "#3B6D11";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: bg, color: cl, border: `1px solid ${cl}44`, borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 500, zIndex: 999, maxWidth: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      {msg}
    </div>
  );
}

function Dashboard({ students }) {
  const all = Object.values(students);
  const total = all.length;
  const avg = total ? (all.reduce((s, x) => s + x.scores, 0) / total).toFixed(1) : 0;
  const topStudent = all.sort((a, b) => b.scores - a.scores)[0];
  const gradeCount = all.reduce((acc, s) => { acc[s.grade] = (acc[s.grade] || 0) + 1; return acc; }, {});

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Smart Campus Dashboard</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Overview of all registered students and performance metrics.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Students", value: total, icon: "👥" },
          { label: "Average Score", value: avg, icon: "📈" },
          { label: "Top Score", value: topStudent ? topStudent.scores : "—", icon: "🏆" },
          { label: "Grade A Students", value: gradeCount["A"] || 0, icon: "⭐" },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <Card><p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "2rem 0" }}>No students registered yet. Use <strong>Register</strong> to add one.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.values(students).sort((a, b) => b.scores - a.scores).map(s => (
            <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "1rem 1.25rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GRADE_BG[s.grade], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: GRADE_COLOR[s.grade], flexShrink: 0 }}>
                {s.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>{s.name}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>ID: {s.id} · Age: {s.age} · {s.courses.length} courses</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)" }}>{s.scores}</div>
                <Badge grade={s.grade} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RegisterStudent({ students, setStudents, showToast }) {
  const [form, setForm] = useState({ id: "", name: "", age: "", score: "" });
  const [result, setResult] = useState(null);

  const handle = () => {
    if (!form.id || !form.name) return showToast("ID and name are required.", "error");
    const age = parseInt(form.age);
    if (!age || age <= 0) return showToast("Invalid age.", "error");
    const score = parseFloat(form.score);
    let grade, remark;
    try { [grade, remark] = evaluateGrade(score); }
    catch (e) { return showToast(e.message, "error"); }

    const student = { id: form.id, name: form.name, age, scores: score, grade, remark, courses: students[form.id]?.courses || [], fees: students[form.id]?.fees || { tuition: 0, hostel: 0, transport: 0, total: 0 } };
    setStudents(prev => ({ ...prev, [form.id]: student }));
    setResult(student);
    showToast(`${form.id in students ? "Updated" : "Registered"} ${form.name} successfully!`, "success");
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Register Student</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Add a new student or update an existing record by entering the same ID.</p>
      <Card style={{ maxWidth: 480 }}>
        <div style={{ display: "grid", gap: 16 }}>
          {[["Student ID", "id", "e.g. 103"], ["Full Name", "name", "e.g. Priya Sharma"], ["Age", "age", "e.g. 20"], ["Exam Score (0–100)", "score", "e.g. 78.5"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
              <input type={key === "age" || key === "score" ? "number" : "text"} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
            </div>
          ))}
          <button onClick={handle} style={{ marginTop: 4, padding: "10px 20px", borderRadius: 8, background: "#1D9E75", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
            Register Student
          </button>
        </div>
      </Card>

      {result && (
        <Card style={{ marginTop: 20, maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: GRADE_BG[result.grade], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: GRADE_COLOR[result.grade] }}>{result.name[0]}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, color: "var(--color-text-primary)" }}>{result.name}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>ID: {result.id} · Age: {result.age}</div>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Score</div><div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>{result.scores}</div></div>
            <div><div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Grade</div><div style={{ marginTop: 4 }}><Badge grade={result.grade} /></div></div>
            <div style={{ gridColumn: "1/-1" }}><div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Remark</div><div style={{ fontSize: 15, fontWeight: 500, color: GRADE_COLOR[result.grade] }}>{result.remark}</div></div>
          </div>
        </Card>
      )}
    </div>
  );
}

function CourseEnrollment({ students, setStudents, showToast }) {
  const [selId, setSelId] = useState("");
  const [cName, setCName] = useState("");
  const [cCredits, setCCredits] = useState("");

  const addCourse = () => {
    if (!selId || !students[selId]) return showToast("Select a valid student.", "error");
    if (!cName.trim()) return showToast("Course name required.", "error");
    const cr = parseInt(cCredits);
    if (!cr || cr <= 0) return showToast("Credits must be a positive integer.", "error");
    const s = students[selId];
    if (s.courses.length >= MAX_COURSES) return showToast("Max 5 courses per student.", "error");
    setStudents(prev => ({ ...prev, [selId]: { ...s, courses: [...s.courses, [cName.trim(), cr]] } }));
    setCName(""); setCCredits("");
    showToast(`Added "${cName}" to ${s.name}`, "success");
  };

  const removeCourse = (i) => {
    const s = students[selId];
    setStudents(prev => ({ ...prev, [selId]: { ...s, courses: s.courses.filter((_, idx) => idx !== i) } }));
  };

  const s = students[selId];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Course Enrollment</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Manage up to {MAX_COURSES} course enrollments per student.</p>
      <Card style={{ maxWidth: 520 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Select Student</label>
        <select value={selId} onChange={e => setSelId(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", marginBottom: 18 }}>
          <option value="">— choose —</option>
          {Object.values(students).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
        </select>

        {s && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Course Name</label>
                <input placeholder="e.g. Mathematics" value={cName} onChange={e => setCName(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Credits</label>
                <input type="number" min="1" placeholder="4" value={cCredits} onChange={e => setCCredits(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
              </div>
            </div>
            <button onClick={addCourse} disabled={s.courses.length >= MAX_COURSES} style={{ padding: "9px 18px", borderRadius: 8, background: s.courses.length >= MAX_COURSES ? "#ccc" : "#378ADD", border: "none", color: "#fff", fontWeight: 600, cursor: s.courses.length >= MAX_COURSES ? "not-allowed" : "pointer", fontSize: 14 }}>
              + Add Course ({s.courses.length}/{MAX_COURSES})
            </button>

            <div style={{ marginTop: 20, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>Enrolled Courses</div>
              {s.courses.length === 0 ? <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>No courses yet.</p> : s.courses.map(([cn, cr], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{cn}</span>
                    <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 8 }}>{cr} credits</span>
                  </div>
                  <button onClick={() => removeCourse(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#E24B4A", lineHeight: 1 }}>×</button>
                </div>
              ))}
              {s.courses.length > 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 8 }}>Total credits: {s.courses.reduce((a, [, c]) => a + c, 0)}</div>}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function FeesModule({ students, setStudents, showToast }) {
  const [selId, setSelId] = useState("");
  const [fees, setFees] = useState({ tuition: "", hostel: "", transport: "" });

  const save = () => {
    if (!selId || !students[selId]) return showToast("Select a valid student.", "error");
    const t = parseInt(fees.tuition) || 0;
    const h = parseInt(fees.hostel) || 0;
    const tr = parseInt(fees.transport) || 0;
    if (t <= 0) return showToast("Tuition fee required.", "error");
    const total = calculateFee(t, h, tr);
    setStudents(prev => ({ ...prev, [selId]: { ...prev[selId], fees: { tuition: t, hostel: h, transport: tr, total } } }));
    showToast(`Fees saved for ${students[selId].name}: ₹${total.toLocaleString()}`, "success");
  };

  const s = students[selId];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Fee Calculation</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Calculate and store the total fee for a student.</p>
      <Card style={{ maxWidth: 460 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Select Student</label>
        <select value={selId} onChange={e => { setSelId(e.target.value); if (students[e.target.value]) setFees(students[e.target.value].fees); }} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", marginBottom: 18 }}>
          <option value="">— choose —</option>
          {Object.values(students).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
        </select>

        {[["Tuition Fee (₹)", "tuition"], ["Hostel Fee (₹)", "hostel"], ["Transport Fee (₹)", "transport"]].map(([label, key]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="number" min="0" value={fees[key]} onChange={e => setFees(f => ({ ...f, [key]: e.target.value }))} placeholder="0" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
          </div>
        ))}

        <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Estimated Total</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#1D9E75" }}>₹{calculateFee(parseInt(fees.tuition) || 0, parseInt(fees.hostel) || 0, parseInt(fees.transport) || 0).toLocaleString()}</span>
        </div>
        <button onClick={save} style={{ padding: "10px 20px", borderRadius: 8, background: "#1D9E75", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Save Fees</button>

        {s && s.fees.total > 0 && (
          <div style={{ marginTop: 16, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Stored Record</div>
            {[["Tuition", s.fees.tuition], ["Hostel", s.fees.hostel], ["Transport", s.fees.transport], ["Total", s.fees.total]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14, borderBottom: k === "Transport" ? "0.5px solid var(--color-border-tertiary)" : "none", fontWeight: k === "Total" ? 600 : 400, color: "var(--color-text-primary)" }}>
                <span style={{ color: k === "Total" ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{k}</span>
                <span>₹{v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function RecordsModule({ students }) {
  const all = Object.values(students);
  const total = all.length;
  const avg = total ? (all.reduce((s, x) => s + x.scores, 0) / total).toFixed(1) : 0;
  const top = all.sort((a, b) => b.scores - a.scores)[0];

  const names = new Set(all.map(s => s.name));
  const arr = [...names];
  const eventA = new Set(arr.filter((_, i) => i % 2 === 0));
  const eventB = new Set(arr.filter((_, i) => i % 2 !== 0));
  const common = [...eventA].filter(n => eventB.has(n));
  const onlyA = [...eventA].filter(n => !eventB.has(n));
  const onlyB = [...eventB].filter(n => !eventA.has(n));

  const download = () => {
    const lines = ["ID,Name,Marks", ...all.map(s => `${s.id},${s.name},${Math.round(s.scores)}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "student_records.txt"; a.click();
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Academic Records & Event Analysis</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>All student records and set-based event participation analysis.</p>

      {total === 0 ? <Card><p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "2rem 0" }}>No records yet.</p></Card> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[["Total", total, "👥"], ["Average", avg, "📊"], ["Top Student", top?.name, "🏆"], ["Top Score", top?.scores, "⭐"]].map(([l, v, i]) => (
              <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{i}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)", marginTop: 4 }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, background: "var(--color-background-primary)", borderRadius: 12, overflow: "hidden", border: "0.5px solid var(--color-border-tertiary)" }}>
              <thead>
                <tr style={{ background: "var(--color-background-secondary)" }}>
                  {["ID", "Name", "Age", "Score", "Grade", "Remark", "Courses", "Total Fees"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {all.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: "0.5px solid var(--color-border-tertiary)", background: i % 2 ? "var(--color-background-secondary)" : "var(--color-background-primary)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)", fontFamily: "monospace" }}>{s.id}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 500, color: "var(--color-text-primary)" }}>{s.name}</td>
                    <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{s.age}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{s.scores}</td>
                    <td style={{ padding: "10px 14px" }}><Badge grade={s.grade} /></td>
                    <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{s.remark}</td>
                    <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{s.courses.length}</td>
                    <td style={{ padding: "10px 14px", color: "var(--color-text-primary)" }}>{s.fees.total ? `₹${s.fees.total.toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 14 }}>Event Participation Analysis (Set Operations)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["Event A", [...eventA]], ["Event B", [...eventB]]].map(([lbl, set]) => (
                <div key={lbl} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>{lbl}</div>
                  <div style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{set.length > 0 ? set.join(", ") : "—"}</div>
                </div>
              ))}
            </div>
            {[["∩ Common (A & B)", common], ["A only (A − B)", onlyA], ["B only (B − A)", onlyB]].map(([lbl, set]) => (
              <div key={lbl} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "0.5px solid var(--color-border-tertiary)", fontSize: 14 }}>
                <span style={{ color: "var(--color-text-secondary)", minWidth: 160 }}>{lbl}</span>
                <span style={{ color: "var(--color-text-primary)" }}>{set.length > 0 ? set.join(", ") : "∅"}</span>
              </div>
            ))}
          </Card>

          <button onClick={download} style={{ padding: "10px 20px", borderRadius: 8, background: "none", border: "1px solid var(--color-border-tertiary)", color: "var(--color-text-primary)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
            ⬇ Download student_records.txt
          </button>
        </>
      )}
    </div>
  );
}

function SortSearch({ students }) {
  const [sortedBubble, setSortedBubble] = useState([]);
  const [sortedSel, setSortedSel] = useState([]);
  const [query, setQuery] = useState("");
  const [lResult, setLResult] = useState(null);
  const [bResult, setBResult] = useState(null);
  const [ran, setRan] = useState(false);

  const ids = Object.keys(students);
  const numIds = ids.map(id => { const n = parseInt(id); return isNaN(n) ? Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 1e6 : n; });
  const mapping = Object.fromEntries(ids.map((id, i) => [numIds[i], id]));

  const runSort = () => {
    setSortedBubble(bubbleSort(numIds));
    setSortedSel(selectionSort(numIds));
    setRan(true);
    setLResult(null); setBResult(null);
  };

  const runSearch = () => {
    const t = query.trim();
    if (!t) return;
    const tNum = parseInt(t);
    const tVal = isNaN(tNum) ? Math.abs(t.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 1e6 : tNum;
    const li = linearSearch(sortedBubble, tVal);
    const bi = binarySearch(sortedBubble, tVal);
    setLResult({ idx: li, id: li !== -1 ? mapping[tVal] : null });
    setBResult({ idx: bi, id: bi !== -1 ? mapping[tVal] : null });
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Sort & Search Student IDs</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Bubble sort, selection sort, linear search, and binary search on student IDs.</p>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          Registered IDs: <span style={{ fontFamily: "monospace", color: "var(--color-text-primary)" }}>{ids.join(", ") || "—"}</span>
        </div>
        <button onClick={runSort} disabled={ids.length === 0} style={{ padding: "9px 20px", borderRadius: 8, background: "#378ADD", border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Run Sorting Algorithms
        </button>
      </Card>

      {ran && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[["Bubble Sort", sortedBubble], ["Selection Sort", sortedSel]].map(([lbl, arr]) => (
            <Card key={lbl}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>{lbl}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {arr.map((v, i) => (
                  <span key={i} style={{ background: "#E6F1FB", color: "#185FA5", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontFamily: "monospace" }}>{mapping[v]}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {ran && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 12 }}>Search (on sorted array)</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input placeholder="Enter student ID" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && runSearch()} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 15, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
            <button onClick={runSearch} style={{ padding: "9px 18px", borderRadius: 8, background: "#378ADD", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Search</button>
          </div>
          {lResult !== null && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Linear Search", lResult], ["Binary Search", bResult]].map(([lbl, r]) => (
                <div key={lbl} style={{ padding: "12px 14px", borderRadius: 10, background: r.idx !== -1 ? "#EAF3DE" : "#FCEBEB", border: `1px solid ${r.idx !== -1 ? "#3B6D1133" : "#A32D2D33"}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{lbl}</div>
                  {r.idx !== -1
                    ? <div style={{ fontSize: 14, color: "#3B6D11" }}>Found: <strong>{r.id}</strong> at index {r.idx}</div>
                    : <div style={{ fontSize: 14, color: "#A32D2D" }}>Not found</div>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function Analytics({ students }) {
  const all = Object.values(students);
  if (all.length === 0) return <Card><p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "2rem 0" }}>No students to analyze.</p></Card>;

  const subjects = ["Math", "Science", "English"];
  const data = all.map(s => ({ name: s.name, Math: s.scores, Science: s.scores, English: s.scores }));
  const means = subjects.map(sub => (data.reduce((a, r) => a + r[sub], 0) / data.length).toFixed(1));
  const maxSubj = (sub) => data.reduce((top, r) => r[sub] > top.score ? { name: r.name, score: r[sub] } : top, { name: "", score: -1 });

  const BAR_W = 500, BAR_H = 180;
  const maxScore = 100;
  const barWidth = BAR_W / (data.length * subjects.length + data.length + 1);
  const COLORS = ["#378ADD", "#1D9E75", "#BA7517"];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Performance Analytics</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 15, marginBottom: 24 }}>Statistical analysis and visualizations — mirroring the NumPy/Pandas/Matplotlib Q8 module.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {subjects.map((sub, i) => (
          <Card key={sub}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{sub} — Top Performer</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)" }}>{maxSubj(sub).name}</div>
            <div style={{ fontSize: 13, color: COLORS[i], fontWeight: 500 }}>{maxSubj(sub).score} pts</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 16 }}>Average Scores per Subject</div>
        <svg viewBox={`0 0 ${BAR_W} ${BAR_H + 40}`} style={{ width: "100%", height: "auto" }}>
          {subjects.map((sub, i) => {
            const val = parseFloat(means[i]);
            const h = (val / maxScore) * BAR_H;
            const x = (BAR_W / subjects.length) * i + (BAR_W / subjects.length / 2) - 28;
            return (
              <g key={sub}>
                <rect x={x} y={BAR_H - h} width={56} height={h} fill={COLORS[i]} rx={4} opacity={0.85} />
                <text x={x + 28} y={BAR_H - h - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={COLORS[i]}>{means[i]}</text>
                <text x={x + 28} y={BAR_H + 18} textAnchor="middle" fontSize={12} fill="var(--color-text-secondary)">{sub}</text>
              </g>
            );
          })}
        </svg>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 16 }}>Student Performance Comparison</div>
        <svg viewBox={`0 0 ${BAR_W} ${BAR_H + 50}`} style={{ width: "100%", height: "auto" }}>
          {data.map((row, si) => {
            const groupW = BAR_W / (data.length + 1);
            const groupX = groupW * (si + 0.5);
            return subjects.map((sub, ji) => {
              const val = row[sub];
              const h = (val / maxScore) * BAR_H;
              const bw = groupW / subjects.length * 0.8;
              const x = groupX - groupW * 0.3 + ji * (groupW / subjects.length);
              return (
                <g key={`${si}-${ji}`}>
                  <rect x={x} y={BAR_H - h} width={bw} height={h} fill={COLORS[ji]} rx={2} opacity={0.8} />
                </g>
              );
            }).concat(
              <text key={`label-${si}`} x={groupX + groupW * 0.1} y={BAR_H + 18} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)">{row.name}</text>
            );
          })}
          {subjects.map((sub, i) => (
            <g key={`leg-${i}`}>
              <rect x={i * 100 + 10} y={BAR_H + 30} width={12} height={12} fill={COLORS[i]} rx={2} />
              <text x={i * 100 + 28} y={BAR_H + 41} fontSize={11} fill="var(--color-text-secondary)">{sub}</text>
            </g>
          ))}
        </svg>
      </Card>

      <Card>
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 14 }}>Statistical Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>{["Metric", ...subjects].map(h => <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ["Mean", means],
              ["Median", subjects.map(sub => { const vals = data.map(r => r[sub]).sort((a, b) => a - b); const mid = Math.floor(vals.length / 2); return vals.length % 2 ? vals[mid].toFixed(1) : ((vals[mid - 1] + vals[mid]) / 2).toFixed(1); })],
              ["Std Dev", subjects.map(sub => { const vals = data.map(r => r[sub]); const m = vals.reduce((a, v) => a + v, 0) / vals.length; return Math.sqrt(vals.reduce((a, v) => a + (v - m) ** 2, 0) / vals.length).toFixed(2); })],
            ].map(([metric, vals]) => (
              <tr key={metric} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                <td style={{ padding: "8px 10px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{metric}</td>
                {vals.map((v, i) => <td key={i} style={{ padding: "8px 10px", fontWeight: 500, color: "var(--color-text-primary)" }}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }, []);

  const pages = {
    dashboard: <Dashboard students={students} />,
    register: <RegisterStudent students={students} setStudents={setStudents} showToast={showToast} />,
    courses: <CourseEnrollment students={students} setStudents={setStudents} showToast={showToast} />,
    fees: <FeesModule students={students} setStudents={setStudents} showToast={showToast} />,
    records: <RecordsModule students={students} />,
    sort: <SortSearch students={students} />,
    analytics: <Analytics students={students} />,
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", padding: "1.5rem 1rem", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Smart Campus</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Information System</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, background: activeTab === item.id ? "#E1F5EE" : "none", color: activeTab === item.id ? "#0F6E56" : "var(--color-text-secondary)", transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12, fontSize: 12, color: "var(--color-text-secondary)" }}>
          {Object.keys(students).length} student{Object.keys(students).length !== 1 ? "s" : ""} registered
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto", maxWidth: 860 }}>
        {pages[activeTab]}
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}

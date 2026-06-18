import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../common/adminlayout/AdminSidebar";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIDEBAR_W = 256;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS = [
  { key:"products",   label:"Total Products",    value:148, change:"+12", positive:true,
    accent:"#FF3B30",
    icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  },
  { key:"categories", label:"Active Categories", value:9,   change:"+2",  positive:true,
    accent:"#3B82F6",
    icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  { key:"leads",      label:"New Leads",          value:37,  change:"+8",  positive:true,
    accent:"#10B981",
    icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  { key:"inquiries",  label:"Monthly Inquiries",  value:214, change:"-3",  positive:false,
    accent:"#F59E0B",
    icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
];

// LEADS and PRODUCTS are now loaded live from localStorage inside AdminDashboard component

const BAR_DATA = [
  {m:"Jan",v:38},{m:"Feb",v:52},{m:"Mar",v:45},{m:"Apr",v:70},{m:"May",v:88},
  {m:"Jun",v:65},{m:"Jul",v:94},{m:"Aug",v:110},{m:"Sep",v:78},{m:"Oct",v:130},
  {m:"Nov",v:115},{m:"Dec",v:142},
];

const DONUT_DATA = [
  {label:"Jerseys",    pct:35, color:"#FF3B30"},
  {label:"Track Pants",pct:22, color:"#3B82F6"},
  {label:"T-Shirts",   pct:18, color:"#10B981"},
  {label:"Hoodies",    pct:14, color:"#F59E0B"},
  {label:"Others",     pct:11, color:"#8B5CF6"},
];

const NOTIFS = [
  { id:1, icon:"🆕", color:"#3B82F6", text:"New lead from City Football Club",         time:"2 min ago",  read:false },
  { id:2, icon:"✅", color:"#10B981", text:"Bulk order #BO-2047 confirmed",             time:"25 min ago", read:false },
  { id:3, icon:"📦", color:"#F59E0B", text:"Victory Hoodie is running Low Stock",      time:"1 hr ago",   read:false },
  { id:4, icon:"💬", color:"#FF3B30", text:"New testimonial by Pune Cricket Club",     time:"3 hr ago",   read:true  },
  { id:5, icon:"🔧", color:"#8B5CF6", text:"Category 'Custom Team Kits' updated",     time:"5 hr ago",   read:true  },
];

// ALL_SEARCH is now computed live inside SearchBox from localStorage

// ACTIVITY is now generated live inside AdminDashboard component

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const getIconSvg = (key, size = 18, color = "currentColor") => {
  switch (key) {
    case "🆕":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6M16 11h6" />
        </svg>
      );
    case "✅":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "📦":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "💬":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    case "🔧":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    case "👤":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "🏠":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "🗂":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      );
    case "📋":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      );
    case "🥇":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.38 3.46L16 2H8L3.62 3.46a2 2 0 00-1.34 2.23l1.5 10a2 2 0 002 1.7h13.44a2 2 0 002-1.7l1.5-10a2 2 0 00-1.34-2.23z" />
          <path d="M12 2v15" />
          <path d="M9 8h6" />
        </svg>
      );
    case "👖":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 2h12v3l-1 14a2 2 0 01-2 2h-6a2 2 0 01-2-2L6 5V2z" />
          <path d="M12 5v16" />
          <path d="M6 7h12" />
        </svg>
      );
    case "🧥":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 18V9a4 4 0 014-4h8a4 4 0 014 4v9a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
          <path d="M12 5v15" />
          <path d="M9 8h6" />
          <path d="M4 9l4 2M20 9l-4 2" />
        </svg>
      );
    case "🩳":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 2h12v4l-1 9a1 1 0 01-1 1h-3.5L12 12l-.5 4H7a1 1 0 01-1-1L5 6V2z" />
          <path d="M12 2v10" />
        </svg>
      );
    case "🏃":
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 22V14a3 3 0 00-3-3H9a3 3 0 00-3 3v8" />
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v3" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 17v-5h6v5" />
        </svg>
      );
  }
};

// ─── Small components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const MAP = {
    New:        { bg:"rgba(59,130,246,0.14)", color:"#3B82F6", border:"rgba(59,130,246,0.3)" },
    "Follow Up":{ bg:"rgba(245,158,11,0.14)", color:"#F59E0B", border:"rgba(245,158,11,0.3)" },
    Converted:  { bg:"rgba(16,185,129,0.14)", color:"#10B981", border:"rgba(16,185,129,0.3)" },
    Pending:    { bg:"rgba(156,163,175,0.14)",color:"#9CA3AF", border:"rgba(156,163,175,0.3)"},
  };
  const s = MAP[status] || MAP.Pending;
  return (
    <span style={{ padding:"3px 9px", borderRadius:"20px", fontSize:"11px", fontWeight:600,
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>
      {status}
    </span>
  );
};

const StockDot = ({ stock }) => {
  const c = stock==="In Stock"?"#10B981":stock==="Low Stock"?"#F59E0B":"#FF3B30";
  return <span style={{ color:c, fontSize:"12px", fontWeight:600, fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>● {stock}</span>;
};

const AnimCounter = ({ target, duration=1400 }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = target / (duration / 16);
      const t = setInterval(() => {
        start += step;
        if (start >= target) { setN(target); clearInterval(t); }
        else setN(Math.floor(start));
      }, 16);
    }, { threshold:0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
};

// Card with scroll reveal
const Card = ({ children, style={}, delay=0, className="" }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={`csw-card ${className}`} style={{
      background:"rgba(255,255,255,0.035)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:"16px", padding:"20px",
      backdropFilter:"blur(8px)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition:`opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// Bar chart
const BarChart = () => {
  const max = Math.max(...BAR_DATA.map(d=>d.v));
  const [anim, setAnim] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting){ setAnim(true); obs.disconnect();} }, {threshold:0.2});
    if (ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{ display:"flex", alignItems:"flex-end", gap:"6px", height:"130px", padding:"0 2px" }}>
      {BAR_DATA.map((d,i)=>(
        <div key={d.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
          <div style={{
            width:"100%",
            height: anim ? `${(d.v/max)*112}px` : "0",
            background: i===9 ? "#FF3B30" : "linear-gradient(180deg,#FF3B30 0%,rgba(255,59,48,0.25) 100%)",
            borderRadius:"4px 4px 0 0",
            transition:`height 0.75s cubic-bezier(0.4,0,0.2,1) ${i*0.042}s`,
            boxShadow: i===9 ? "0 0 14px rgba(255,59,48,0.45)" : "none",
          }}/>
          <span style={{ fontSize:"8.5px", color:"rgba(255,255,255,0.35)", fontFamily:"'Poppins',sans-serif" }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
};

// Donut chart
const DonutChart = () => {
  const [anim, setAnim] = useState(false);
  const ref = useRef(null);
  const SIZE=120, SW=18, R=(SIZE-SW)/2, C=2*Math.PI*R;
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setAnim(true);obs.disconnect();}},{threshold:0.2});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  let cum=0;
  const segs=DONUT_DATA.map(d=>{
    const offset=C-(d.pct/100)*C;
    const rot=(cum/100)*360-90;
    cum+=d.pct;
    return {...d,offset,rot};
  });
  return (
    <div ref={ref} style={{display:"flex",alignItems:"center",gap:"20px",flexWrap:"wrap"}}>
      <div style={{position:"relative",flexShrink:0}}>
        <svg width={SIZE} height={SIZE}>
          <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={SW}/>
          {segs.map((s,i)=>(
            <circle key={s.label}
              cx={SIZE/2} cy={SIZE/2} r={R} fill="none"
              stroke={s.color} strokeWidth={SW}
              strokeDasharray={`${anim ? C-s.offset : 0} ${C}`}
              transform={`rotate(${s.rot} ${SIZE/2} ${SIZE/2})`}
              style={{transition:`stroke-dasharray 0.9s ease ${i*0.13}s`}}
            />
          ))}
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          <span style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:"15px",color:"#fff"}}>100%</span>
          <span style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",fontFamily:"'Poppins',sans-serif"}}>Total</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
        {DONUT_DATA.map(d=>(
          <div key={d.label} style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"9px",height:"9px",borderRadius:"2px",background:d.color,flexShrink:0}}/>
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.65)",fontFamily:"'Poppins',sans-serif",flex:1}}>{d.label}</span>
            <span style={{fontSize:"12px",fontWeight:600,color:"#fff",fontFamily:"'Montserrat',sans-serif",paddingLeft:"8px"}}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// StatCard
const StatCard = ({ stat, delay }) => {
  const [ref, visible] = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.035)",
        border:`1px solid ${hov ? "rgba(255,59,48,0.35)" : "rgba(255,255,255,0.08)"}`,
        borderRadius:"16px", padding:"20px",
        opacity: visible ? 1 : 0,
        transform: visible ? (hov?"translateY(-4px)":"translateY(0)") : "translateY(22px)",
        transition:`opacity 0.5s ease ${delay}s, transform 0.45s cubic-bezier(0.4,0,0.2,1) ${visible?0:delay}s, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease`,
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${stat.accent}22` : "none",
        cursor:"pointer", position:"relative", overflow:"hidden",
      }}>
      {/* Top accent line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2.5px",
        background:`linear-gradient(90deg,${stat.accent},transparent)`,
        opacity: hov ? 1 : 0.6, transition:"opacity 0.25s ease"}}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
        <div style={{
          width:"42px",height:"42px",borderRadius:"11px",
          background:`${stat.accent}18`, border:`1px solid ${stat.accent}30`,
          display:"flex",alignItems:"center",justifyContent:"center",color:stat.accent,
          transition:"transform 0.25s ease",
          transform: hov ? "scale(1.08)" : "scale(1)",
        }}>
          {stat.icon}
        </div>
        <span style={{
          fontSize:"11px",fontWeight:600,
          color: stat.positive?"#10B981":"#FF3B30",
          background: stat.positive?"rgba(16,185,129,0.12)":"rgba(255,59,48,0.12)",
          border:`1px solid ${stat.positive?"rgba(16,185,129,0.28)":"rgba(255,59,48,0.28)"}`,
          borderRadius:"8px", padding:"3px 8px",
          fontFamily:"'Poppins',sans-serif",
        }}>
          {stat.positive?"▲":"▼"} {stat.change}
        </span>
      </div>
      <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:800,fontSize:"30px",color:"#fff",marginBottom:"4px",lineHeight:1}}>
        <AnimCounter target={stat.value}/>
      </p>
      <p style={{color:"rgba(255,255,255,0.42)",fontSize:"12px",fontFamily:"'Poppins',sans-serif"}}>{stat.label}</p>
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildLiveNotifs() {
  const items = [];
  try {
    const leads = JSON.parse(localStorage.getItem("csw_admin_leads") || "[]");
    const orders = JSON.parse(localStorage.getItem("csw_admin_bulk_orders") || "[]");
    const prods  = JSON.parse(localStorage.getItem("csw_admin_products") || "[]");
    const tests  = JSON.parse(localStorage.getItem("csw_admin_testimonials") || "[]");

    // New leads
    leads.filter(l => l.status === "New").slice(0, 3).forEach((l, i) => items.push({
      id: `lead-${i}`, icon: "🆕", color: "#3B82F6", read: false,
      text: `New lead from ${l.name}${l.org ? ` — ${l.org}` : ""}`,
      time: l.date || "Recently",
    }));
    // Bulk orders pending
    orders.filter(o => o.status === "New" || o.status === "Pending").slice(0, 2).forEach((o, i) => items.push({
      id: `order-${i}`, icon: "✅", color: "#10B981", read: false,
      text: `Bulk order from ${o.name || o.org || "a client"} is ${o.status}`,
      time: o.deliveryDate || "Recently",
    }));
    // Low / Out of stock products
    prods.filter(p => p.stockStatus === "Low Stock" || p.stockStatus === "Out of Stock").slice(0, 2).forEach((p, i) => items.push({
      id: `stock-${i}`, icon: "📦", color: "#F59E0B", read: true,
      text: `'${p.name}' is ${p.stockStatus}`,
      time: "Recently",
    }));
    // New testimonials
    tests.filter(t => t.status === "Pending").slice(0, 2).forEach((t, i) => items.push({
      id: `test-${i}`, icon: "💬", color: "#FF3B30", read: true,
      text: `New testimonial pending from ${t.name} — ${t.rating || 5}★`,
      time: t.date || "Recently",
    }));
  } catch {}
  // Fallback when no real data
  if (items.length === 0) {
    items.push({ id: "empty", icon: "🔧", color: "#8B5CF6", read: true,
      text: "No notifications yet — they'll appear as you add leads, orders and products.",
      time: ""
    });
  }
  return items;
}

// ─── All Notifications Full Modal ────────────────────────────────────────────
const AllNotifsModal = ({ notifs, onClose }) => (
  <div
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
      backdropFilter: "blur(4px)",
    }}>
    <div style={{
      background: "#0d1f35",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      width: "100%", maxWidth: "480px",
      maxHeight: "85vh",
      display: "flex", flexDirection: "column",
      boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
      animation: "csw-fadein 0.25s ease both",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:"16px", color:"#fff", margin:0 }}>All Notifications</p>
          <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:"2px 0 0", fontFamily:"'Poppins',sans-serif" }}>{notifs.length} total</p>
        </div>
        <button onClick={onClose}
          style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"8px",
            width:"32px", height:"32px", cursor:"pointer", color:"rgba(255,255,255,0.7)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      {/* List */}
      <div style={{ overflowY:"auto", flex:1 }}>
        {notifs.map((n, i) => (
          <div key={n.id} style={{
            display:"flex", gap:"14px", alignItems:"flex-start",
            padding:"14px 22px",
            background: n.read ? "transparent" : "rgba(255,59,48,0.05)",
            borderBottom: i < notifs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"10px", flexShrink:0,
              background:`${n.color}18`, border:`1px solid ${n.color}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>{getIconSvg(n.icon, 16, n.color)}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"13px", color: n.read ? "rgba(255,255,255,0.6)" : "#fff",
                margin:"0 0 4px", fontFamily:"'Poppins',sans-serif", lineHeight:1.4 }}>{n.text}</p>
              <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", margin:0, fontFamily:"'Poppins',sans-serif" }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#FF3B30", marginTop:"6px", flexShrink:0 }}/>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Notification Panel ───────────────────────────────────────────────────────
const NotifPanel = ({ onClose, onViewAll, notifs, setNotifs }) => {
  const markAll = () => setNotifs(n => n.map(x => ({...x, read:true})));
  const unread = notifs.filter(n => !n.read).length;
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="csw-notif-panel" style={{
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: "340px",
      maxWidth: "calc(100vw - 24px)",
      background: "#0d1f35",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      zIndex: 200,
      animation: "csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 18px 12px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:"14px", color:"#fff", margin:0 }}>Notifications</p>
          {unread > 0 && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:0, fontFamily:"'Poppins',sans-serif" }}>{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            style={{ background:"none", border:"none", color:"#FF3B30",
              fontSize:"11px", fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif",
              padding:"4px 8px", borderRadius:"6px", transition:"background 0.2s ease" }}
            onMouseEnter={e => e.target.style.background = "rgba(255,59,48,0.1)"}
            onMouseLeave={e => e.target.style.background = "none"}
          >Mark all read</button>
        )}
      </div>
      {/* List */}
      <div style={{ maxHeight:"300px", overflowY:"auto" }}>
        {notifs.slice(0, 5).map((n, i) => (
          <div key={n.id}
            onClick={() => setNotifs(arr => arr.map(x => x.id === n.id ? {...x, read:true} : x))}
            style={{
              display:"flex", gap:"12px", alignItems:"flex-start",
              padding:"13px 18px",
              background: n.read ? "transparent" : "rgba(255,59,48,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              cursor:"pointer", transition:"background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(255,59,48,0.04)"}
          >
            <div style={{
              width:"34px", height:"34px", borderRadius:"9px", flexShrink:0,
              background:`${n.color}18`, border:`1px solid ${n.color}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>{getIconSvg(n.icon, 16, n.color)}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:"12.5px", color: n.read ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)",
                margin:"0 0 3px", fontFamily:"'Poppins',sans-serif", lineHeight:1.4,
                overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box",
                WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{n.text}</p>
              <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", margin:0, fontFamily:"'Poppins',sans-serif" }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#FF3B30", marginTop:"4px", flexShrink:0 }}/>}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{ padding:"12px 18px", borderTop:"1px solid rgba(255,255,255,0.08)", textAlign:"center" }}>
        <button
          onClick={onViewAll}
          style={{ background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.2)",
            color:"#FF3B30", fontSize:"12px", cursor:"pointer", fontFamily:"'Poppins',sans-serif",
            padding:"7px 18px", borderRadius:"8px", fontWeight:500,
            transition:"all 0.2s ease", width:"100%" }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,59,48,0.18)"; e.target.style.borderColor = "rgba(255,59,48,0.45)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,59,48,0.08)"; e.target.style.borderColor = "rgba(255,59,48,0.2)"; }}
        >View all notifications ({notifs.length}) →</button>
      </div>
    </div>
  );
};

// ─── Search Panel ─────────────────────────────────────────────────────────────
const SearchPanel = ({ query, setQuery, onClose }) => {
  const ref = useRef(null);
  const inputRef = useRef(null);

  // Build search index live from localStorage
  const allSearch = (() => {
    const pages = [
      { type:"Page", label:"Dashboard",   sub:"Overview",         icon:"🏠" },
      { type:"Page", label:"Products",    sub:"Manage products",   icon:"📦" },
      { type:"Page", label:"Categories",  sub:"Manage categories", icon:"🗂" },
      { type:"Page", label:"Bulk Orders", sub:"B2B requests",      icon:"📋" },
      { type:"Page", label:"Leads",       sub:"View inquiries",    icon:"👤" },
      { type:"Page", label:"Testimonials",sub:"Reviews",           icon:"💬" },
    ];
    try {
      const leads = JSON.parse(localStorage.getItem("csw_admin_leads") || "[]");
      const prods = JSON.parse(localStorage.getItem("csw_admin_products") || "[]");
      return [
        ...leads.map(l => ({ type:"Lead",    label:l.name,    sub:l.org || l.company || "", icon:"👤" })),
        ...prods.map(p => ({ type:"Product", label:p.name,    sub:p.category || "",         icon:"📦" })),
        ...pages,
      ];
    } catch {
      return pages;
    }
  })();

  const results = query.trim().length >= 1
    ? allSearch.filter(x=>
        x.label.toLowerCase().includes(query.toLowerCase()) ||
        x.sub.toLowerCase().includes(query.toLowerCase())
      ).slice(0,7)
    : [];

  useEffect(()=>{ inputRef.current?.focus(); },[]);
  useEffect(()=>{
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[onClose]);

  return (
    <div ref={ref} className="csw-search-panel" style={{
      position:"absolute", top:"calc(100% + 10px)",
      left:"50%", transform:"translateX(-50%)",
      width:"440px", maxWidth:"95vw",
      background:"#0d1f35",
      border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:"16px",
      boxShadow:"0 20px 60px rgba(0,0,0,0.6)",
      zIndex:200,
      animation:"csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
      overflow:"hidden",
    }}>
      {/* Input */}
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"14px 16px",
        borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search products, leads, pages…"
          style={{flex:1,background:"none",border:"none",outline:"none",
            color:"#fff",fontSize:"14px",fontFamily:"'Poppins',sans-serif"}}
        />
        {query && (
          <button onClick={()=>setQuery("")}
            style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"16px",lineHeight:1}}>×</button>
        )}
      </div>
      {/* Results */}
      {results.length>0 ? (
        <div style={{maxHeight:"280px",overflowY:"auto"}}>
          {results.map((r,i)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:"12px",
              padding:"11px 16px",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
              cursor:"pointer",transition:"background 0.18s ease",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <span style={{display:"flex",alignItems:"center",color:"rgba(255,255,255,0.6)",flexShrink:0}}>{getIconSvg(r.icon, 16)}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:"13px",fontWeight:500,color:"#fff",margin:"0 0 2px",fontFamily:"'Poppins',sans-serif"}}>{r.label}</p>
                <p style={{fontSize:"11px",color:"rgba(255,255,255,0.38)",margin:0,fontFamily:"'Poppins',sans-serif"}}>{r.sub}</p>
              </div>
              <span style={{
                fontSize:"10px",fontWeight:600,padding:"2px 8px",borderRadius:"20px",
                background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",
                fontFamily:"'Poppins',sans-serif",
              }}>{r.type}</span>
            </div>
          ))}
        </div>
      ) : query.trim().length >= 1 ? (
        <div style={{padding:"24px",textAlign:"center",color:"rgba(255,255,255,0.38)",fontFamily:"'Poppins',sans-serif",fontSize:"13px"}}>
          No results for "{query}"
        </div>
      ) : (
        <div style={{padding:"16px 18px"}}>
          <p style={{fontSize:"10.5px",fontWeight:600,letterSpacing:"1.4px",textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)",fontFamily:"'Poppins',sans-serif",marginBottom:"10px"}}>Quick Links</p>
          {["Dashboard","Products","Leads","Bulk Orders"].map(l=>(
            <div key={l} style={{
              display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",
              borderRadius:"9px",cursor:"pointer",transition:"background 0.18s ease",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,0.65)",fontFamily:"'Poppins',sans-serif"}}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Section header helper ────────────────────────────────────────────────────
const SectionHead = ({title, sub, action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"8px"}}>
    <div>
      <h3 style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:"14px",color:"#fff",margin:0}}>{title}</h3>
      {sub && <p style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",fontFamily:"'Poppins',sans-serif",margin:"2px 0 0"}}>{sub}</p>}
    </div>
    {action}
  </div>
);

const ViewAllBtn = ({label="View All", red=false, onClick}) => (
  <button onClick={onClick} style={{
    background: red?"rgba(255,59,48,0.1)":"rgba(255,255,255,0.06)",
    border:`1px solid ${red?"rgba(255,59,48,0.28)":"rgba(255,255,255,0.1)"}`,
    color: red?"#FF3B30":"rgba(255,255,255,0.55)",
    borderRadius:"8px",padding:"5px 12px",fontSize:"11px",fontWeight:500,
    cursor:"pointer",fontFamily:"'Poppins',sans-serif",
    transition:"all 0.2s ease",display:"flex",alignItems:"center",gap:"5px",
  }}
    onMouseEnter={e=>{ e.currentTarget.style.background=red?"rgba(255,59,48,0.2)":"rgba(255,255,255,0.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background=red?"rgba(255,59,48,0.1)":"rgba(255,255,255,0.06)"; }}
  >{label}</button>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeKey,   setActiveKey]   = useState("dashboard");
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [showNotif,   setShowNotif]   = useState(false);
  const [showSearch,  setShowSearch]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting,    setGreeting]    = useState("Good Morning");
  const [pageIn,      setPageIn]      = useState(false);
  // Notifications lifted to root so modal renders outside any clipped container
  const [allNotifs,     setAllNotifs]     = useState(() => buildLiveNotifs());
  const [showAllNotifs, setShowAllNotifs] = useState(false);
  const navigate = useNavigate();

  // ── Live data from localStorage ──────────────────────────────────────────────
  const [liveLeads,    setLiveLeads]    = useState([]);
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);

  useEffect(() => {
    // Load leads
    const savedLeads = localStorage.getItem("csw_admin_leads");
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        setLiveLeads(parsed.slice(0, 5)); // show latest 5
      } catch {}
    }
    // Load products
    const savedProds = localStorage.getItem("csw_admin_products");
    if (savedProds) {
      try {
        const parsed = JSON.parse(savedProds);
        setLiveProducts(parsed.slice(0, 5)); // show latest 5
      } catch {}
    }
    // Build activity feed from real data
    const activityFeed = [];
    try {
      const leads = JSON.parse(localStorage.getItem("csw_admin_leads") || "[]");
      const prods = JSON.parse(localStorage.getItem("csw_admin_products") || "[]");
      const orders = JSON.parse(localStorage.getItem("csw_admin_bulk_orders") || "[]");
      const testimonials = JSON.parse(localStorage.getItem("csw_admin_testimonials") || "[]");
      leads.slice(0, 2).forEach(l => activityFeed.push({
        icon: "🆕", color: "#3B82F6",
        text: `Lead received from ${l.name}${l.org ? ` — ${l.org}` : ""}`,
        time: l.date || "Recently"
      }));
      prods.filter(p => p.stockStatus === "Low Stock" || p.stockStatus === "Out of Stock").slice(0, 1).forEach(p => activityFeed.push({
        icon: "📦", color: "#F59E0B",
        text: `Product '${p.name}' is ${p.stockStatus}`,
        time: "Recently"
      }));
      orders.slice(0, 1).forEach(o => activityFeed.push({
        icon: "✅", color: "#10B981",
        text: `Bulk order from ${o.name || o.org || "a client"} — ${o.status || "Pending"}`,
        time: o.deliveryDate || "Recently"
      }));
      testimonials.slice(0, 1).forEach(t => activityFeed.push({
        icon: "💬", color: "#FF3B30",
        text: `New testimonial by ${t.name} — ${t.rating || 5}★`,
        time: t.date || "Recently"
      }));
    } catch {}
    // Fallback if no real data yet
    if (activityFeed.length === 0) {
      activityFeed.push(
        { icon: "🆕", color: "#3B82F6", text: "No activity yet — add leads, products or orders to see updates here", time: "" }
      );
    }
    setLiveActivity(activityFeed);
  }, []);

  const unreadCount = (() => { try { return buildLiveNotifs().filter(n => !n.read).length; } catch { return 0; } })();

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(()=>{
    const h=new Date().getHours();
    setGreeting(h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening");
    const t=setTimeout(()=>setPageIn(true),60);
    return()=>clearTimeout(t);
  },[]);

  const closeAll=()=>{ setShowNotif(false); setShowSearch(false); };

  // Derive live KPI values
  const totalProductsLive = (() => { try { return JSON.parse(localStorage.getItem("csw_admin_products") || "[]").length; } catch { return 0; } })();
  const newLeadsLive = (() => { try { return JSON.parse(localStorage.getItem("csw_admin_leads") || "[]").filter(l => l.status === "New").length; } catch { return 0; } })();

  // Live stats (first 2 use real data, last 2 stay as indicators)
  const LIVE_STATS = [
    { ...STATS[0], value: totalProductsLive || STATS[0].value },
    { ...STATS[1] },
    { ...STATS[2], value: newLeadsLive || STATS[2].value },
    { ...STATS[3] },
  ];

  return (
    <>
      {/* ── All Notifications Modal — rendered at root, outside all positioned parents ── */}
      {showAllNotifs && (
        <AllNotifsModal
          notifs={allNotifs}
          onClose={() => { setShowAllNotifs(false); setShowNotif(false); }}
        />
      )}
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#050e1a;color:#fff;font-family:'Poppins',sans-serif;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);}
        ::-webkit-scrollbar-thumb{background:rgba(255,59,48,0.3);border-radius:2px;}

        @keyframes csw-fadein{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes csw-dropdown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes csw-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,59,48,0.5);}50%{box-shadow:0 0 0 7px rgba(255,59,48,0);}}

        .csw-card { transition-property: opacity, transform; }

        /* ── Topbar ── */
        .csw-topbar{
          position:fixed;top:0;
          left:${SIDEBAR_W}px;right:0;
          height:64px;
          background:rgba(5,14,26,0.92);
          backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(255,255,255,0.07);
          display:flex;align-items:center;
          justify-content:space-between;
          padding:0 24px;gap:12px;
          z-index:30;
          transition:left 0.32s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Main ── */
        .csw-main{
          margin-left:${SIDEBAR_W}px;
          padding:80px 24px 40px;
          min-height:100vh;
          transition:margin-left 0.32s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Stat grid ── */
        .csw-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
        .csw-charts{ display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
        .csw-tables{ display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }

        /* ── Search input desktop ── */
        .csw-search-outer{ position:relative; }
        .csw-search-wrap{ position:relative; }
        .csw-search-box{
          display:flex;align-items:center;gap:8px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          borderRadius:10px;padding:7px 14px;
          cursor:text;transition:border-color 0.2s ease;
        }
        .csw-search-box:focus-within{ border-color:rgba(255,59,48,0.4); }
        .csw-search-box input{
          background:none;border:none;outline:none;
          color:#fff;font-size:13px;width:150px;
          font-family:'Poppins',sans-serif;
        }
        .csw-search-box input::placeholder{ color:rgba(255,255,255,0.3); }

        /* ── Mobile search (icon only) ── */
        .csw-mobile-search-btn{ display:none; }

        /* ── Hamburger ── */
        .csw-hamburger{ display:none; }

        /* ── Responsive ── */
        @media(max-width:1024px){
          .csw-charts{ grid-template-columns:1fr !important; }
          .csw-tables{ grid-template-columns:1fr !important; }
        }
        @media(max-width:768px){
          .csw-topbar{ left:0 !important; padding:0 14px; gap:8px; }
          .csw-main{ margin-left:0 !important; padding:72px 14px 32px; }
          .csw-stats{ grid-template-columns:1fr 1fr !important; gap:10px; }
          .csw-hamburger{ display:flex !important; }
          /* Hide full search box on mobile, show icon */
          .csw-search-wrap .csw-search-box{ display:none; }
          .csw-mobile-search-btn{ display:flex !important; }
          /* greeting text — shorter on mobile */
          .csw-greeting-sub{ display:none; }
          .csw-search-outer { position: static !important; }
          .csw-search-wrap { position: static !important; }
          .csw-search-panel {
            position: fixed !important;
            top: 74px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100vw - 24px) !important;
            max-width: 440px !important;
          }
        }
        @media(max-width:480px){
          .csw-stats{ grid-template-columns:1fr !important; }
          .csw-topbar{ padding:0 12px; gap:6px; }
        }

        /* Sidebar inline transform on mobile */
        @media(max-width:768px){
          .csw-sidebar{ transform: ${mobileOpen?"translateX(0)":"translateX(-100%)"} !important; }
        }

        /* table hover */
        .csw-tr:hover td{ background:rgba(255,255,255,0.04) !important; }
      `}</style>

      <div style={{minHeight:"100vh",background:"#050e1a"}}>

        {/* ── Sidebar ── */}
        <AdminSidebar
          activeKey={activeKey}
          onNavigate={setActiveKey}
          isMobileOpen={mobileOpen}
          onMobileClose={()=>setMobileOpen(false)}
        />

        {/* ── Topbar ── */}
        <header className="csw-topbar">

          {/* Left: hamburger + greeting */}
          <div style={{display:"flex",alignItems:"center",gap:"10px",flex:"0 0 auto"}}>
            {/* Hamburger */}
            <button className="csw-hamburger"
              onClick={()=>{ closeAll(); setMobileOpen(true); }}
              style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"9px",width:"36px",height:"36px",
                alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:"rgba(255,255,255,0.8)",flexShrink:0,
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Greeting */}
            <div>
              <p className="csw-greeting-sub" style={{fontSize:"10.5px",color:"rgba(255,255,255,0.38)",fontFamily:"'Poppins',sans-serif",letterSpacing:"0.4px"}}>{greeting},</p>
              <p style={{fontSize:"14px",fontWeight:700,color:"#fff",fontFamily:"'Montserrat',sans-serif",lineHeight:1.2}}>Admin</p>
            </div>
          </div>

          {/* Centre: Search (desktop shows input, mobile shows icon) */}
          <div className="csw-search-outer" style={{flex:"1 1 auto",display:"flex",justifyContent:"center"}}>
            {/* Desktop search */}
            <div className="csw-search-wrap" style={{width:"100%",maxWidth:"380px"}}>
              <div className="csw-search-box" onClick={()=>{ setShowNotif(false); setShowSearch(true); }}>
                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  value={searchQuery}
                  onChange={e=>{setSearchQuery(e.target.value);setShowSearch(true);setShowNotif(false);}}
                  onFocus={()=>{setShowSearch(true);setShowNotif(false);}}
                  placeholder="Search products, leads…"
                />
                {searchQuery && (
                  <button onClick={e=>{e.stopPropagation();setSearchQuery("");}}
                    style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"16px",lineHeight:1,flexShrink:0}}>×</button>
                )}
              </div>
              {showSearch && (
                <SearchPanel query={searchQuery} setQuery={setSearchQuery} onClose={()=>setShowSearch(false)}/>
              )}
            </div>

            {/* Mobile search icon */}
            <button className="csw-mobile-search-btn"
               onClick={()=>{setShowSearch(s=>!s);setShowNotif(false);}}
               style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                 borderRadius:"9px",width:"36px",height:"36px",
                 alignItems:"center",justifyContent:"center",
                 cursor:"pointer",color:"rgba(255,255,255,0.7)",
               }}>
               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>

          {/* Right: bell + avatar */}
          <div style={{display:"flex",alignItems:"center",gap:"8px",flex:"0 0 auto",position:"relative"}}>
            {/* Notification Bell */}
            <div style={{position:"relative"}}>
              <button
                onClick={()=>{setShowNotif(n=>!n);setShowSearch(false);}}
                style={{
                  position:"relative",
                  background: showNotif?"rgba(255,59,48,0.12)":"rgba(255,255,255,0.07)",
                  border:`1px solid ${showNotif?"rgba(255,59,48,0.35)":"rgba(255,255,255,0.1)"}`,
                  borderRadius:"9px",width:"38px",height:"38px",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",color:"rgba(255,255,255,0.75)",
                  transition:"all 0.2s ease",
                }}>
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {unreadCount>0 && (
                  <span style={{
                    position:"absolute",top:"5px",right:"5px",
                    width:"8px",height:"8px",
                    background:"#FF3B30",borderRadius:"50%",
                    border:"1.5px solid #050e1a",
                    animation:"csw-pulse 2s infinite",
                  }}/>
                )}
              </button>
              {showNotif && (
                <div style={{position:"absolute",top:"calc(100% + 10px)",right:0,zIndex:200}}>
                  <NotifPanel
                    onClose={() => setShowNotif(false)}
                    onViewAll={() => { setShowAllNotifs(true); }}
                    notifs={allNotifs}
                    setNotifs={setAllNotifs}
                  />
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width:"38px",height:"38px",borderRadius:"9px",flexShrink:0,
              background:"linear-gradient(135deg,#FF3B30,#cc2020)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Montserrat',sans-serif",fontWeight:800,fontSize:"15px",color:"#fff",
              cursor:"pointer",boxShadow:"0 0 14px rgba(255,59,48,0.3)",
              transition:"transform 0.2s ease",
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >A</div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="csw-main">

          {/* Page title */}
          <div style={{
            marginBottom:"24px",
            opacity: pageIn?1:0, transform: pageIn?"translateY(0)":"translateY(14px)",
            transition:"opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"3px"}}>
              <div style={{width:"4px",height:"22px",background:"#FF3B30",borderRadius:"2px",boxShadow:"0 0 10px rgba(255,59,48,0.5)"}}/>
              <h1 style={{fontFamily:"'Montserrat',sans-serif",fontWeight:800,fontSize:"21px",color:"#fff",letterSpacing:"0.4px"}}>
                Dashboard Overview
              </h1>
            </div>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"12.5px",fontFamily:"'Poppins',sans-serif",paddingLeft:"14px"}}>
              Welcome back — here's what's happening with Comfy Sport Wear today.
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="csw-stats">
            {LIVE_STATS.map((s,i)=><StatCard key={s.key} stat={s} delay={i*0.07}/>)}
          </div>

          {/* ── Charts ── */}
          <div className="csw-charts">
            <Card delay={0.1}>
              <SectionHead
                title="Monthly Inquiries" sub="2025 Overview"
                action={<span style={{background:"rgba(255,59,48,0.12)",color:"#FF3B30",border:"1px solid rgba(255,59,48,0.28)",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",fontWeight:600,fontFamily:"'Poppins',sans-serif"}}>▲ 18.4%</span>}
              />
              <BarChart/>
            </Card>
            <Card delay={0.15}>
              <SectionHead title="Sales by Category" sub="Current distribution"/>
              <DonutChart/>
            </Card>
          </div>

          {/* ── Tables ── */}
          <div className="csw-tables">
            {/* Leads */}
            <Card delay={0.1} style={{overflowX:"hidden"}}>
              <SectionHead title="Recent Leads" sub="Latest inquiries" action={<ViewAllBtn onClick={() => navigate("/admin/leads")}/>}/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:"380px"}}>
                  <thead>
                    <tr>
                      {["Name","Product","Qty","Status","Time"].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"7px 10px",fontSize:"10px",fontWeight:600,
                          color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.8px",
                          fontFamily:"'Poppins',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveLeads.length > 0 ? liveLeads.map((l,i)=>(
                      <tr key={l.id || i} className="csw-tr" style={{animation:`csw-fadein 0.4s ease ${i*0.055}s both`}}>
                        <td style={{padding:"10px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <p style={{fontSize:"12px",fontWeight:500,color:"#fff",fontFamily:"'Poppins',sans-serif",margin:0}}>{l.name}</p>
                          <p style={{fontSize:"10px",color:"rgba(255,255,255,0.33)",fontFamily:"'Poppins',sans-serif",margin:0}}>{l.org || l.company || "—"}</p>
                        </td>
                        <td style={{padding:"10px 10px",fontSize:"12px",color:"rgba(255,255,255,0.6)",fontFamily:"'Poppins',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{l.product || l.category || "—"}</td>
                        <td style={{padding:"10px 10px",fontSize:"12px",fontWeight:700,color:"#fff",fontFamily:"'Montserrat',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{l.qty || l.quantity || "—"}</td>
                        <td style={{padding:"10px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><StatusBadge status={l.status}/></td>
                        <td style={{padding:"10px 10px",fontSize:"10.5px",color:"rgba(255,255,255,0.32)",fontFamily:"'Poppins',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.04)",whiteSpace:"nowrap"}}>{l.date || l.time || "—"}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} style={{padding:"24px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:"12px",fontFamily:"'Poppins',sans-serif"}}>No leads yet — add your first lead from the Leads page.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Products */}
            <Card delay={0.14} style={{overflowX:"hidden"}}>
              <SectionHead title="Product Inventory" sub="Top selling items"
                action={<ViewAllBtn label="+ Add Product" red onClick={() => navigate("/admin/products", { state: { openAddModal: true } })}/>}/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:"340px"}}>
                  <thead>
                    <tr>
                      {["Product","Category","Price","Stock"].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"7px 10px",fontSize:"10px",fontWeight:600,
                          color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.8px",
                          fontFamily:"'Poppins',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveProducts.length > 0 ? liveProducts.map((p,i)=>(
                      <tr key={p.id || i} className="csw-tr" style={{animation:`csw-fadein 0.4s ease ${i*0.055}s both`}}>
                        <td style={{padding:"10px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                            <div style={{width:"28px",height:"28px",borderRadius:"7px",background:"rgba(255,59,48,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FF3B30",flexShrink:0}}>
                              <svg width="14" height="14" fill="none" stroke="#FF3B30" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                            </div>
                            <span style={{fontSize:"12px",fontWeight:500,color:"#fff",fontFamily:"'Poppins',sans-serif"}}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{padding:"10px 10px",fontSize:"11px",color:"rgba(255,255,255,0.45)",fontFamily:"'Poppins',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{p.category}</td>
                        <td style={{padding:"10px 10px",fontSize:"12px",fontWeight:600,color:"#FF3B30",fontFamily:"'Montserrat',sans-serif",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{p.price ? `₹${p.price}` : "—"}</td>
                        <td style={{padding:"10px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><StockDot stock={p.stockStatus || p.stock || "In Stock"}/></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} style={{padding:"24px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:"12px",fontFamily:"'Poppins',sans-serif"}}>No products yet — add your first product from the Products page.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Recent Activity ── */}
          <Card delay={0.08}>
            <SectionHead title="Recent Activity" sub="System log"/>
            <div>
              {liveActivity.map((a,i)=>(
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:"12px",
                  padding:"12px 0",
                  borderBottom: i<liveActivity.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  animation:`csw-fadein 0.4s ease ${i*0.07}s both`,
                }}>
                  <div style={{
                    width:"34px",height:"34px",borderRadius:"9px",
                    background:`${a.color}18`,border:`1px solid ${a.color}30`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"14px",flexShrink:0,
                  }}>{getIconSvg(a.icon, 16, a.color)}</div>
                  <p style={{flex:1,fontSize:"12.5px",color:"rgba(255,255,255,0.72)",fontFamily:"'Poppins',sans-serif",lineHeight:1.45}}>{a.text}</p>
                  <span style={{fontSize:"10px",color:"rgba(255,255,255,0.28)",fontFamily:"'Poppins',sans-serif",whiteSpace:"nowrap"}}>{a.time}</span>
                </div>
              ))}
            </div>
          </Card>

        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
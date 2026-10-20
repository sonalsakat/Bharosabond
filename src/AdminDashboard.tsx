import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, BadgeCheck, Building2, ChevronDown, CircleHelp, ClipboardList, Headphones, MapPinned, ShieldCheck, UsersRound } from 'lucide-react';
import { escalations, districtsForMap, mentorRows, overviewStats } from './data';
import { t, type CopyKey, type Language } from './i18n';

type View = 'overview' | 'map' | 'mentors' | 'escalations';
type Position = [number, number, ...number[]];
type Geometry = { type: 'Polygon'; coordinates: Position[][] } | { type: 'MultiPolygon'; coordinates: Position[][][] };
type DistrictFeature = { type: 'Feature'; properties: { district: string }; geometry: Geometry };
type DistrictCollection = { type: 'FeatureCollection'; features: DistrictFeature[] };

const viewKeys: Record<View, 'overview' | 'resistanceMap' | 'mentors' | 'escalations'> = {
  overview: 'overview', map: 'resistanceMap', mentors: 'mentors', escalations: 'escalations',
};
const navItems: { id: View; icon: typeof UsersRound }[] = [
  { id: 'overview', icon: Activity }, { id: 'map', icon: MapPinned }, { id: 'mentors', icon: UsersRound }, { id: 'escalations', icon: Headphones },
];
const tradeKeyByValue: Record<string, CopyKey> = { Electrician: 'electrician', Welder: 'welder', Plumber: 'plumber' };
const ticketCopyKeys: Record<string, { name: CopyKey; summary: CopyKey; concern: CopyKey; time: CopyKey }> = {
  'BB-248': { name: 'ticket248Name', summary: 'ticket248Summary', concern: 'girlsSafety', time: 'time18min' },
  'BB-231': { name: 'ticket231Name', summary: 'ticket231Summary', concern: 'cost', time: 'time2hr' },
  'BB-216': { name: 'ticket216Name', summary: 'ticket216Summary', concern: 'degree', time: 'yesterday' },
  'BB-204': { name: 'ticket204Name', summary: 'ticket204Summary', concern: 'lowPay', time: 'yesterday' },
};
const concernOptions = [{ value: 'Safety', key: 'safety' }, { value: 'Low pay', key: 'lowPay' }, { value: 'Respect', key: 'respect' }] as const;
const tradeOptions = [{ value: 'All trades', key: 'allTrades' }, { value: 'Electrician', key: 'electrician' }, { value: 'Welder', key: 'welder' }, { value: 'Plumber', key: 'plumber' }] as const;

function OverviewPage({ language }: { language: Language }) {
  const chartLines = [
    { name: 'Safety', before: 'M31 57 C78 66 90 77 128 73 S195 83 228 70 S286 75 323 52 S381 59 427 36', after: 'M31 99 C70 91 96 89 128 70 S190 61 228 55 S290 44 323 37 S390 25 427 22', color: '#6D28D9' },
    { name: 'Pay', before: 'M31 115 C67 111 100 117 128 103 S193 98 228 105 S287 91 323 81 S384 87 427 70', after: 'M31 130 C70 127 100 123 128 110 S190 96 228 93 S287 81 323 68 S384 62 427 52', color: '#DB2777' },
  ];
  const funnel = [
    { label: t(language, 'firstEnquiry'), value: '1,284', width: '100%' },
    { label: t(language, 'mentorConversation'), value: '862', width: '72%' },
    { label: t(language, 'funnelVisit'), value: '594', width: '52%' },
    { label: t(language, 'enrolled'), value: '327', width: '32%' },
    { label: t(language, 'retained90Days'), value: '291', width: '24%' },
  ];
  return <>
    <div className="admin-page-intro"><div><span className="admin-overline">{t(language, 'maharashtraOverview').toUpperCase()}</span><h1>{t(language, 'overview')}</h1><p>{t(language, 'overviewSubtitle')}</p></div><div className="admin-period"><span className="period-dot" /> {t(language, 'last30Days')} <ChevronDown size={15} /></div></div>
    <section className="kpi-row" aria-label={t(language, 'programmeMetrics')}>{overviewStats.map((stat, index) => { const Icon = [UsersRound, ShieldCheck, Activity, Building2][index]; return <div className="kpi-item" key={stat.key}><span className="kpi-label">{t(language, stat.key)}</span><div className="kpi-number-row"><strong>{stat.value}</strong><Icon size={17} strokeWidth={1.8} /></div><span className="kpi-change">{t(language, stat.changeKey)}</span></div>; })}</section>
    <div className="overview-panels"><section className="admin-panel sentiment-panel"><div className="panel-heading"><div><span className="admin-overline">{t(language, 'afterMentorCall').toUpperCase()}</span><h2>{t(language, 'beforeAfter')}</h2></div><span className="quiet-filter">{t(language, 'allConcerns')}</span></div><div className="sentiment-chart"><div className="chart-y-labels"><span>{t(language, 'moreSure')}</span><span>{t(language, 'someDoubt')}</span><span>{t(language, 'unsure')}</span></div><svg viewBox="0 0 460 150" role="img" aria-label={t(language, 'chartAria')}><path d="M30 24H435M30 73H435M30 122H435" stroke="#EEEAF3" strokeWidth="1" strokeDasharray="3 6" /><path d={chartLines[0].before} fill="none" stroke={chartLines[0].color} strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" /><path d={chartLines[0].after} fill="none" stroke={chartLines[0].color} strokeWidth="3.2" strokeLinecap="round" /><path d={chartLines[1].before} fill="none" stroke={chartLines[1].color} strokeWidth="1.6" strokeDasharray="4 6" strokeLinecap="round" opacity=".62" /><path d={chartLines[1].after} fill="none" stroke={chartLines[1].color} strokeWidth="2.2" strokeLinecap="round" opacity=".76" /><circle cx="427" cy="22" r="4" fill="#6D28D9" /><circle cx="427" cy="52" r="3.6" fill="#DB2777" /></svg><div className="chart-x-labels"><span>{t(language, 'firstConversation')}</span><span>{t(language, 'mentorStoryStep')}</span><span>{t(language, 'familyVisitStep')}</span></div></div><div className="chart-legend"><span><i className="legend-line before" />{t(language, 'before')}</span><span><i className="legend-line after" />{t(language, 'after')}</span><small>{t(language, 'sentimentScale')}</small></div></section>
      <section className="admin-panel funnel-panel"><div className="panel-heading"><div><span className="admin-overline">{t(language, 'familyJourney').toUpperCase()}</span><h2>{t(language, 'enquiryFunnel')}</h2></div><ClipboardList size={18} /></div><div className="funnel-list">{funnel.map((item, index) => <div className="funnel-row" key={item.label}><div className="funnel-meta"><span>{item.label}</span><strong>{item.value}</strong></div><div className="funnel-track"><span style={{ width: item.width, opacity: 1 - index * .11 }} /></div></div>)}</div><p className="funnel-footnote"><ArrowDownRight size={16} /> 22.7% {t(language, 'retentionRate')}</p></section></div>
  </>;
}

function getAllPositions(geometry: Geometry): Position[] {
  const rings = geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat();
  return rings.flat();
}
function districtPaths(features: DistrictFeature[], width: number, height: number) {
  const all = features.flatMap((feature) => getAllPositions(feature.geometry));
  const xs = all.map((point) => point[0]); const ys = all.map((point) => point[1]);
  const minX = Math.min(...xs); const maxX = Math.max(...xs); const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const pad = 16; const dx = maxX - minX; const dy = maxY - minY;
  const project = ([x, y]: Position): [number, number] => [pad + ((x - minX) / dx) * (width - pad * 2), height - pad - ((y - minY) / dy) * (height - pad * 2)];
  const shapeToPath = (coords: Position[][]) => coords.map((ring) => `${ring.map((p, index) => { const [x, y] = project(p); return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ')} Z`).join(' ');
  const featuresWithPaths = features.map((feature) => {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const d = polygons.map(shapeToPath).join(' ');
    const mainRing = polygons.sort((a, b) => b[0].length - a[0].length)[0]?.[0] ?? [];
    const average: Position = [mainRing.reduce((sum, p) => sum + p[0], 0) / mainRing.length, mainRing.reduce((sum, p) => sum + p[1], 0) / mainRing.length];
    return { district: feature.properties.district, d, centroid: project(average) };
  });
  return featuresWithPaths;
}

function ResistanceMapPage({ language }: { language: Language }) {
  const [geo, setGeo] = useState<DistrictCollection | null>(null);
  const [selected, setSelected] = useState('Satara');
  const [concern, setConcern] = useState('Safety');
  const [trade, setTrade] = useState('All trades');
  useEffect(() => { void fetch('/data/maharashtra-districts.geojson').then((response) => response.json()).then((data: DistrictCollection) => setGeo(data)).catch(() => setGeo(null)); }, []);
  const paths = useMemo(() => geo ? districtPaths(geo.features, 510, 500) : [], [geo]);
  const selectedData = districtsForMap.find((item) => item.district === selected);
  const score = (name: string, issue = concern) => {
    const row = districtsForMap.find((item) => item.district === name);
    const metric = issue === 'Safety' ? 'safety' : issue === 'Low pay' ? 'pay' : 'respect';
    if (row) return trade === 'All trades' ? row[metric] : row.byTrade[trade as keyof typeof row.byTrade][metric];
    const concernOffset = issue === 'Safety' ? 0 : issue === 'Low pay' ? 3 : -2;
    const tradeOffset = trade === 'Welder' ? 5 : trade === 'Plumber' ? 1 : trade === 'Electrician' ? -2 : 0;
    return Math.max(8, 13 + (name.charCodeAt(0) % 21) + concernOffset + tradeOffset);
  };
  const colorFor = (name: string) => { const value = score(name); return value > 36 ? '#6D28D9' : value > 27 ? '#9C69DF' : value > 19 ? '#CFB6ED' : '#FCE7F3'; };
  const mentorCount = selectedData?.mentorsNeeded ?? 5 + (selected.charCodeAt(0) % 4);
  const mentorGap = language === 'mr' ? `आणखी ${mentorCount} मार्गदर्शक पालक हवेत` : language === 'hi' ? `${mentorCount} और मार्गदर्शक अभिभावक चाहिए` : `Needs ${mentorCount} more mentor parents`;
  const concernRows = concernOptions.map((item) => ({ ...item, count: score(selected, item.value) })).sort((left, right) => right.count - left.count);
  return <>
    <div className="admin-page-intro"><div><span className="admin-overline">{t(language, 'mapOverline').toUpperCase()}</span><h1>{t(language, 'resistanceMap')}</h1><p>{t(language, 'mapSubtitle')}</p></div></div>
    <section className="map-filter-row"><div className="filter-lead"><span className="filter-small-label">{t(language, 'districtFilters')}</span><strong>{selected}, Maharashtra</strong></div><label className="filter-select"><span>{t(language, 'concernFilterLabel')}</span><select value={concern} onChange={(event) => setConcern(event.target.value)}>{concernOptions.map((item) => <option key={item.value} value={item.value}>{t(language, item.key)}</option>)}</select><ChevronDown size={15} /></label><label className="filter-select"><span>{t(language, 'trade')}</span><select value={trade} onChange={(event) => setTrade(event.target.value)}>{tradeOptions.map((item) => <option key={item.value} value={item.value}>{t(language, item.key)}</option>)}</select><ChevronDown size={15} /></label></section>
    <div className="map-workspace"><section className="map-canvas-panel"><div className="map-canvas-heading"><span className="map-canvas-title">Maharashtra</span><span className="map-canvas-subtitle">{t(language, 'districtBoundarySubtitle')}</span></div><div className="map-drawing-wrap">{paths.length ? <svg className="maharashtra-map" viewBox="0 0 510 500" role="img" aria-label={t(language, 'mapAria')}><g>{paths.map((item) => <path key={item.district} d={item.d} className={`district-shape ${selected === item.district ? 'district-active' : ''}`} fill={colorFor(item.district)} onClick={() => setSelected(item.district)} role="button" tabIndex={0} aria-label={`${item.district}: ${score(item.district)} concern responses`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(item.district); }} />)}</g><g className="district-labels">{paths.filter((item) => ['Pune', 'Nashik', 'Satara', 'Nagpur', 'Latur'].includes(item.district)).map((item) => <text key={item.district} x={item.centroid[0]} y={item.centroid[1]} textAnchor="middle" className={selected === item.district ? 'district-label selected' : 'district-label'} onClick={() => setSelected(item.district)}>{item.district}</text>)}</g></svg> : <div className="map-loading">Loading district outlines…</div>}</div><div className="map-legend"><span>{t(language, 'fewerFamilies')}</span><i className="legend-swatch swatch-light" /><i className="legend-swatch swatch-mid" /><i className="legend-swatch swatch-dark" /><span>{t(language, 'moreFamilies')}</span></div><p className="map-source-note">{t(language, 'boundaryNote')} <a href="https://github.com/udit-001/india-maps-data" target="_blank" rel="noreferrer">Source</a></p></section>
      <aside className="district-detail-panel"><div className="district-detail-overline"><MapPinned size={17} /><span>{t(language, 'selectedDistrict').toUpperCase()}</span></div><h2>{selected}</h2><div className="district-detail-metric"><strong>{score(selected)}</strong><span>{t(language, 'familiesRaisedConcern')}</span></div><div className="district-concern-list"><h3>{t(language, 'topConcerns')}</h3>{concernRows.map((item, index) => <div className="district-concern-row" key={item.value}><span className="concern-rank">0{index + 1}</span><span>{t(language, item.key)}</span><span>{item.count}</span></div>)}</div><div className="district-needs"><span className="needs-indicator"><UsersRound size={18} /></span><span>{mentorGap}</span></div><p className="district-filter-trade">{t(language, 'activeTradeFilter')}: {t(language, trade === 'All trades' ? 'allTrades' : tradeKeyByValue[trade] ?? 'electrician')}</p></aside></div>
  </>;
}

function MentorsPage({ language }: { language: Language }) {
  return <>
    <div className="admin-page-intro"><div><span className="admin-overline">{t(language, 'mentors').toUpperCase()}</span><h1>{t(language, 'mentors')}</h1><p>{t(language, 'mentorsSubtitle')}</p></div><button type="button" className="admin-export-button" onClick={() => window.print()}>{t(language, 'exportMentorList')}</button></div>
    <div className="table-intro"><span><span className="table-indicator" />{mentorRows.length} {t(language, 'activeMentors')}</span></div>
    <div className="mentor-table-wrap"><table className="mentor-table"><thead><tr><th>{t(language, 'parent')}</th><th>{t(language, 'district')}</th><th>{t(language, 'trade')}</th><th>{t(language, 'language')}</th><th>{t(language, 'consentStatus')}</th><th>{t(language, 'callsWeek')}</th><th>{t(language, 'verification')}</th></tr></thead><tbody>{mentorRows.map((row, index) => <tr key={row.name}><td><div className="table-person"><span className={`person-avatar avatar-${index}`}>{row.name.split(' ').map((part) => part[0]).join('')}</span><span><strong>{row.name}</strong><small>{t(language, 'mentorParentLabel')}</small></span></div></td><td>{row.district}</td><td><span className="trade-pill">{t(language, tradeKeyByValue[row.trade] ?? 'electrician')}</span></td><td>{row.language === 'Marathi' ? t(language, 'languageMarathi') : t(language, 'languageMarathiHindi')}</td><td><span className={row.consent === 'Consented' ? 'consent-pill yes' : 'consent-pill due'}><span />{row.consent === 'Consented' ? t(language, 'consented') : t(language, 'pending')}</span></td><td className="calls-cell">{row.calls} <span>{t(language, 'callsWord')}</span></td><td><span className="verified-badge"><BadgeCheck size={15} />{t(language, 'mentorVerified')}</span></td></tr>)}</tbody></table></div>
    <p className="table-footnote"><ShieldCheck size={15} /> {t(language, 'mentorNamesNote')}</p>
  </>;
}

function EscalationsPage({ language }: { language: Language }) {
  const [statuses, setStatuses] = useState(escalations.map((ticket) => ticket.status));
  const cycle = (index: number) => setStatuses((previous) => previous.map((status, position) => position === index ? status === 'New' ? 'In progress' : status === 'In progress' ? 'Resolved' : 'New' : status));
  return <>
    <div className="admin-page-intro"><div><span className="admin-overline">{t(language, 'escalations').toUpperCase()} · {t(language, 'programmeOverview')}</span><h1>{t(language, 'escalations')}</h1><p>{t(language, 'escalationsSubtitle')}</p></div><span className="ticket-filter">{t(language, 'allTickets')}</span></div>
    <section className="ticket-list">{escalations.map((ticket, index) => { const status = statuses[index]; return <article className="ticket-row" key={ticket.id}><div className="ticket-marker"><span /></div><div className="ticket-main"><div className="ticket-topline"><span className="ticket-id">{ticket.id}</span><span className="ticket-time">{t(language, ticketCopyKeys[ticket.id].time)}</span></div><h2>{t(language, ticketCopyKeys[ticket.id].name)}</h2><p>{t(language, ticketCopyKeys[ticket.id].summary)}</p><div className="ticket-tags"><span className="concern-tag"><CircleHelp size={14} />{t(language, ticketCopyKeys[ticket.id].concern)}</span><span className="ticket-category-tag">{t(language, 'requestType')}</span></div></div><div className="ticket-status-area"><span className={`ticket-status status-${status.toLowerCase().replace(' ', '-')}`}>{t(language, status === 'New' ? 'statusNew' : status === 'In progress' ? 'statusInProgress' : 'statusResolved')}</span><button type="button" className="ticket-status-action" onClick={() => cycle(index)} aria-label={`${t(language, 'moveToNextStatus')} ${ticket.id}`}>{t(language, 'moveToNextStatus')} <ChevronDown size={14} /></button></div></article>; })}</section>
    <div className="ticket-footer-note"><ClipboardList size={17} /><span>{t(language, 'queueDisclosure')}</span></div>
  </>;
}

export function AdminDashboard({ language, onTitle }: { language: Language; onTitle: (text: string) => void }) {
  const [view, setView] = useState<View>('overview');
  useEffect(() => { onTitle(t(language, viewKeys[view])); }, [language, onTitle, view]);
  return <main className="admin-layout">
    <aside className="admin-sidebar"><div className="admin-sidebar-brand"><span className="sidebar-symbol"><span /><span /></span><span>Bharosa<span>Bond</span><small>{t(language, 'familyDecisions').toUpperCase()}</small></span></div><span className="sidebar-section-label">{t(language, 'workspace').toUpperCase()}</span><nav className="admin-nav">{navItems.map(({ id, icon: Icon }) => <button key={id} className={view === id ? 'admin-nav-item current' : 'admin-nav-item'} type="button" onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}><Icon size={19} strokeWidth={1.9} /><span>{t(language, viewKeys[id])}</span>{view === id && <span className="active-rail" />}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-help-mark"><Headphones size={17} /></div><span><strong>{t(language, 'familySupport')}</strong><small>{t(language, 'dashboardUpdated')}</small></span><span className="sidebar-status-dot" /></div></aside>
    <div className="admin-main"><div className="admin-topline"><div className="admin-breadcrumb">BHAROSA BOND <span>/</span> <strong>{t(language, viewKeys[view]).toUpperCase()}</strong></div><div className="admin-user-tools"><span className="admin-date">7 Oct 2026</span><span className="admin-user-avatar">BB</span></div></div>{view === 'overview' ? <OverviewPage language={language} /> : view === 'map' ? <ResistanceMapPage language={language} /> : view === 'mentors' ? <MentorsPage language={language} /> : <EscalationsPage language={language} />}<footer className="admin-footer"><span>BHAROSA BOND</span><span>{t(language, 'programmeNote')}</span><a href="/">{t(language, 'returnFamilyFlow')}</a></footer></div>
  </main>;
}

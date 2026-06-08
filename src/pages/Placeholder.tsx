// Stand-in for the not-yet-built console screens (Board, Agents, …).
export default function Placeholder({ title }: { title: string }) {
  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>{title}</h1>
        </header>
        <div className="gui-empty">Coming soon.</div>
      </main>
      <aside className="gui-trace">
        <div className="th">— {title}</div>
      </aside>
    </>
  );
}

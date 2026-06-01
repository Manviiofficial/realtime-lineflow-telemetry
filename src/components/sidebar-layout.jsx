export function SidebarLayout({ navbar, sidebar, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {navbar}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
export function Sidebar({ children }) {
  return <aside>{children}</aside>;
}
export function SidebarHeader({ children }) {
  return <div>{children}</div>;
}
export function SidebarBody({ children }) {
  return <div>{children}</div>;
}
export function SidebarFooter({ children }) {
  return <div>{children}</div>;
}
export function SidebarSection({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
export function SidebarItem({ children, ...props }) {
  return <a {...props}>{children}</a>;
}
export function SidebarLabel({ children }) {
  return <span>{children}</span>;
}
export function SidebarHeading({ children }) {
  return <div>{children}</div>;
}
export function SidebarSpacer() {
  return <div style={{ flex: 1 }} />;
}
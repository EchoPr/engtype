/** Re-mounts on every navigation, so each page enters with a short rise animation. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise flex flex-1 flex-col">{children}</div>;
}

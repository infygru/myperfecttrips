export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Just a wrapper. You can add specific styles for the packages section here if needed.
    // For example: <div className="bg-slate-50 min-h-screen pt-20">
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
const ProfileSection = ({ title, children }) => (
  <div className="mt-6 bg-zest-card rounded-2xl border border-zest-muted/10 overflow-hidden">
    <div className="px-4 pt-4 pb-2 flex items-center gap-2">
      <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
      <h2 className="text-lg font-bold text-zest-text">{title}</h2>
    </div>
    {children}
  </div>
);

export default ProfileSection;

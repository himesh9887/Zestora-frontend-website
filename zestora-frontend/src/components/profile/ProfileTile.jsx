const ProfileTile = ({ icon: Icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="bg-zest-card rounded-2xl border border-zest-muted/10 p-4 flex items-center gap-3 text-left hover:shadow-sm transition-shadow"
  >
    <div className="w-9 h-9 rounded-full bg-zest-dark/10 flex items-center justify-center text-zest-text/70">
      <Icon />
    </div>
    <div>
      <div className="text-sm text-zest-text/70">{title}</div>
      {subtitle && <div className="font-semibold text-emerald-600">{subtitle}</div>}
    </div>
  </button>
);

export default ProfileTile;

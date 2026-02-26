const ProfileToggleRow = ({ icon: Icon, label, valueLabel, enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full px-4 py-4 border-t border-zest-muted/10 flex items-center justify-between text-left hover:bg-zest-dark/5"
  >
    <div className="flex items-center gap-3">
      <Icon className="text-zest-text/60" />
      <span className="text-zest-text">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {valueLabel && <span className="text-sm text-zest-text/60">{valueLabel}</span>}
      <div
        className={`w-11 h-6 rounded-full p-1 transition-colors ${
          enabled ? 'bg-emerald-500/80' : 'bg-zest-muted/30'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  </button>
);

export default ProfileToggleRow;

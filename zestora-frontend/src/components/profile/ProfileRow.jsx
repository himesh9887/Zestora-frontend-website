import { FaChevronRight } from 'react-icons/fa';

const ProfileRow = ({ icon: Icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-4 border-t border-zest-muted/10 flex items-center justify-between text-left hover:bg-zest-dark/5"
  >
    <div className="flex items-center gap-3">
      <Icon className="text-zest-text/60" />
      <span className="text-zest-text">{label}</span>
    </div>
    <div className="flex items-center gap-2 text-zest-text/60">
      {value && <span className="text-sm">{value}</span>}
      <FaChevronRight />
    </div>
  </button>
);

export default ProfileRow;

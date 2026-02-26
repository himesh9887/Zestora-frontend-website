import { FaChevronRight, FaCrown } from 'react-icons/fa';

const ProfileHeaderCard = ({ initial, name, onEdit, onGold }) => (
  <div className="mt-4 bg-zest-card rounded-3xl shadow-sm border border-zest-muted/10 p-4">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
        {initial}
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-zest-text">{name}</h1>
        <button
          onClick={onEdit}
          className="mt-1 text-sm text-emerald-600 font-semibold inline-flex items-center gap-1"
        >
          Edit profile <FaChevronRight size={12} />
        </button>
      </div>
    </div>

    <button
      onClick={onGold}
      className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#0f0f15] to-[#20222c] text-white px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
          <FaCrown />
        </div>
        <div className="font-semibold">Join Zestora Gold</div>
      </div>
      <FaChevronRight />
    </button>
  </div>
);

export default ProfileHeaderCard;

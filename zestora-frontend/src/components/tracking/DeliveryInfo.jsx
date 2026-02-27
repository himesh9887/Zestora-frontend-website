import { FaCommentDots, FaMotorcycle, FaPhoneAlt, FaStar } from 'react-icons/fa';

const DeliveryInfo = ({ driver, etaMinutes, delivered, onContact, onSupport }) => {
  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Delivery Partner</p>
          <p className="text-zest-text text-lg font-bold">{driver.name}</p>
          <p className="text-zest-muted text-xs mt-0.5">#{driver.vehicleNo}</p>
        </div>
        <button
          onClick={onContact}
          className="h-10 px-3 rounded-xl border border-zest-orange/40 text-zest-orange hover:bg-zest-orange/10 transition-colors inline-flex items-center gap-2"
        >
          <FaPhoneAlt />
          Contact
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl bg-zest-dark/40 border border-zest-muted/15 px-3 py-2 text-zest-text inline-flex items-center gap-2">
          <FaMotorcycle className="text-zest-orange" />
          {driver.vehicle}
        </div>
        <div className="rounded-xl bg-zest-dark/40 border border-zest-muted/15 px-3 py-2 text-zest-text inline-flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          {driver.rating}
        </div>
        <div className={`rounded-xl border px-3 py-2 font-semibold ${delivered ? 'bg-zest-success/15 text-zest-success border-zest-success/30' : 'bg-zest-dark/40 border-zest-muted/15 text-zest-text'}`}>
          {delivered ? 'Arrived' : `${etaMinutes} min`}
        </div>
      </div>

      <button
        onClick={onSupport}
        className="mt-3 w-full h-10 rounded-xl border border-zest-muted/20 text-zest-text hover:bg-zest-dark/30 transition-colors inline-flex items-center justify-center gap-2"
      >
        <FaCommentDots />
        Chat with support
      </button>
    </div>
  );
};

export default DeliveryInfo;

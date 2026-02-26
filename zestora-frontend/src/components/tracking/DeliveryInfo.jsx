import { FaMotorcycle, FaPhoneAlt, FaStar } from 'react-icons/fa';

const DeliveryInfo = ({ driver, etaMinutes, delivered }) => {
  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Delivery Partner</p>
          <p className="text-zest-text text-lg font-bold">{driver.name}</p>
        </div>
        <button className="h-10 px-3 rounded-xl border border-zest-orange/40 text-zest-orange hover:bg-zest-orange/10 transition-colors inline-flex items-center gap-2">
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
    </div>
  );
};

export default DeliveryInfo;

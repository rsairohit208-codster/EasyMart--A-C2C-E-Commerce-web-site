import React from 'react';
import { 
  Bell, CheckCircle2, ShieldCheck, Tag, 
  Truck, ArrowRight, Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigateTo } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'escrow':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'offer':
        return <Tag className="w-5 h-5 text-amber-600" />;
      case 'order':
        return <Truck className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Notifications
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Escrow payment releases, courier tracking, and buyer offers
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-base text-neutral-800">No notifications yet</h3>
          <p className="text-xs text-neutral-500">You will receive updates here when buyers negotiate or place orders.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 divide-y divide-neutral-100 overflow-hidden shadow-xs">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkPage) navigateTo(n.linkPage as any);
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition ${!n.read ? 'bg-emerald-50/40' : 'hover:bg-neutral-50'}`}
            >
              <div className="p-2.5 bg-neutral-100 rounded-2xl shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{n.title}</h4>
                  <span className="text-[10px] text-neutral-400">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

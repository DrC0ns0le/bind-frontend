import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Info, CircleCheck, AlertTriangle, XCircle } from "lucide-react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((note) => (note.id === id ? { ...note, isLeaving: true } : note))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((note) => note.id !== id));
    }, 300); // Match this with the transition duration
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {notifications.map((note) => (
          <Notification
            key={note.id}
            {...note}
            onClose={() => removeNotification(note.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const Notification = ({ id, type, message, onClose, isLeaving }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    info: {
      containerClass: "border-grey-700",
      iconColor: "",
      Icon: Info,
    },
    success: {
      containerClass: "border-grey-600",
      iconColor: "",
      Icon: CircleCheck,
    },
    warning: {
      containerClass: "border-grey-700",
      iconColor: "",
      Icon: AlertTriangle,
    },
    error: {
      containerClass: "border-grey-700",
      iconColor: "",
      Icon: XCircle,
    },
  };

  const { containerClass, iconColor, Icon } = variants[type] || variants.info;

  return (
    <div
      className={`${containerClass} border-[1px] bg-white p-3 mt-4 mx-4 w-[90vw] max-w-[400px] rounded-[8px]
                  transition-all duration-300 ease-in-out shadow-ga1 hover:shadow-gah1
                  ${
                    isLeaving
                      ? "opacity-0 -translate-y-full"
                      : "opacity-100 translate-y-0"
                  }
                  animate-slide-in`}
    >
      <div className="flex flex-row items-center justify-center">
        <div className="">
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-8">
          <p className="text-sm text-gray-800 normal-case whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context.addNotification;
};

// Add this style tag to your component or in a global CSS file
const styles = `
  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-in-out;
  }
`;

// Wrap your NotificationProvider with this style
export const NotificationProviderWithStyles = ({ children }) => (
  <>
    <style>{styles}</style>
    <NotificationProvider>{children}</NotificationProvider>
  </>
);

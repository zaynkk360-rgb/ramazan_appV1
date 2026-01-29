import React, { useState, useEffect } from 'react';
import { Compass, Navigation } from 'lucide-react';

interface QiblaCompassProps {
  coords?: GeolocationCoordinates;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ coords }) => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string>("");

  // Coordinates for Mecca (Kaaba)
  const KAABA_LAT = 21.422487;
  const KAABA_LONG = 39.826206;

  useEffect(() => {
    // Calculate Qibla whenever coords change
    if (coords) {
      calculateQibla(coords.latitude, coords.longitude);
    } else {
      // Default fallback (Dubai)
      calculateQibla(25.2048, 55.2708);
      setError("Waiting for location...");
    }
  }, [coords]);

  useEffect(() => {
    // Handle Device Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compass = 0;
      if ((e as any).webkitCompassHeading) {
        compass = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        compass = 360 - e.alpha;
      }
      setHeading(compass);
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setPermissionGranted(true);
    } else {
        setError("Compass not supported.");
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const calculateQibla = (lat: number, lng: number) => {
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const toDeg = (rad: number) => rad * (180 / Math.PI);

    const lat1 = toRad(lat);
    const lng1 = toRad(lng);
    const lat2 = toRad(KAABA_LAT);
    const lng2 = toRad(KAABA_LONG);

    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    
    let qibla = toDeg(Math.atan2(y, x));
    qibla = (qibla + 360) % 360;
    setQiblaDirection(qibla);
    if(coords) setError(""); 
  };

  const requestAccess = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        }
      } catch (e) {
        setError("Permission error");
      }
    }
  };

  const arrowRotation = qiblaDirection - heading;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fadeIn">
      
      <div className="relative w-64 h-64">
         {/* Outer Static Ring */}
         <div className="absolute inset-0 border-4 border-slate-300 dark:border-slate-700 rounded-full opacity-30"></div>
         
         {/* Compass Ring */}
         <div 
            className="w-full h-full rounded-full border-2 border-slate-400 dark:border-slate-600 relative transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-heading}deg)` }}
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">N</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">E</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">S</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">W</span>
         </div>

         {/* Kaaba Direction Indicator */}
         <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${arrowRotation}deg)` }}
         >
            <div className="relative h-full w-8">
               <div className="absolute top-4 left-1/2 -translate-x-1/2">
                   <Navigation size={48} fill="currentColor" className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>
         </div>
         
         {/* Center Point */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white dark:bg-[#161F2E] rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center z-10 shadow-sm">
               <div className="text-center">
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">{Math.round(qiblaDirection)}°</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Qibla</span>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-4 max-w-xs mx-auto">
         <div className="bg-white dark:bg-[#161F2E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
               <Compass size={16} className="text-blue-500"/>
               Compass Accuracy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
               Wave device in figure-8. {coords ? 'GPS Active.' : 'Using default loc.'}
            </p>
         </div>

         {typeof (DeviceOrientationEvent as any).requestPermission === 'function' && !permissionGranted && (
            <button 
               onClick={requestAccess}
               className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors"
            >
               Enable Compass
            </button>
         )}

         {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
};
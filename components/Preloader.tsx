import React from 'react';
import { defaultLogoBase64 } from '../utils/assets';

interface PreloaderProps {
    splashLogo: string | null;
}

const Preloader: React.FC<PreloaderProps> = ({ splashLogo }) => (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-brand-green z-50">
        <img src={splashLogo || defaultLogoBase64} alt="Spin City Rentals Logo" className="w-80 h-auto" />
        <p className="text-white text-lg mt-8">Powered By: Cicadas IT Solutions</p>
    </div>
);

export default Preloader;

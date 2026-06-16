import React from 'react';
import PinManager from './PinManager';

const PinPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Environment PIN</h1>
          <p className="text-gray-400 mt-1">Kelola PIN untuk menghubungkan perangkat baru</p>
        </div>
      </div>

      <PinManager />
    </div>
  );
};

export default PinPage;

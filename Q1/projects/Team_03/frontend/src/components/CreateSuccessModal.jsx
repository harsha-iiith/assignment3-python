import React from 'react';
import { CheckCircle, Copy } from 'lucide-react'; 

// component to show the successful creation of a class and its details
function CreateSuccessModal({ groupName, accessCode, onClose }) {
  // function to copy the access code to the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode)
      .then(() => console.log('access code copied:', accessCode))
      .catch(err => console.error('failed to copy text:', err));
  };

  return (
    // backdrop to focus attention on the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      {/* modal content container */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 text-center border border-gray-100" onClick={e=>e.stopPropagation()}>
        {/* success icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white stroke-[2.5]"/>
        </div>
        {/* success message */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">Group Created Successfully!</h3>
        {/* group name display */}
        <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-3 text-lg font-medium">
          Group: <span className="text-green-600 font-semibold">{groupName}</span>
        </div>
        {/* access code display with copy button */}
       {/* access code display with copy button */}
      <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-6 text-lg font-medium flex items-center justify-between">
        {/* access code centered */}
        <div className="flex-1 flex justify-center">
          <span className="text-blue-700 font-bold text-2xl" >{accessCode}</span>
        </div>
        {/* copy button at the far right */}
        <button onClick={handleCopy} className="ml-4 p-2 rounded-lg bg-white hover:bg-gray-200 transition-colors duration-200" title="copy access code">
          <Copy className="w-5 h-5 text-gray-800"/>
        </button>
      </div>

        {/* close button */}
        <button onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg">
          Done
        </button>
      </div>
    </div>
  );
}

export default CreateSuccessModal;

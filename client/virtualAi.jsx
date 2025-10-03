import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Palette, Shirt, Glasses, Sparkles, User, Zap } from 'lucide-react';

const VirtualTryOn = () => {
  const [currentMode, setCurrentMode] = useState('clothing');
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const modes = {
    clothing: { icon: Shirt, label: 'Clothing', color: 'blue' },
    accessories: { icon: Sparkles, label: 'Accessories', color: 'purple' },
    eyewear: { icon: Glasses, label: 'Eyewear', color: 'green' },
    makeup: { icon: Palette, label: 'Makeup', color: 'pink' }
  };

  const sampleItems = {
    clothing: [
      { id: 1, name: 'Summer Dress', color: '#FF6B6B', type: 'dress', price: '$89' },
      { id: 2, name: 'Casual Blazer', color: '#4ECDC4', type: 'blazer', price: '$129' },
      { id: 3, name: 'Denim Jacket', color: '#45B7D1', type: 'jacket', price: '$79' }
    ],
    accessories: [
      { id: 4, name: 'Gold Necklace', color: '#FFD93D', type: 'necklace', price: '$199' },
      { id: 5, name: 'Leather Handbag', color: '#8B4513', type: 'bag', price: '$249' },
      { id: 6, name: 'Silver Watch', color: '#C0C0C0', type: 'watch', price: '$159' }
    ],
    eyewear: [
      { id: 7, name: 'Classic Aviators', color: '#000000', type: 'sunglasses', price: '$149' },
      { id: 8, name: 'Round Glasses', color: '#8B4513', type: 'prescription', price: '$89' },
      { id: 9, name: 'Cat Eye Frames', color: '#FF1493', type: 'fashion', price: '$119' }
    ],
    makeup: [
      { id: 10, name: 'Red Lipstick', color: '#DC143C', type: 'lips', price: '$29' },
      { id: 11, name: 'Smokey Eyeshadow', color: '#696969', type: 'eyes', price: '$39' },
      { id: 12, name: 'Natural Blush', color: '#FFB6C1', type: 'cheeks', price: '$24' }
    ]
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for virtual try-on feature');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const analyzeUser = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        skinTone: 'Medium-Warm',
        faceShape: 'Oval',
        bodyType: 'Hourglass',
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        recommendations: {
          clothing: 'V-neck styles complement your face shape',
          accessories: 'Gold tones match your warm skin undertones',
          eyewear: 'Round or oval frames suit your face best',
          makeup: 'Warm coral and peach tones enhance your natural glow'
        }
      };
      setUserAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    // Here you would apply AR overlay logic
  };

  const getRecommendedItems = () => {
    if (!userAnalysis) return sampleItems[currentMode];
    
    // Filter items based on user analysis (simplified logic)
    return sampleItems[currentMode].filter(item => {
      return userAnalysis.colorPalette.some(color => 
        Math.abs(parseInt(color.slice(1), 16) - parseInt(item.color.slice(1), 16)) < 1000000
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Zap className="text-purple-600" />
          Style Sync Virtual Try-On
        </h1>
        <p className="text-gray-600">AI-powered virtual styling tailored to you</p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
          {Object.entries(modes).map(([key, mode]) => {
            const Icon = mode.icon;
            return (
              <button
                key={key}
                onClick={() => setCurrentMode(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentMode === key
                    ? `bg-${mode.color}-500 text-white shadow-lg`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Camera size={24} />
                Virtual Mirror
              </h3>
            </div>
            
            <div className="relative">
              {!cameraActive ? (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                    <button
                      onClick={startCamera}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Start Virtual Try-On
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  
                  {/* AR Overlay for selected item */}
                  {selectedItem && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                      <p className="font-medium">{selectedItem.name}</p>
                      <p className="text-sm opacity-90">{selectedItem.price}</p>
                    </div>
                  )}
                  
                  {/* Controls */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                      onClick={stopCamera}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Camera size={20} />
                    </button>
                    <button
                      onClick={analyzeUser}
                      disabled={isAnalyzing}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {isAnalyzing ? <RefreshCw size={20} className="animate-spin" /> : <User size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* User Analysis */}
          {userAnalysis && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Style Profile</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Skin Tone:</span>
                  <span className="ml-2 text-gray-800">{userAnalysis.skinTone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Face Shape:</span>
                  <span className="ml-2 text-gray-800">{userAnalysis.faceShape}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Your Colors:</span>
                  <div className="flex gap-2 mt-1">
                    {userAnalysis.colorPalette.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Tip:</strong> {userAnalysis.recommendations[currentMode]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Product Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {userAnalysis ? 'Recommended for You' : `${modes[currentMode].label} Collection`}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(userAnalysis ? getRecommendedItems() : sampleItems[currentMode]).map(item => (
                <div
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.type}</p>
                      <p className="text-purple-600 font-semibold">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
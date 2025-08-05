export default function CameraFeed({ cameraUrl, isConnected }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Live Camera Feed</h2>
        {isConnected ? (
          <span className="text-green-400 text-sm font-bold animate-pulse">● LIVE</span>
        ) : (
          <span className="text-red-400 text-sm">OFFLINE</span>
        )}
      </div>
      <div className="bg-black h-64 rounded-lg flex items-center justify-center overflow-hidden">
        {isConnected && cameraUrl ? (
          <img src={cameraUrl} alt="Robot Camera" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400">Camera Offline</p>
        )}
      </div>
    </div>
  );
}

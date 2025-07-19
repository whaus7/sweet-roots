const ElementDisplay = () => {
  return (
    <div>
      {/* Element Display Row */}
      <div className="flex items-center justify-center gap-8">
        {/* Carbon Element */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-xl border-4 border-green-700 shadow-lg flex flex-col items-center justify-center text-white">
            <div className="text-xs font-semibold absolute top-2 left-2">6</div>
            <div className="text-3xl font-bold">C</div>
            <div className="text-sm font-semibold">Carbon</div>
            {/* <div className="text-xs font-medium absolute bottom-2 right-2">
              12.011
            </div> */}
          </div>
        </div>

        {/* Ratio Symbol */}
        <div className="text-6xl font-bold text-gray-400">:</div>

        {/* Nitrogen Element */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl border-4 border-blue-700 shadow-lg flex flex-col items-center justify-center text-white">
            <div className="text-xs font-semibold absolute top-2 left-2">7</div>
            <div className="text-3xl font-bold">N</div>
            <div className="text-sm font-semibold">Nitrogen</div>
            {/* <div className="text-xs font-medium absolute bottom-2 right-2">
              14.007
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementDisplay;

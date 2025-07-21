import type { ShedConfig } from '@shared/schema';

interface Shed3DViewerProps {
  config: ShedConfig;
}

export default function Shed3DViewer({ config }: Shed3DViewerProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-neutral-200 h-96 p-4 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 h-full max-h-full">
        
        {/* Top View (Plan) */}
        <div className="border border-neutral-300 rounded p-2 overflow-hidden">
          <h4 className="text-xs font-medium text-neutral-700 mb-1 text-center">PLAN VIEW</h4>
          <svg viewBox="0 0 200 140" className="w-full h-24">
            {/* Floor outline */}
            <rect 
              x={100 - (config.length * 6)} 
              y={80 - (config.width * 5)} 
              width={config.length * 12} 
              height={config.width * 10}
              fill="#f8fafc" 
              stroke="#1e293b" 
              strokeWidth="2"
            />
            
            {/* Wall thickness (interior lines) */}
            <rect 
              x={100 - (config.length * 6) + 3} 
              y={80 - (config.width * 5) + 3} 
              width={config.length * 12 - 6} 
              height={config.width * 10 - 6}
              fill="none" 
              stroke="#64748b" 
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            
            {/* Door opening */}
            {config.doorCount > 0 && (
              <>
                <rect 
                  x={100 - (config.length * 3)} 
                  y={80 + (config.width * 5) - 2} 
                  width="24" 
                  height="4"
                  fill="white"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
                <path 
                  d={`M ${100 - (config.length * 3)} ${80 + (config.width * 5) + 2} Q ${100 - (config.length * 3) + 12} ${80 + (config.width * 5) + 14} ${100 - (config.length * 3) + 24} ${80 + (config.width * 5) + 2}`}
                  stroke="#8b5cf6" 
                  strokeWidth="1" 
                  fill="none"
                />
              </>
            )}
            
            {/* Windows */}
            {Array.from({ length: Math.min(config.windowCount, 3) }).map((_, i) => (
              <rect 
                key={i}
                x={100 - (config.length * 4) + (i * 20)} 
                y={80 - (config.width * 5) - 1} 
                width="12" 
                height="3"
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="1"
              />
            ))}
            
            {/* Dimensions */}
            <text x={100} y={80 + (config.width * 5) + 15} textAnchor="middle" className="text-xs fill-neutral-600">
              {config.length}' × {config.width}'
            </text>
            
            {/* Floor joists representation */}
            <g stroke="#cbd5e1" strokeWidth="0.5" opacity="0.7">
              {Array.from({ length: Math.floor(config.length / 2) }).map((_, i) => (
                <line 
                  key={i}
                  x1={100 - (config.length * 6) + 6 + (i * 12)} 
                  y1={80 - (config.width * 5) + 3} 
                  x2={100 - (config.length * 6) + 6 + (i * 12)} 
                  y2={80 + (config.width * 5) - 3}
                />
              ))}
            </g>
          </svg>
        </div>
        
        {/* Front Elevation */}
        <div className="border border-neutral-300 rounded p-2 overflow-hidden">
          <h4 className="text-xs font-medium text-neutral-700 mb-1 text-center">FRONT ELEVATION</h4>
          <svg viewBox="0 0 200 140" className="w-full h-24">
            {/* Foundation */}
            <rect 
              x={100 - (config.length * 6)} 
              y={130} 
              width={config.length * 12} 
              height="8"
              fill="#9ca3af" 
              stroke="#374151" 
              strokeWidth="1"
            />
            
            {/* Wall */}
            <rect 
              x={100 - (config.length * 6)} 
              y={130 - (config.wallHeight * 8)} 
              width={config.length * 12} 
              height={config.wallHeight * 8}
              fill="#fde68a" 
              stroke="#92400e" 
              strokeWidth="2"
            />
            
            {/* Roof */}
            {config.roofType === 'gable' && (
              <polygon 
                points={`${100 - (config.length * 6)},${130 - (config.wallHeight * 8)} ${100},${130 - (config.wallHeight * 8) - 20} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8)}`}
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            {config.roofType === 'gambrel' && (
              <>
                <polygon 
                  points={`${100 - (config.length * 6)},${130 - (config.wallHeight * 8)} ${100 - (config.length * 3)},${130 - (config.wallHeight * 8) - 15} ${100},${130 - (config.wallHeight * 8) - 18} ${100 + (config.length * 3)},${130 - (config.wallHeight * 8) - 15} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8)}`}
                  fill="#7c2d12" 
                  stroke="#451a03" 
                  strokeWidth="2"
                />
              </>
            )}
            {config.roofType === 'hip' && (
              <rect 
                x={100 - (config.length * 6)} 
                y={130 - (config.wallHeight * 8) - 15} 
                width={config.length * 12} 
                height="15"
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            {(config.roofType === 'shed' || config.roofType === 'lean-to') && (
              <polygon 
                points={`${100 - (config.length * 6)},${130 - (config.wallHeight * 8)} ${100 - (config.length * 6)},${130 - (config.wallHeight * 8) - 15} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8) - 5} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8)}`}
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            {config.roofType === 'saltbox' && (
              <polygon 
                points={`${100 - (config.length * 6)},${130 - (config.wallHeight * 8)} ${100 - (config.length * 2)},${130 - (config.wallHeight * 8) - 20} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8) - 5}`}
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            
            {/* Door */}
            {config.doorCount > 0 && (
              <rect 
                x={100 - 12} 
                y={130 - (config.wallHeight * 6)} 
                width="24" 
                height={config.wallHeight * 6}
                fill="#8b5cf6" 
                stroke="#7c3aed" 
                strokeWidth="2"
              />
            )}
            
            {/* Windows */}
            {Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => (
              <rect 
                key={i}
                x={100 - (config.length * 3) + (i * 30)} 
                y={130 - (config.wallHeight * 4)} 
                width="16" 
                height="12"
                fill="#3b82f6" 
                stroke="#1e40af" 
                strokeWidth="1.5"
              />
            ))}
            
            {/* Wall studs */}
            <g stroke="#92400e" strokeWidth="0.5" opacity="0.6">
              {Array.from({ length: Math.floor(config.length / 2) }).map((_, i) => (
                <line 
                  key={i}
                  x1={100 - (config.length * 6) + 6 + (i * 12)} 
                  y1={130} 
                  x2={100 - (config.length * 6) + 6 + (i * 12)} 
                  y2={130 - (config.wallHeight * 8)}
                />
              ))}
            </g>
            
            {/* Height dimension */}
            <text x={100 + (config.length * 6) + 15} y={130 - (config.wallHeight * 4)} textAnchor="middle" className="text-xs fill-neutral-600" transform={`rotate(-90 ${100 + (config.length * 6) + 15} ${130 - (config.wallHeight * 4)})`}>
              {config.wallHeight}'
            </text>
          </svg>
        </div>
        
        {/* Side Elevation */}
        <div className="border border-neutral-300 rounded p-2 overflow-hidden">
          <h4 className="text-xs font-medium text-neutral-700 mb-1 text-center">SIDE ELEVATION</h4>
          <svg viewBox="0 0 200 140" className="w-full h-24">
            {/* Foundation */}
            <rect 
              x={100 - (config.width * 6)} 
              y={130} 
              width={config.width * 12} 
              height="8"
              fill="#9ca3af" 
              stroke="#374151" 
              strokeWidth="1"
            />
            
            {/* Wall */}
            <rect 
              x={100 - (config.width * 6)} 
              y={130 - (config.wallHeight * 8)} 
              width={config.width * 12} 
              height={config.wallHeight * 8}
              fill="#fde68a" 
              stroke="#92400e" 
              strokeWidth="2"
            />
            
            {/* Roof */}
            {(config.roofType === 'gable' || config.roofType === 'gambrel' || config.roofType === 'saltbox') && (
              <rect 
                x={100 - (config.width * 6)} 
                y={130 - (config.wallHeight * 8) - 20} 
                width={config.width * 12} 
                height="20"
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            {config.roofType === 'hip' && (
              <polygon 
                points={`${100 - (config.width * 6)},${130 - (config.wallHeight * 8)} ${100 - (config.width * 3)},${130 - (config.wallHeight * 8) - 15} ${100 + (config.width * 3)},${130 - (config.wallHeight * 8) - 15} ${100 + (config.width * 6)},${130 - (config.wallHeight * 8)}`}
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            {(config.roofType === 'shed' || config.roofType === 'lean-to') && (
              <polygon 
                points={`${100 - (config.width * 6)},${130 - (config.wallHeight * 8) - 20} ${100 + (config.width * 6)},${130 - (config.wallHeight * 8) - 5} ${100 + (config.width * 6)},${130 - (config.wallHeight * 8)} ${100 - (config.width * 6)},${130 - (config.wallHeight * 8)}`}
                fill="#7c2d12" 
                stroke="#451a03" 
                strokeWidth="2"
              />
            )}
            
            {/* Side windows */}
            {config.windowCount > 2 && (
              <rect 
                x={100 - 8} 
                y={130 - (config.wallHeight * 4)} 
                width="16" 
                height="12"
                fill="#3b82f6" 
                stroke="#1e40af" 
                strokeWidth="1.5"
              />
            )}
            
            {/* Wall studs */}
            <g stroke="#92400e" strokeWidth="0.5" opacity="0.6">
              {Array.from({ length: Math.floor(config.width / 2) }).map((_, i) => (
                <line 
                  key={i}
                  x1={100 - (config.width * 6) + 6 + (i * 12)} 
                  y1={130} 
                  x2={100 - (config.width * 6) + 6 + (i * 12)} 
                  y2={130 - (config.wallHeight * 8)}
                />
              ))}
            </g>
          </svg>
        </div>
        
        {/* Cross Section */}
        <div className="border border-neutral-300 rounded p-2 overflow-hidden">
          <h4 className="text-xs font-medium text-neutral-700 mb-1 text-center">CROSS SECTION</h4>
          <svg viewBox="0 0 200 140" className="w-full h-24">
            {/* Foundation slab */}
            <rect 
              x={100 - (config.width * 6)} 
              y={130} 
              width={config.width * 12} 
              height="8"
              fill="#9ca3af" 
              stroke="#374151" 
              strokeWidth="2"
            />
            
            {/* Floor joists */}
            <g>
              {Array.from({ length: Math.floor(config.width / 2) }).map((_, i) => (
                <rect 
                  key={i}
                  x={100 - (config.width * 6) + 6 + (i * 12)} 
                  y={125} 
                  width="2" 
                  height="10"
                  fill="#92400e"
                />
              ))}
            </g>
            
            {/* Floor decking */}
            <rect 
              x={100 - (config.width * 6)} 
              y={123} 
              width={config.width * 12} 
              height="2"
              fill="#fbbf24" 
              stroke="#92400e" 
              strokeWidth="1"
            />
            
            {/* Walls */}
            <rect 
              x={100 - (config.width * 6)} 
              y={123 - (config.wallHeight * 8)} 
              width="4" 
              height={config.wallHeight * 8}
              fill="#fef3c7" 
              stroke="#92400e" 
              strokeWidth="1"
            />
            <rect 
              x={100 + (config.width * 6) - 4} 
              y={123 - (config.wallHeight * 8)} 
              width="4" 
              height={config.wallHeight * 8}
              fill="#fef3c7" 
              stroke="#92400e" 
              strokeWidth="1"
            />
            
            {/* Roof structure */}
            {config.roofType === 'gable' && (
              <>
                <line 
                  x1={100 - (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100} 
                  y2={123 - (config.wallHeight * 8) - 25}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 + (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100} 
                  y2={123 - (config.wallHeight * 8) - 25}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100} 
                  y2={123 - (config.wallHeight * 8) - 25}
                  stroke="#451a03" 
                  strokeWidth="2"
                />
              </>
            )}
            {config.roofType === 'hip' && (
              <>
                <line 
                  x1={100 - (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100 - (config.width * 3)} 
                  y2={123 - (config.wallHeight * 8) - 15}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 + (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100 + (config.width * 3)} 
                  y2={123 - (config.wallHeight * 8) - 15}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 - (config.width * 3)} 
                  y1={123 - (config.wallHeight * 8) - 15} 
                  x2={100 + (config.width * 3)} 
                  y2={123 - (config.wallHeight * 8) - 15}
                  stroke="#451a03" 
                  strokeWidth="2"
                />
              </>
            )}
            {(config.roofType === 'shed' || config.roofType === 'lean-to') && (
              <line 
                x1={100 - (config.width * 6)} 
                y1={123 - (config.wallHeight * 8)} 
                x2={100 + (config.width * 6)} 
                y2={123 - (config.wallHeight * 8) - 20}
                stroke="#451a03" 
                strokeWidth="3"
              />
            )}
            {config.roofType === 'gambrel' && (
              <>
                <line 
                  x1={100 - (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100 - (config.width * 3)} 
                  y2={123 - (config.wallHeight * 8) - 10}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 - (config.width * 3)} 
                  y1={123 - (config.wallHeight * 8) - 10} 
                  x2={100} 
                  y2={123 - (config.wallHeight * 8) - 25}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100} 
                  y1={123 - (config.wallHeight * 8) - 25} 
                  x2={100 + (config.width * 3)} 
                  y2={123 - (config.wallHeight * 8) - 10}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 + (config.width * 3)} 
                  y1={123 - (config.wallHeight * 8) - 10} 
                  x2={100 + (config.width * 6)} 
                  y2={123 - (config.wallHeight * 8)}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
              </>
            )}
            {config.roofType === 'saltbox' && (
              <>
                <line 
                  x1={100 - (config.width * 6)} 
                  y1={123 - (config.wallHeight * 8)} 
                  x2={100 - (config.width * 2)} 
                  y2={123 - (config.wallHeight * 8) - 25}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
                <line 
                  x1={100 - (config.width * 2)} 
                  y1={123 - (config.wallHeight * 8) - 25} 
                  x2={100 + (config.width * 6)} 
                  y2={123 - (config.wallHeight * 8) - 5}
                  stroke="#451a03" 
                  strokeWidth="3"
                />
              </>
            )}
            
            {/* Labels */}
            <text x={100 - (config.width * 3)} y={140} className="text-xs fill-neutral-600">Foundation</text>
            <text x={100 - (config.width * 3)} y={115} className="text-xs fill-neutral-600">Floor Joists</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
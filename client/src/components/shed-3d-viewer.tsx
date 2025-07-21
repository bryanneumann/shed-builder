import { Button } from '@/components/ui/button';
import { Box, Compass } from 'lucide-react';
import type { ShedConfig } from '@shared/schema';

interface Shed3DViewerProps {
  config: ShedConfig;
  view: '3d' | 'blueprint';
  onViewChange: (view: '3d' | 'blueprint') => void;
}

export default function Shed3DViewer({ config, view, onViewChange }: Shed3DViewerProps) {
  
  if (view === 'blueprint') {
    return (
      <div className="bg-white rounded-lg border-2 border-neutral-200 h-96 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          
          {/* Top View (Plan) */}
          <div className="border border-neutral-300 rounded p-2">
            <h4 className="text-xs font-medium text-neutral-700 mb-2 text-center">PLAN VIEW</h4>
            <svg viewBox="0 0 200 160" className="w-full h-full">
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
              
              {/* Joists */}
              <g stroke="#94a3b8" strokeWidth="0.5">
                {Array.from({ length: Math.floor(config.width / 2) }).map((_, i) => (
                  <line 
                    key={i}
                    x1={100 - (config.length * 6) + 3} 
                    y1={80 - (config.width * 5) + 8 + (i * 10)} 
                    x2={100 + (config.length * 6) - 3} 
                    y2={80 - (config.width * 5) + 8 + (i * 10)}
                  />
                ))}
              </g>
              
              {/* Dimensions */}
              <text x={100} y={80 + (config.width * 5) + 15} textAnchor="middle" className="text-xs fill-neutral-600">
                {config.length}'
              </text>
              <text x={100 - (config.length * 6) - 15} y={85} textAnchor="middle" className="text-xs fill-neutral-600" transform={`rotate(-90 ${100 - (config.length * 6) - 15} 85)`}>
                {config.width}'
              </text>
            </svg>
          </div>
          
          {/* Front Elevation */}
          <div className="border border-neutral-300 rounded p-2">
            <h4 className="text-xs font-medium text-neutral-700 mb-2 text-center">FRONT ELEVATION</h4>
            <svg viewBox="0 0 200 160" className="w-full h-full">
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
                fill="#fef3c7" 
                stroke="#92400e" 
                strokeWidth="2"
              />
              
              {/* Roof */}
              {config.roofType === 'gable' && (
                <>
                  <polygon 
                    points={`${100 - (config.length * 6)},${130 - (config.wallHeight * 8)} ${100},${130 - (config.wallHeight * 8) - 20} ${100 + (config.length * 6)},${130 - (config.wallHeight * 8)}`}
                    fill="#7c2d12" 
                    stroke="#451a03" 
                    strokeWidth="2"
                  />
                  <line 
                    x1={100} 
                    y1={130 - (config.wallHeight * 8) - 20} 
                    x2={100} 
                    y2={130 - (config.wallHeight * 8)}
                    stroke="#451a03" 
                    strokeWidth="1"
                  />
                </>
              )}
              
              {/* Door */}
              {config.doorCount > 0 && (
                <rect 
                  x={100 - 10} 
                  y={130 - (config.wallHeight * 6)} 
                  width="20" 
                  height={config.wallHeight * 6}
                  fill="#8b5cf6" 
                  stroke="#5b21b6" 
                  strokeWidth="2"
                />
              )}
              
              {/* Windows */}
              {Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => (
                <rect 
                  key={i}
                  x={100 - 30 + (i * 40)} 
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
          <div className="border border-neutral-300 rounded p-2">
            <h4 className="text-xs font-medium text-neutral-700 mb-2 text-center">SIDE ELEVATION</h4>
            <svg viewBox="0 0 200 160" className="w-full h-full">
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
              {config.roofType === 'gable' && (
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
          <div className="border border-neutral-300 rounded p-2">
            <h4 className="text-xs font-medium text-neutral-700 mb-2 text-center">CROSS SECTION</h4>
            <svg viewBox="0 0 200 160" className="w-full h-full">
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
              
              {/* Labels */}
              <text x={100 - (config.width * 3)} y={140} className="text-xs fill-neutral-600">Foundation</text>
              <text x={100 - (config.width * 3)} y={115} className="text-xs fill-neutral-600">Floor Joists</text>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-lg border-2 border-neutral-200 h-96 p-6">
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
            {/* 3D Isometric View */}
            
            {/* Foundation (bottom face) */}
            <polygon 
              points={`${120},${220} ${120 + config.length * 12},${220} ${160 + config.length * 12},${180} ${160},${180}`}
              fill="#d1d5db" 
              stroke="#374151" 
              strokeWidth="1.5"
            />
            
            {/* Floor */}
            <polygon 
              points={`${120},${210} ${120 + config.length * 12},${210} ${160 + config.length * 12},${170} ${160},${170}`}
              fill="#f9fafb" 
              stroke="#6b7280" 
              strokeWidth="1"
            />
            
            {/* Front wall */}
            <polygon 
              points={`${120},${210} ${120},${210 - config.wallHeight * 8} ${160},${170 - config.wallHeight * 8} ${160},${170}`}
              fill="#fef3c7" 
              stroke="#92400e" 
              strokeWidth="1.5"
            />
            
            {/* Side wall */}
            <polygon 
              points={`${160},${170} ${160},${170 - config.wallHeight * 8} ${160 + config.length * 12},${170 - config.wallHeight * 8} ${160 + config.length * 12},${170}`}
              fill="#fde68a" 
              stroke="#92400e" 
              strokeWidth="1.5"
            />
            
            {/* Roof (gable style) */}
            {config.roofType === 'gable' && (
              <>
                {/* Left roof face */}
                <polygon 
                  points={`${120},${210 - config.wallHeight * 8} ${140},${190 - config.wallHeight * 8} ${180 + config.length * 12},${150 - config.wallHeight * 8} ${160 + config.length * 12},${170 - config.wallHeight * 8}`}
                  fill="#7c2d12" 
                  stroke="#451a03" 
                  strokeWidth="1.5"
                />
                {/* Right roof face */}
                <polygon 
                  points={`${160},${170 - config.wallHeight * 8} ${180 + config.length * 12},${150 - config.wallHeight * 8} ${140 + config.length * 12},${190 - config.wallHeight * 8} ${120 + config.length * 12},${210 - config.wallHeight * 8}`}
                  fill="#92400e" 
                  stroke="#451a03" 
                  strokeWidth="1.5"
                />
              </>
            )}
            
            {/* Door */}
            {config.doorCount > 0 && (
              <rect 
                x={125} 
                y={210 - config.wallHeight * 6} 
                width="12" 
                height={config.wallHeight * 6}
                fill="#8b5cf6" 
                stroke="#5b21b6" 
                strokeWidth="1"
              />
            )}
            
            {/* Windows on front wall */}
            {Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => (
              <rect 
                key={i}
                x={140 + (i * 20)} 
                y={210 - config.wallHeight * 4} 
                width="12" 
                height="8"
                fill="#3b82f6" 
                stroke="#1d4ed8" 
                strokeWidth="1"
              />
            ))}
            
            {/* Framing lines */}
            <g stroke="#6b7280" strokeWidth="0.5" opacity="0.6">
              {/* Vertical studs on front wall */}
              {Array.from({ length: Math.floor(config.width / 2) + 1 }).map((_, i) => (
                <line 
                  key={i}
                  x1={120 + (i * 16)} 
                  y1={210} 
                  x2={120 + (i * 16)} 
                  y2={210 - config.wallHeight * 8}
                />
              ))}
            </g>
            
            {/* Dimensions */}
            <text x={140 + (config.length * 6)} y={235} textAnchor="middle" className="text-xs fill-neutral-600">
              {config.length}'
            </text>
            <text x={90} y={190} textAnchor="middle" className="text-xs fill-neutral-600" transform={`rotate(-30 90 190)`}>
              {config.width}'
            </text>
            <text x={110} y={170} textAnchor="middle" className="text-xs fill-neutral-600" transform={`rotate(-90 110 170)`}>
              {config.wallHeight}'
            </text>
          </svg>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-600">
            {config.foundationType.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • 
            {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof • 
            {config.lumberGrade.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <Button
          size="sm"
          variant={view === '3d' ? 'default' : 'secondary'}
          onClick={() => onViewChange('3d')}
          className="text-xs"
        >
          <Box className="h-3 w-3 mr-1" />
          Isometric
        </Button>
        <Button
          size="sm"
          variant={view === 'blueprint' ? 'default' : 'secondary'}
          onClick={() => onViewChange('blueprint')}
          className="text-xs"
        >
          <Compass className="h-3 w-3 mr-1" />
          Blueprints
        </Button>
      </div>
    </div>
  );
}

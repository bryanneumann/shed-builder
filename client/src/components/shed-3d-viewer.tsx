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
      <div className="bg-white rounded-lg border-2 border-neutral-200 h-96 p-6">
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-md">
            {/* Foundation/Floor */}
            <rect 
              x={200 - (config.length * 8)} 
              y={150 - (config.width * 6)} 
              width={config.length * 16} 
              height={config.width * 12}
              fill="#f3f4f6" 
              stroke="#374151" 
              strokeWidth="2"
            />
            
            {/* Walls */}
            <rect 
              x={200 - (config.length * 8)} 
              y={150 - (config.width * 6)} 
              width={config.length * 16} 
              height={config.width * 12}
              fill="none" 
              stroke="#6b7280" 
              strokeWidth="1.5"
            />
            
            {/* Roof outline for gable */}
            {config.roofType === 'gable' && (
              <>
                <line 
                  x1={200 - (config.length * 8)} 
                  y1={150 - (config.width * 6)} 
                  x2={200} 
                  y2={150 - (config.width * 6) - 30}
                  stroke="#374151" 
                  strokeWidth="2"
                />
                <line 
                  x1={200} 
                  y1={150 - (config.width * 6) - 30} 
                  x2={200 + (config.length * 8)} 
                  y2={150 - (config.width * 6)}
                  stroke="#374151" 
                  strokeWidth="2"
                />
                <line 
                  x1={200 - (config.length * 8)} 
                  y1={150 + (config.width * 6)} 
                  x2={200} 
                  y2={150 + (config.width * 6) - 30}
                  stroke="#374151" 
                  strokeWidth="2"
                />
                <line 
                  x1={200} 
                  y1={150 + (config.width * 6) - 30} 
                  x2={200 + (config.length * 8)} 
                  y2={150 + (config.width * 6)}
                  stroke="#374151" 
                  strokeWidth="2"
                />
              </>
            )}
            
            {/* Door */}
            {config.doorCount > 0 && (
              <rect 
                x={200 - (config.length * 4)} 
                y={150 + (config.width * 6) - 2} 
                width="20" 
                height="4"
                fill="#8b5cf6"
              />
            )}
            
            {/* Windows */}
            {Array.from({ length: config.windowCount }).map((_, i) => (
              <rect 
                key={i}
                x={200 - (config.length * 6) + (i * 25)} 
                y={150 - (config.width * 6) - 2} 
                width="15" 
                height="4"
                fill="#3b82f6"
              />
            ))}
            
            {/* Dimensions */}
            <text x={200} y={150 + (config.width * 6) + 25} textAnchor="middle" className="text-xs fill-neutral-600">
              {config.length}' × {config.width}'
            </text>
          </svg>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-600">
            {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof • 
            {config.doorCount} Door{config.doorCount !== 1 ? 's' : ''} • 
            {config.windowCount} Window{config.windowCount !== 1 ? 's' : ''}
          </p>
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
          Top View
        </Button>
      </div>
    </div>
  );
}

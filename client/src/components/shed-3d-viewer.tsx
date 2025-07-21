import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Box, Compass } from 'lucide-react';
import type { ShedConfig } from '@shared/schema';

interface Shed3DViewerProps {
  config: ShedConfig;
  view: '3d' | 'blueprint';
  onViewChange: (view: '3d' | 'blueprint') => void;
}

export default function Shed3DViewer({ config, view, onViewChange }: Shed3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (view === '3d' && containerRef.current) {
      loadThreeJS();
    }
  }, [view, config]);

  const loadThreeJS = async () => {
    try {
      setIsLoading(true);
      
      // Dynamically import Three.js to avoid SSR issues
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { setupScene, createShedGeometry } = await import('@/lib/three-utils');
      
      // Clear previous content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      const { scene, camera, renderer } = setupScene();
      
      // Create shed geometry
      const shedGroup = createShedGeometry({
        length: config.length,
        width: config.width,
        height: config.height,
        wallHeight: config.wallHeight,
        roofType: config.roofType,
      });
      
      scene.add(shedGroup);
      
      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = true;
      
      // Set initial camera position based on shed size
      const maxDimension = Math.max(config.length, config.width, config.height);
      camera.position.set(
        maxDimension * 1.5,
        maxDimension * 1.2,
        maxDimension * 1.5
      );
      controls.update();
      
      // Add renderer to container
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
        
        // Make renderer responsive
        const resizeObserver = new ResizeObserver(() => {
          if (containerRef.current) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        });
        
        resizeObserver.observe(containerRef.current);
        
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
        
        // Cleanup function
        return () => {
          resizeObserver.disconnect();
          scene.clear();
          renderer.dispose();
        };
      }
    } catch (error) {
      console.error('Failed to load 3D viewer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetView = () => {
    // Reset camera position would go here
    console.log('Reset view');
  };

  const handleZoomIn = () => {
    // Zoom functionality would go here
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Zoom functionality would go here
    console.log('Zoom out');
  };

  if (view === 'blueprint') {
    return (
      <div className="bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300 h-96 flex items-center justify-center relative">
        <div className="text-center text-neutral-600">
          <Compass className="mx-auto h-16 w-16 mb-4" />
          <p className="text-lg font-medium">Blueprint View</p>
          <p className="text-sm opacity-75">
            {config.length}' x {config.width}' {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Shed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300 h-96 relative overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-neutral-600">Loading 3D viewer...</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white">
          <div className="text-center">
            <Box className="mx-auto h-12 w-12 mb-2" />
            <p className="text-lg font-medium">3D Shed Visualization</p>
            <p className="text-sm opacity-75">
              {config.length}' x {config.width}' {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Shed
            </p>
          </div>
        </div>
      </div>
      
      {/* 3D Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleResetView}
          className="p-2 bg-white shadow-md hover:shadow-lg"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          className="p-2 bg-white shadow-md hover:shadow-lg"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          className="p-2 bg-white shadow-md hover:shadow-lg"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
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
          3D View
        </Button>
        <Button
          size="sm"
          variant={view === 'blueprint' ? 'default' : 'secondary'}
          onClick={() => onViewChange('blueprint')}
          className="text-xs"
        >
          <Compass className="h-3 w-3 mr-1" />
          Blueprint
        </Button>
      </div>
    </div>
  );
}

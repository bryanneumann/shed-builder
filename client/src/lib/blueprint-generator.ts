import type { ShedConfig } from '@shared/schema';

export function generatePlanViewSVG(config: ShedConfig): string {
  return `
    <svg viewBox="0 0 200 140" style="width: 100%; height: 200px; border: 1px solid #000;">
      <!-- Floor outline -->
      <rect 
        x="${100 - (config.length * 6)}" 
        y="${80 - (config.width * 5)}" 
        width="${config.length * 12}" 
        height="${config.width * 10}"
        fill="white" 
        stroke="#000" 
        stroke-width="2"
      />
      
      <!-- Wall thickness (interior lines) -->
      <rect 
        x="${100 - (config.length * 6) + 3}" 
        y="${80 - (config.width * 5) + 3}" 
        width="${config.length * 12 - 6}" 
        height="${config.width * 10 - 6}"
        fill="none" 
        stroke="#666" 
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      
      ${config.doorCount > 0 ? `
        <!-- Door opening -->
        <rect 
          x="${100 - (config.length * 3)}" 
          y="${80 + (config.width * 5) - 2}" 
          width="24" 
          height="4"
          fill="white"
          stroke="#8b5cf6"
          stroke-width="2"
        />
        <path 
          d="M ${100 - (config.length * 3)} ${80 + (config.width * 5) + 2} Q ${100 - (config.length * 3) + 12} ${80 + (config.width * 5) + 14} ${100 - (config.length * 3) + 24} ${80 + (config.width * 5) + 2}"
          stroke="#8b5cf6" 
          stroke-width="1" 
          fill="none"
        />
      ` : ''}
      
      ${Array.from({ length: Math.min(config.windowCount, 3) }).map((_, i) => `
        <rect 
          x="${100 - (config.length * 4) + (i * 20)}" 
          y="${80 - (config.width * 5) - 1}" 
          width="12" 
          height="3"
          fill="#3b82f6"
          stroke="#1e40af"
          stroke-width="1"
        />
      `).join('')}
      
      <!-- Dimensions -->
      <text x="100" y="${80 + (config.width * 5) + 15}" text-anchor="middle" font-size="12" fill="#000">
        ${config.length}' × ${config.width}'
      </text>
      
      <!-- Floor joists representation -->
      <g stroke="#ccc" stroke-width="0.5" opacity="0.7">
        ${Array.from({ length: Math.floor(config.length / 2) }).map((_, i) => `
          <line 
            x1="${100 - (config.length * 6) + 6 + (i * 12)}" 
            y1="${80 - (config.width * 5) + 3}" 
            x2="${100 - (config.length * 6) + 6 + (i * 12)}" 
            y2="${80 + (config.width * 5) - 3}"
          />
        `).join('')}
      </g>
    </svg>
  `;
}

export function generateFrontElevationSVG(config: ShedConfig): string {
  return `
    <svg viewBox="0 0 200 140" style="width: 100%; height: 200px; border: 1px solid #000;">
      <!-- Foundation -->
      <rect 
        x="${100 - (config.length * 6)}" 
        y="130" 
        width="${config.length * 12}" 
        height="8"
        fill="#9ca3af" 
        stroke="#374151" 
        stroke-width="1"
      />
      
      <!-- Wall -->
      <rect 
        x="${100 - (config.length * 6)}" 
        y="${130 - (config.wallHeight * 8)}" 
        width="${config.length * 12}" 
        height="${config.wallHeight * 8}"
        fill="#fde68a" 
        stroke="#92400e" 
        stroke-width="2"
      />
      
      ${getRoofSVG(config)}
      
      ${config.doorCount > 0 ? `
        <!-- Door -->
        <rect 
          x="${100 - 12}" 
          y="${130 - (config.wallHeight * 6)}" 
          width="24" 
          height="${config.wallHeight * 6}"
          fill="#8b5cf6" 
          stroke="#7c3aed" 
          stroke-width="2"
        />
      ` : ''}
      
      ${Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => `
        <rect 
          x="${100 - 30 + (i * 60)}" 
          y="${130 - (config.wallHeight * 5)}" 
          width="16" 
          height="12"
          fill="#3b82f6" 
          stroke="#1e40af" 
          stroke-width="1"
        />
      `).join('')}
      
      <!-- Dimensions -->
      <text x="100" y="150" text-anchor="middle" font-size="12" fill="#000">
        ${config.length}' LENGTH
      </text>
    </svg>
  `;
}

export function generateSideElevationSVG(config: ShedConfig): string {
  return `
    <svg viewBox="0 0 200 140" style="width: 100%; height: 200px; border: 1px solid #000;">
      <!-- Foundation -->
      <rect 
        x="${100 - (config.width * 6)}" 
        y="130" 
        width="${config.width * 12}" 
        height="8"
        fill="#9ca3af" 
        stroke="#374151" 
        stroke-width="1"
      />
      
      <!-- Wall -->
      <rect 
        x="${100 - (config.width * 6)}" 
        y="${130 - (config.wallHeight * 8)}" 
        width="${config.width * 12}" 
        height="${config.wallHeight * 8}"
        fill="#fde68a" 
        stroke="#92400e" 
        stroke-width="2"
      />
      
      ${getSideRoofSVG(config)}
      
      <!-- Window -->
      ${config.windowCount > 0 ? `
        <rect 
          x="${100 - 8}" 
          y="${130 - (config.wallHeight * 5)}" 
          width="16" 
          height="12"
          fill="#3b82f6" 
          stroke="#1e40af" 
          stroke-width="1"
        />
      ` : ''}
      
      <!-- Dimensions -->
      <text x="100" y="150" text-anchor="middle" font-size="12" fill="#000">
        ${config.width}' WIDTH
      </text>
    </svg>
  `;
}

export function generateCrossSectionSVG(config: ShedConfig): string {
  return `
    <svg viewBox="0 0 200 140" style="width: 100%; height: 200px; border: 1px solid #000;">
      <!-- Foundation -->
      <rect 
        x="${100 - (config.width * 6)}" 
        y="130" 
        width="${config.width * 12}" 
        height="8"
        fill="#9ca3af" 
        stroke="#374151" 
        stroke-width="1"
      />
      
      <!-- Floor joists -->
      <g stroke="#8b4513" stroke-width="2">
        ${Array.from({ length: Math.floor(config.width / 2) + 1 }).map((_, i) => `
          <line 
            x1="${100 - (config.width * 6) + (i * 12)}" 
            y1="130" 
            x2="${100 - (config.width * 6) + (i * 12)}" 
            y2="125"
          />
        `).join('')}
      </g>
      
      <!-- Wall studs -->
      <g stroke="#8b4513" stroke-width="1.5">
        ${Array.from({ length: Math.floor(config.width / 1.33) + 1 }).map((_, i) => `
          <line 
            x1="${100 - (config.width * 6) + (i * 8)}" 
            y1="130" 
            x2="${100 - (config.width * 6) + (i * 8)}" 
            y2="${130 - (config.wallHeight * 8)}"
          />
        `).join('')}
      </g>
      
      <!-- Walls -->
      <rect 
        x="${100 - (config.width * 6)}" 
        y="${130 - (config.wallHeight * 8)}" 
        width="3" 
        height="${config.wallHeight * 8}"
        fill="#fde68a" 
        stroke="#92400e" 
        stroke-width="1"
      />
      <rect 
        x="${100 + (config.width * 6) - 3}" 
        y="${130 - (config.wallHeight * 8)}" 
        width="3" 
        height="${config.wallHeight * 8}"
        fill="#fde68a" 
        stroke="#92400e" 
        stroke-width="1"
      />
      
      ${getCrossSectionRoofSVG(config)}
      
      <!-- Dimensions -->
      <text x="100" y="150" text-anchor="middle" font-size="12" fill="#000">
        CROSS SECTION - ${config.width}' SPAN
      </text>
    </svg>
  `;
}

function getRoofSVG(config: ShedConfig): string {
  const baseY = 130 - (config.wallHeight * 8);
  const leftX = 100 - (config.length * 6);
  const rightX = 100 + (config.length * 6);
  
  switch (config.roofType) {
    case 'gable':
      return `
        <polygon 
          points="${leftX},${baseY} 100,${baseY - 20} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    case 'gambrel':
      return `
        <polygon 
          points="${leftX},${baseY} ${100 - (config.length * 3)},${baseY - 15} 100,${baseY - 18} ${100 + (config.length * 3)},${baseY - 15} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    case 'hip':
      return `
        <rect 
          x="${leftX}" 
          y="${baseY - 15}" 
          width="${config.length * 12}" 
          height="15"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    case 'shed':
    case 'lean-to':
      return `
        <polygon 
          points="${leftX},${baseY} ${leftX},${baseY - 15} ${rightX},${baseY - 5} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    case 'saltbox':
      return `
        <polygon 
          points="${leftX},${baseY} ${100 - (config.length * 2)},${baseY - 20} ${rightX},${baseY - 5}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    default:
      return '';
  }
}

function getSideRoofSVG(config: ShedConfig): string {
  const baseY = 130 - (config.wallHeight * 8);
  const leftX = 100 - (config.width * 6);
  const rightX = 100 + (config.width * 6);
  
  switch (config.roofType) {
    case 'gable':
      return `
        <polygon 
          points="${leftX},${baseY} 100,${baseY - 20} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    case 'hip':
      return `
        <polygon 
          points="${leftX + 10},${baseY} 100,${baseY - 15} ${rightX - 10},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
    default:
      return `
        <rect 
          x="${leftX}" 
          y="${baseY - 10}" 
          width="${config.width * 12}" 
          height="10"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
  }
}

function getCrossSectionRoofSVG(config: ShedConfig): string {
  const baseY = 130 - (config.wallHeight * 8);
  const leftX = 100 - (config.width * 6);
  const rightX = 100 + (config.width * 6);
  
  switch (config.roofType) {
    case 'gable':
      return `
        <polygon 
          points="${leftX},${baseY} 100,${baseY - 20} ${rightX},${baseY}"
          fill="none" 
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- Rafters -->
        <g stroke="#8b4513" stroke-width="1.5">
          <line x1="100" y1="${baseY}" x2="100" y2="${baseY - 20}" />
          <line x1="${leftX}" y1="${baseY}" x2="100" y2="${baseY - 20}" />
          <line x1="${rightX}" y1="${baseY}" x2="100" y2="${baseY - 20}" />
        </g>
      `;
    case 'shed':
    case 'lean-to':
      return `
        <line 
          x1="${leftX}" y1="${baseY - 15}" 
          x2="${rightX}" y2="${baseY - 5}"
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- Rafters -->
        <g stroke="#8b4513" stroke-width="1.5">
          ${Array.from({ length: 5 }).map((_, i) => `
            <line 
              x1="${leftX + (i * config.width * 3)}" 
              y1="${baseY}" 
              x2="${leftX + (i * config.width * 3)}" 
              y2="${baseY - 15 + (i * 2.5)}"
            />
          `).join('')}
        </g>
      `;
    default:
      return `
        <rect 
          x="${leftX}" 
          y="${baseY - 15}" 
          width="${config.width * 12}" 
          height="15"
          fill="none" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
  }
}
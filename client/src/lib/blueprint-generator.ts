import type { ShedConfig } from '@shared/schema';

export function generatePlanViewSVG(config: ShedConfig): string {
  const { length, width, doorCount, windowCount } = config;
  
  // Larger scale factor for bigger blueprints (pixels per foot)
  const scale = 40;
  const wallThickness = 6; // 6" walls
  
  const totalWidth = width * scale + wallThickness * 2;
  const totalHeight = length * scale + wallThickness * 2;
  
  // Calculate positions
  const doorWidth = 3 * scale; // 3 feet wide doors
  const windowWidth = 2 * scale; // 2 feet wide windows
  
  // Generate 2x4 stud layout
  const studSpacing = 16 * (scale / 12); // 16" on center
  const studs = [];
  
  // Front wall studs
  for (let x = 80 + wallThickness; x <= 80 + totalWidth - wallThickness; x += studSpacing) {
    studs.push(`<rect x="${x - 0.75}" y="80" width="1.5" height="${wallThickness}" fill="#8B4513"/>`);
  }
  
  // Back wall studs
  for (let x = 80 + wallThickness; x <= 80 + totalWidth - wallThickness; x += studSpacing) {
    studs.push(`<rect x="${x - 0.75}" y="${80 + totalHeight - wallThickness}" width="1.5" height="${wallThickness}" fill="#8B4513"/>`);
  }
  
  // Side wall studs
  for (let y = 80 + wallThickness; y <= 80 + totalHeight - wallThickness; y += studSpacing) {
    studs.push(`<rect x="80" y="${y - 0.75}" width="${wallThickness}" height="1.5" fill="#8B4513"/>`);
    studs.push(`<rect x="${80 + totalWidth - wallThickness}" y="${y - 0.75}" width="${wallThickness}" height="1.5" fill="#8B4513"/>`);
  }
  
  // Floor joists
  const joistSpacing = 16 * (scale / 12); // 16" on center
  const joists = [];
  for (let y = 80 + wallThickness + joistSpacing; y < 80 + totalHeight - wallThickness; y += joistSpacing) {
    joists.push(`<rect x="${80 + wallThickness}" y="${y - 0.75}" width="${totalWidth - wallThickness * 2}" height="1.5" fill="#D2691E" opacity="0.7"/>`);
  }

  return `
    <svg viewBox="0 0 ${totalWidth + 300} ${totalHeight + 250}" style="width: 100%; height: 400px; border: 1px solid #000;">
      <defs>
        <marker id="dimension" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <circle cx="5" cy="5" r="2" fill="#000"/>
        </marker>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#000"/>
        </marker>
      </defs>
      
      <!-- Background -->
      <rect x="0" y="0" width="100%" height="100%" fill="#f8f9fa"/>
      
      <!-- Floor joists -->
      ${joists.join('')}
      
      <!-- Outer wall plates -->
      <rect x="80" y="80" width="${totalWidth}" height="${wallThickness}" fill="#654321" stroke="#000" stroke-width="1"/>
      <rect x="80" y="${80 + totalHeight - wallThickness}" width="${totalWidth}" height="${wallThickness}" fill="#654321" stroke="#000" stroke-width="1"/>
      <rect x="80" y="80" width="${wallThickness}" height="${totalHeight}" fill="#654321" stroke="#000" stroke-width="1"/>
      <rect x="${80 + totalWidth - wallThickness}" y="80" width="${wallThickness}" height="${totalHeight}" fill="#654321" stroke="#000" stroke-width="1"/>
      
      <!-- Wall studs -->
      ${studs.join('')}
      
      <!-- Corner posts -->
      <rect x="80" y="80" width="${wallThickness}" height="${wallThickness}" fill="#4A4A4A" stroke="#000" stroke-width="1"/>
      <rect x="${80 + totalWidth - wallThickness}" y="80" width="${wallThickness}" height="${wallThickness}" fill="#4A4A4A" stroke="#000" stroke-width="1"/>
      <rect x="80" y="${80 + totalHeight - wallThickness}" width="${wallThickness}" height="${wallThickness}" fill="#4A4A4A" stroke="#000" stroke-width="1"/>
      <rect x="${80 + totalWidth - wallThickness}" y="${80 + totalHeight - wallThickness}" width="${wallThickness}" height="${wallThickness}" fill="#4A4A4A" stroke="#000" stroke-width="1"/>
      
      <!-- Doors -->
      ${Array.from({ length: doorCount }, (_, i) => {
        const doorX = 80 + wallThickness + (i + 1) * (totalWidth - wallThickness * 2) / (doorCount + 1) - doorWidth / 2;
        return `
          <rect x="${doorX}" y="80" width="${doorWidth}" height="${wallThickness}" fill="#FFFFFF" stroke="#000" stroke-width="2"/>
          <text x="${doorX + doorWidth/2}" y="${80 + wallThickness + 20}" text-anchor="middle" font-size="12" font-weight="bold" fill="#000">DOOR ${i+1}</text>
          <text x="${doorX + doorWidth/2}" y="${80 + wallThickness + 35}" text-anchor="middle" font-size="10" fill="#666">32" × 80"</text>
          <path d="M ${doorX + 8} ${80 + wallThickness} Q ${doorX + doorWidth - 8} ${80 + wallThickness + 25} ${doorX + doorWidth - 8} ${80 + wallThickness}" 
                stroke="#000" fill="none" stroke-width="2"/>
          <!-- Door frame studs -->
          <rect x="${doorX - 1.5}" y="80" width="3" height="${wallThickness}" fill="#8B4513"/>
          <rect x="${doorX + doorWidth - 1.5}" y="80" width="3" height="${wallThickness}" fill="#8B4513"/>
        `;
      }).join('')}
      
      <!-- Windows -->
      ${Array.from({ length: windowCount }, (_, i) => {
        const windowX = 80 + wallThickness + (i + 1) * (totalWidth - wallThickness * 2) / (windowCount + 2) - windowWidth / 2;
        const windowY = 80 + totalHeight - wallThickness;
        return `
          <rect x="${windowX}" y="${windowY}" width="${windowWidth}" height="${wallThickness}" fill="#E6F3FF" stroke="#000" stroke-width="2"/>
          <text x="${windowX + windowWidth/2}" y="${windowY - 10}" text-anchor="middle" font-size="12" font-weight="bold" fill="#000">WIN ${i+1}</text>
          <text x="${windowX + windowWidth/2}" y="${windowY + wallThickness + 15}" text-anchor="middle" font-size="10" fill="#666">24" × 36"</text>
          <!-- Window frame studs -->
          <rect x="${windowX - 1.5}" y="${windowY}" width="3" height="${wallThickness}" fill="#8B4513"/>
          <rect x="${windowX + windowWidth - 1.5}" y="${windowY}" width="3" height="${wallThickness}" fill="#8B4513"/>
        `;
      }).join('')}
      
      <!-- Stud spacing callouts -->
      <g stroke="#666" fill="#666" font-size="10">
        <line x1="${80 + wallThickness}" y1="${80 + wallThickness + 15}" x2="${80 + wallThickness + studSpacing}" y2="${80 + wallThickness + 15}" marker-end="url(#arrow)"/>
        <text x="${80 + wallThickness + studSpacing/2}" y="${80 + wallThickness + 30}" text-anchor="middle">16" O.C.</text>
        
        <line x1="${80 + wallThickness + 15}" y1="${80 + wallThickness}" x2="${80 + wallThickness + 15}" y2="${80 + wallThickness + joistSpacing}" marker-end="url(#arrow)"/>
        <text x="${80 + wallThickness + 30}" y="${80 + wallThickness + joistSpacing/2}" text-anchor="middle">16" O.C.</text>
      </g>
      
      <!-- Dimensions -->
      <g stroke="#000" fill="#000" font-size="14" font-weight="bold">
        <!-- Length dimension -->
        <line x1="60" y1="80" x2="60" y2="${80 + totalHeight}" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="40" y="${80 + totalHeight/2}" text-anchor="middle" transform="rotate(-90, 40, ${80 + totalHeight/2})">${length}'-0"</text>
        
        <!-- Width dimension -->
        <line x1="80" y1="60" x2="${80 + totalWidth}" y2="60" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="${80 + totalWidth/2}" y="45" text-anchor="middle">${width}'-0"</text>
        
        <!-- Interior dimensions -->
        <line x1="80" y1="${80 + totalHeight + 30}" x2="${80 + totalWidth}" y2="${80 + totalHeight + 30}" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="1"/>
        <text x="${80 + totalWidth/2}" y="${80 + totalHeight + 50}" text-anchor="middle" font-size="12">Interior: ${width - 1}'-4" × ${length - 1}'-4"</text>
      </g>
      
      <!-- 2x4 Layout Reference -->
      <g transform="translate(${totalWidth + 120}, 80)">
        <text x="0" y="0" font-size="16" font-weight="bold" fill="#000">2×4 FRAMING REFERENCE</text>
        
        <!-- Wall Framing Detail -->
        <g transform="translate(0, 20)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Wall Framing:</text>
          <rect x="0" y="10" width="15" height="4" fill="#8B4513"/>
          <text x="20" y="17" font-size="11" fill="#000">2×4 Studs @ 16" O.C.</text>
          <rect x="0" y="25" width="15" height="4" fill="#654321"/>
          <text x="20" y="32" font-size="11" fill="#000">Top & Bottom Plates</text>
          <rect x="0" y="40" width="8" height="8" fill="#4A4A4A"/>
          <text x="20" y="47" font-size="11" fill="#000">Corner Posts (Double 2×4)</text>
        </g>
        
        <!-- Door Framing Detail -->
        <g transform="translate(0, 80)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Door Framing:</text>
          <rect x="0" y="10" width="40" height="25" fill="none" stroke="#000" stroke-width="1"/>
          <rect x="0" y="10" width="3" height="25" fill="#8B4513"/>
          <rect x="37" y="10" width="3" height="25" fill="#8B4513"/>
          <rect x="3" y="10" width="34" height="3" fill="#654321"/>
          <text x="0" y="45" font-size="10" fill="#000">King Studs</text>
          <text x="0" y="55" font-size="10" fill="#000">Header (2×6 or 2×8)</text>
          <text x="0" y="65" font-size="10" fill="#000">Cripple Studs as needed</text>
        </g>
        
        <!-- Floor Joist Detail -->
        <g transform="translate(0, 160)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Floor Joists:</text>
          <rect x="0" y="10" width="3" height="20" fill="#D2691E"/>
          <rect x="21" y="10" width="3" height="20" fill="#D2691E"/>
          <rect x="42" y="10" width="3" height="20" fill="#D2691E"/>
          <text x="0" y="40" font-size="11" fill="#000">2×8 Joists @ 16" O.C.</text>
          <text x="0" y="50" font-size="11" fill="#000">Span: ${width}' (max 12')</text>
        </g>
      </g>
      
      <!-- Title -->
      <text x="${(totalWidth + 300)/2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#000">FLOOR PLAN VIEW</text>
      <text x="${(totalWidth + 300)/2}" y="${totalHeight + 220}" text-anchor="middle" font-size="16" fill="#000">Scale: 1/4" = 1'-0" • ${length}' × ${width}' Shed</text>
    </svg>
  `;
}

export function generateFrontElevationSVG(config: ShedConfig): string {
  const scale = 40;
  const wallHeight = config.wallHeight;
  const totalWidth = config.length * scale;
  const totalHeight = wallHeight * scale;
  
  // Wall studs
  const studSpacing = 16 * (scale / 12); // 16" on center
  const studs = [];
  for (let x = 80; x <= 80 + totalWidth; x += studSpacing) {
    studs.push(`<rect x="${x - 0.75}" y="${200 - totalHeight}" width="1.5" height="${totalHeight}" fill="#8B4513"/>`);
  }
  
  return `
    <svg viewBox="0 0 ${totalWidth + 300} 300" style="width: 100%; height: 400px; border: 1px solid #000;">
      <defs>
        <marker id="dimension" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <circle cx="5" cy="5" r="2" fill="#000"/>
        </marker>
      </defs>
      
      <!-- Background -->
      <rect x="0" y="0" width="100%" height="100%" fill="#f8f9fa"/>
      
      <!-- Foundation -->
      <rect 
        x="80" 
        y="200" 
        width="${totalWidth}" 
        height="12"
        fill="#9ca3af" 
        stroke="#374151" 
        stroke-width="2"
      />
      
      <!-- Wall -->
      <rect 
        x="80" 
        y="${200 - totalHeight}" 
        width="${totalWidth}" 
        height="${totalHeight}"
        fill="#fde68a" 
        stroke="#92400e" 
        stroke-width="2"
      />
      
      <!-- Wall studs -->
      ${studs.join('')}
      
      <!-- Sill plate -->
      <rect x="80" y="${200 - 6}" width="${totalWidth}" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      
      <!-- Top plate -->
      <rect x="80" y="${200 - totalHeight}" width="${totalWidth}" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      
      ${getRoofSVG(config, 80, 200 - totalHeight, totalWidth, scale)}
      
      ${config.doorCount > 0 ? `
        <!-- Door -->
        <rect 
          x="${80 + totalWidth/2 - 16}" 
          y="${200 - (wallHeight * 30)}" 
          width="32" 
          height="${wallHeight * 30}"
          fill="#8b5cf6" 
          stroke="#7c3aed" 
          stroke-width="2"
        />
        <!-- Door frame -->
        <rect x="${80 + totalWidth/2 - 18}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <rect x="${80 + totalWidth/2 + 15}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <!-- Door header -->
        <rect x="${80 + totalWidth/2 - 18}" y="${200 - totalHeight}" width="36" height="8" fill="#654321"/>
        <text x="${80 + totalWidth/2}" y="${200 + 30}" text-anchor="middle" font-size="12" font-weight="bold">32" DOOR</text>
      ` : ''}
      
      ${Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => `
        <rect 
          x="${80 + (totalWidth/3) + (i * totalWidth/3) - 12}" 
          y="${200 - totalHeight + 30}" 
          width="24" 
          height="18"
          fill="#3b82f6" 
          stroke="#1e40af" 
          stroke-width="2"
        />
        <!-- Window frame -->
        <rect x="${80 + (totalWidth/3) + (i * totalWidth/3) - 14}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <rect x="${80 + (totalWidth/3) + (i * totalWidth/3) + 11}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <!-- Window header -->
        <rect x="${80 + (totalWidth/3) + (i * totalWidth/3) - 14}" y="${200 - totalHeight + 28}" width="28" height="6" fill="#654321"/>
        <text x="${80 + (totalWidth/3) + (i * totalWidth/3)}" y="${200 + 30}" text-anchor="middle" font-size="10">24" WIN</text>
      `).join('')}
      
      <!-- Dimensions -->
      <g stroke="#000" fill="#000" font-size="14" font-weight="bold">
        <line x1="80" y1="230" x2="${80 + totalWidth}" y2="230" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="${80 + totalWidth/2}" y="250" text-anchor="middle">${config.length}'-0" LENGTH</text>
        
        <line x1="60" y1="200" x2="60" y2="${200 - totalHeight}" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="40" y="${200 - totalHeight/2}" text-anchor="middle" transform="rotate(-90, 40, ${200 - totalHeight/2})">${wallHeight}'-0"</text>
      </g>
      
      <!-- Construction References -->
      <g transform="translate(${totalWidth + 120}, 50)">
        <text x="0" y="0" font-size="16" font-weight="bold" fill="#000">CONSTRUCTION REFERENCE</text>
        
        <!-- Wall section detail -->
        <g transform="translate(0, 20)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Wall Framing:</text>
          <rect x="0" y="10" width="80" height="100" fill="none" stroke="#000" stroke-width="1"/>
          <rect x="0" y="10" width="80" height="6" fill="#654321"/>
          <text x="85" y="20" font-size="10" fill="#000">Top Plate (2×4)</text>
          
          <rect x="10" y="16" width="3" height="88" fill="#8B4513"/>
          <rect x="26" y="16" width="3" height="88" fill="#8B4513"/>
          <rect x="42" y="16" width="3" height="88" fill="#8B4513"/>
          <rect x="58" y="16" width="3" height="88" fill="#8B4513"/>
          <text x="85" y="60" font-size="10" fill="#000">Studs @ 16" O.C.</text>
          
          <rect x="0" y="104" width="80" height="6" fill="#654321"/>
          <text x="85" y="115" font-size="10" fill="#000">Bottom Plate (2×4)</text>
        </g>
        
        <!-- Roof truss detail -->
        <g transform="translate(0, 150)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Roof Trusses:</text>
          <rect x="0" y="10" width="80" height="3" fill="#654321"/>
          <text x="85" y="18" font-size="10" fill="#000">Top Plate</text>
          
          ${config.roofType === 'gable' ? `
            <polygon points="0,10 40,0 80,10" fill="none" stroke="#8B4513" stroke-width="2"/>
            <line x1="20" y1="5" x2="60" y2="5" stroke="#8B4513" stroke-width="1"/>
            <line x1="40" y1="0" x2="40" y2="10" stroke="#8B4513" stroke-width="1"/>
            <text x="85" y="8" font-size="10" fill="#000">Gable Truss</text>
            <text x="85" y="28" font-size="10" fill="#000">24" O.C. spacing</text>
            <text x="85" y="38" font-size="10" fill="#000">2×4 or 2×6 rafters</text>
          ` : `
            <line x1="0" y1="10" x2="80" y2="0" stroke="#8B4513" stroke-width="2"/>
            <line x1="20" y1="7.5" x2="20" y2="10" stroke="#8B4513" stroke-width="1"/>
            <line x1="40" y1="5" x2="40" y2="10" stroke="#8B4513" stroke-width="1"/>
            <line x1="60" y1="2.5" x2="60" y2="10" stroke="#8B4513" stroke-width="1"/>
            <text x="85" y="8" font-size="10" fill="#000">Shed Rafters</text>
            <text x="85" y="28" font-size="10" fill="#000">24" O.C. spacing</text>
            <text x="85" y="38" font-size="10" fill="#000">2×6 rafters</text>
          `}
          
          <rect x="38" y="0" width="4" height="10" fill="#8B4513"/>
          <text x="85" y="48" font-size="10" fill="#000">Hurricane Ties req'd</text>
        </g>
        
        <!-- Door/Window framing -->
        <g transform="translate(0, 220)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Opening Framing:</text>
          <rect x="0" y="10" width="50" height="30" fill="none" stroke="#000" stroke-width="1"/>
          <rect x="0" y="10" width="3" height="30" fill="#8B4513"/>
          <rect x="47" y="10" width="3" height="30" fill="#8B4513"/>
          <rect x="3" y="10" width="44" height="4" fill="#654321"/>
          <text x="55" y="18" font-size="10" fill="#000">Header (2×6/2×8)</text>
          <text x="55" y="28" font-size="10" fill="#000">King Studs</text>
          <text x="55" y="38" font-size="10" fill="#000">Jack Studs</text>
          <text x="55" y="48" font-size="10" fill="#000">Cripple Studs</text>
        </g>
      </g>
      
      <!-- Title -->
      <text x="${(totalWidth + 300)/2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#000">FRONT ELEVATION</text>
      <text x="${(totalWidth + 300)/2}" y="280" text-anchor="middle" font-size="16" fill="#000">Scale: 1/4" = 1'-0" • ${config.length}' × ${wallHeight}' Wall</text>
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

function getRoofSVG(config: ShedConfig, startX: number, baseY: number, totalWidth: number, scale: number): string {
  const leftX = startX;
  const rightX = startX + totalWidth;
  const centerX = startX + totalWidth / 2;
  
  // Rafter spacing
  const rafterSpacing = 24 * (scale / 12); // 24" on center
  const rafters = [];
  
  switch (config.roofType) {
    case 'gable':
      // Main roof shape
      const roofSVG = `
        <polygon 
          points="${leftX},${baseY} ${centerX},${baseY - 30} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
      
      // Add rafters
      for (let x = leftX; x <= rightX; x += rafterSpacing) {
        rafters.push(`<line x1="${x}" y1="${baseY}" x2="${centerX}" y2="${baseY - 30}" stroke="#8B4513" stroke-width="2"/>`);
      }
      
      return roofSVG + `
        <!-- Rafters -->
        <g>
          ${rafters.join('')}
          <line x1="${centerX}" y1="${baseY - 30}" x2="${centerX}" y2="${baseY - 40}" stroke="#8B4513" stroke-width="3"/>
          <text x="${centerX + 10}" y="${baseY - 35}" font-size="10" fill="#000">Ridge Board</text>
        </g>
      `;
      
    case 'shed':
    case 'lean-to':
      return `
        <polygon 
          points="${leftX},${baseY - 25} ${rightX},${baseY - 8} ${rightX},${baseY} ${leftX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- Rafters for shed roof -->
        <g>
          ${Array.from({ length: Math.floor(totalWidth / rafterSpacing) + 1 }).map((_, i) => {
            const x = leftX + (i * rafterSpacing);
            const topY = baseY - 25 + ((baseY - 8 - (baseY - 25)) * (x - leftX) / totalWidth);
            return `<line x1="${x}" y1="${baseY}" x2="${x}" y2="${topY}" stroke="#8B4513" stroke-width="2"/>`;
          }).join('')}
        </g>
      `;
      
    default:
      return `
        <rect 
          x="${leftX}" 
          y="${baseY - 20}" 
          width="${totalWidth}" 
          height="20"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
      `;
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
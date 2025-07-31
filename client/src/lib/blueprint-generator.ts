import type { ShedConfig } from '@shared/schema';

export function generatePlanViewSVG(config: ShedConfig): string {
  const { length, width, doorCount, windowCount } = config;
  
  // Balanced scale factor for readable blueprints (pixels per foot)
  const scale = 25;
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
    <svg viewBox="0 0 ${totalWidth + 350} ${totalHeight + 200}" style="width: 100%; height: 450px; border: 1px solid #000;">
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
        const spacing = (totalWidth - wallThickness * 2) / (doorCount + 1);
        const doorX = 80 + wallThickness + spacing * (i + 1) - doorWidth / 2;
        return `
          <rect x="${doorX}" y="80" width="${doorWidth}" height="${wallThickness}" fill="#FFFFFF" stroke="#000" stroke-width="2"/>
          <text x="${doorX + doorWidth/2}" y="${80 + wallThickness + 25}" text-anchor="middle" font-size="11" font-weight="bold" fill="#000">DOOR ${i+1}</text>
          <text x="${doorX + doorWidth/2}" y="${80 + wallThickness + 40}" text-anchor="middle" font-size="9" fill="#666">32" × 80"</text>
          <path d="M ${doorX + 10} ${80 + wallThickness} Q ${doorX + doorWidth - 10} ${80 + wallThickness + 30} ${doorX + doorWidth - 10} ${80 + wallThickness}" 
                stroke="#000" fill="none" stroke-width="1"/>
          <!-- Door frame studs -->
          <rect x="${doorX - 2}" y="80" width="3" height="${wallThickness}" fill="#8B4513"/>
          <rect x="${doorX + doorWidth - 1}" y="80" width="3" height="${wallThickness}" fill="#8B4513"/>
        `;
      }).join('')}
      
      <!-- Windows -->
      ${Array.from({ length: windowCount }, (_, i) => {
        const spacing = (totalWidth - wallThickness * 2) / (windowCount + 1);
        const windowX = 80 + wallThickness + spacing * (i + 1) - windowWidth / 2;
        const windowY = 80 + totalHeight - wallThickness;
        return `
          <rect x="${windowX}" y="${windowY}" width="${windowWidth}" height="${wallThickness}" fill="#E6F3FF" stroke="#000" stroke-width="2"/>
          <text x="${windowX + windowWidth/2}" y="${windowY - 15}" text-anchor="middle" font-size="11" font-weight="bold" fill="#000">WIN ${i+1}</text>
          <text x="${windowX + windowWidth/2}" y="${windowY + wallThickness + 20}" text-anchor="middle" font-size="9" fill="#666">24" × 36"</text>
          <!-- Window frame studs -->
          <rect x="${windowX - 2}" y="${windowY}" width="3" height="${wallThickness}" fill="#8B4513"/>
          <rect x="${windowX + windowWidth - 1}" y="${windowY}" width="3" height="${wallThickness}" fill="#8B4513"/>
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
  const scale = 25;
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
    <svg viewBox="0 0 ${totalWidth + 250} 250" style="width: 100%; height: 350px; border: 1px solid #000;">
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
          x="${80 + totalWidth/2 - 20}" 
          y="${200 - totalHeight + 20}" 
          width="40" 
          height="${totalHeight - 20}"
          fill="#8b5cf6" 
          stroke="#7c3aed" 
          stroke-width="2"
        />
        <!-- Door frame studs -->
        <rect x="${80 + totalWidth/2 - 23}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <rect x="${80 + totalWidth/2 + 20}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <!-- Door header -->
        <rect x="${80 + totalWidth/2 - 23}" y="${200 - totalHeight + 17}" width="46" height="8" fill="#654321"/>
        <text x="${80 + totalWidth/2}" y="${200 + 35}" text-anchor="middle" font-size="11" font-weight="bold">36" DOOR</text>
      ` : ''}
      
      ${Array.from({ length: Math.min(config.windowCount, 2) }).map((_, i) => {
        const spacing = totalWidth / (Math.min(config.windowCount, 2) + 1);
        const windowX = 80 + spacing * (i + 1) - 15;
        return `
        <rect 
          x="${windowX}" 
          y="${200 - totalHeight + 35}" 
          width="30" 
          height="20"
          fill="#3b82f6" 
          stroke="#1e40af" 
          stroke-width="2"
        />
        <!-- Window frame studs -->
        <rect x="${windowX - 3}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <rect x="${windowX + 30}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <!-- Window header -->
        <rect x="${windowX - 3}" y="${200 - totalHeight + 32}" width="36" height="8" fill="#654321"/>
        <text x="${windowX + 15}" y="${200 + 35}" text-anchor="middle" font-size="10">30" WIN</text>
      `;
      }).join('')}
      
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
      <text x="${(totalWidth + 250)/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#000">FRONT ELEVATION</text>
      <text x="${(totalWidth + 250)/2}" y="225" text-anchor="middle" font-size="12" fill="#000">Scale: 1/4" = 1'-0" • ${config.length}' × ${wallHeight}' Wall</text>
    </svg>
  `;
}

export function generateSideElevationSVG(config: ShedConfig): string {
  const scale = 25;
  const wallHeight = config.wallHeight;
  const totalWidth = config.width * scale;
  const totalHeight = wallHeight * scale;
  
  // Wall studs for side view
  const studSpacing = 16 * (scale / 12); // 16" on center
  const studs = [];
  for (let x = 80; x <= 80 + totalWidth; x += studSpacing) {
    studs.push(`<rect x="${x - 0.75}" y="${200 - totalHeight}" width="1.5" height="${totalHeight}" fill="#8B4513"/>`);
  }

  return `
    <svg viewBox="0 0 ${totalWidth + 250} 250" style="width: 100%; height: 350px; border: 1px solid #000;">
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
      
      ${getSideRoofSVG(config, 80, 200 - totalHeight, totalWidth, scale)}
      
      ${config.windowCount > 0 ? `
        <!-- Window -->
        <rect 
          x="${80 + totalWidth/2 - 15}" 
          y="${200 - totalHeight + 35}" 
          width="30" 
          height="20"
          fill="#3b82f6" 
          stroke="#1e40af" 
          stroke-width="2"
        />
        <!-- Window frame studs -->
        <rect x="${80 + totalWidth/2 - 18}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <rect x="${80 + totalWidth/2 + 15}" y="${200 - totalHeight}" width="3" height="${totalHeight}" fill="#8B4513"/>
        <!-- Window header -->
        <rect x="${80 + totalWidth/2 - 18}" y="${200 - totalHeight + 32}" width="36" height="8" fill="#654321"/>
        <text x="${80 + totalWidth/2}" y="${200 + 35}" text-anchor="middle" font-size="10">30" WINDOW</text>
      ` : ''}
      
      <!-- Dimensions -->
      <g stroke="#000" fill="#000" font-size="14" font-weight="bold">
        <line x1="80" y1="230" x2="${80 + totalWidth}" y2="230" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="${80 + totalWidth/2}" y="250" text-anchor="middle">${config.width}'-0" WIDTH</text>
        
        <line x1="60" y1="200" x2="60" y2="${200 - totalHeight}" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="40" y="${200 - totalHeight/2}" text-anchor="middle" transform="rotate(-90, 40, ${200 - totalHeight/2})">${wallHeight}'-0"</text>
      </g>
      
      <!-- Side Wall Construction Reference -->
      <g transform="translate(${totalWidth + 120}, 50)">
        <text x="0" y="0" font-size="16" font-weight="bold" fill="#000">SIDE WALL FRAMING</text>
        
        <!-- Side wall detail -->
        <g transform="translate(0, 20)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">End Wall Layout:</text>
          <rect x="0" y="10" width="60" height="80" fill="none" stroke="#000" stroke-width="1"/>
          <rect x="0" y="10" width="60" height="6" fill="#654321"/>
          <text x="65" y="20" font-size="10" fill="#000">Top Plate (2×4)</text>
          
          <rect x="8" y="16" width="3" height="68" fill="#8B4513"/>
          <rect x="19" y="16" width="3" height="68" fill="#8B4513"/>
          <rect x="30" y="16" width="3" height="68" fill="#8B4513"/>
          <rect x="41" y="16" width="3" height="68" fill="#8B4513"/>
          <rect x="52" y="16" width="3" height="68" fill="#8B4513"/>
          <text x="65" y="50" font-size="10" fill="#000">Studs @ 16" O.C.</text>
          
          <rect x="0" y="84" width="60" height="6" fill="#654321"/>
          <text x="65" y="95" font-size="10" fill="#000">Bottom Plate (2×4)</text>
        </g>
        
        <!-- Corner construction -->
        <g transform="translate(0, 120)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Corner Detail:</text>
          <rect x="0" y="10" width="20" height="20" fill="none" stroke="#000" stroke-width="1"/>
          <rect x="0" y="10" width="6" height="20" fill="#8B4513"/>
          <rect x="14" y="10" width="6" height="20" fill="#8B4513"/>
          <text x="25" y="18" font-size="10" fill="#000">3-Stud Corner</text>
          <text x="25" y="28" font-size="10" fill="#000">(2×4 + nailer)</text>
        </g>
        
        <!-- Window/Door openings -->
        <g transform="translate(0, 170)">
          <text x="0" y="0" font-size="14" font-weight="bold" fill="#333">Opening Headers:</text>
          <rect x="0" y="10" width="40" height="6" fill="#654321"/>
          <text x="45" y="18" font-size="10" fill="#000">2×6 Header (spans &lt; 6')</text>
          <rect x="0" y="20" width="40" height="8" fill="#654321"/>
          <text x="45" y="28" font-size="10" fill="#000">2×8 Header (spans 6'-8')</text>
          <text x="45" y="38" font-size="10" fill="#000">Double up for load bearing</text>
        </g>
      </g>
      
      <!-- Title -->
      <text x="${(totalWidth + 250)/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#000">SIDE ELEVATION</text>
      <text x="${(totalWidth + 250)/2}" y="225" text-anchor="middle" font-size="12" fill="#000">Scale: 1/4" = 1'-0" • ${config.width}' × ${wallHeight}' End Wall</text>
    </svg>
  `;
}

export function generateCrossSectionSVG(config: ShedConfig): string {
  const scale = 25;
  const wallHeight = config.wallHeight;
  const totalWidth = config.width * scale;
  const totalHeight = wallHeight * scale;
  
  // Floor joists at 16" on center
  const joistSpacing = 16 * (scale / 12); // 16" on center
  const joists = [];
  for (let x = 80; x <= 80 + totalWidth; x += joistSpacing) {
    joists.push(`<rect x="${x - 0.75}" y="200" width="1.5" height="18" fill="#8B4513"/>`);
  }

  return `
    <svg viewBox="0 0 ${totalWidth + 250} 240" style="width: 100%; height: 350px; border: 1px solid #000;">
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
        height="18"
        fill="#9ca3af" 
        stroke="#374151" 
        stroke-width="2"
      />
      
      <!-- Floor decking -->
      <rect 
        x="80" 
        y="192" 
        width="${totalWidth}" 
        height="8"
        fill="#fbbf24" 
        stroke="#92400e" 
        stroke-width="1"
      />
      
      <!-- Floor joists -->
      ${joists.join('')}
      
      <!-- Sill plates -->
      <rect x="80" y="186" width="6" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      <rect x="${80 + totalWidth - 6}" y="186" width="6" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      
      <!-- Wall studs (left side) -->
      <rect x="80" y="${200 - totalHeight}" width="6" height="${totalHeight}" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
      
      <!-- Wall studs (right side) -->
      <rect x="${80 + totalWidth - 6}" y="${200 - totalHeight}" width="6" height="${totalHeight}" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
      
      <!-- Top plates -->
      <rect x="80" y="${200 - totalHeight}" width="6" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      <rect x="${80 + totalWidth - 6}" y="${200 - totalHeight}" width="6" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
      
      ${getCrossSectionRoofSVG(config, 80, 200 - totalHeight, totalWidth, scale)}
      
      <!-- Dimensions -->
      <g stroke="#000" fill="#000" font-size="14" font-weight="bold">
        <line x1="80" y1="230" x2="${80 + totalWidth}" y2="230" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="${80 + totalWidth/2}" y="250" text-anchor="middle">${config.width}'-0" SPAN</text>
        
        <line x1="60" y1="200" x2="60" y2="${200 - totalHeight}" marker-start="url(#dimension)" marker-end="url(#dimension)" stroke-width="2"/>
        <text x="40" y="${200 - totalHeight/2}" text-anchor="middle" transform="rotate(-90, 40, ${200 - totalHeight/2})">${wallHeight}'-0"</text>
      </g>
      
      <!-- Cross Section Construction Reference -->
      <g transform="translate(${totalWidth + 100}, 40)">
        <text x="0" y="0" font-size="14" font-weight="bold" fill="#000">CROSS SECTION FRAMING</text>
        
        <!-- Floor joist detail -->
        <g transform="translate(0, 20)">
          <text x="0" y="0" font-size="12" font-weight="bold" fill="#333">Floor Joist Layout:</text>
          <rect x="0" y="8" width="60" height="45" fill="none" stroke="#000" stroke-width="1"/>
          
          <!-- Foundation -->
          <rect x="0" y="42" width="60" height="11" fill="#9ca3af"/>
          <text x="65" y="50" font-size="9" fill="#000">Foundation</text>
          
          <!-- Sill plates -->
          <rect x="0" y="38" width="8" height="4" fill="#654321"/>
          <rect x="52" y="38" width="8" height="4" fill="#654321"/>
          <text x="65" y="42" font-size="9" fill="#000">Sill Plates</text>
          
          <!-- Floor joists -->
          <rect x="8" y="38" width="2" height="11" fill="#8B4513"/>
          <rect x="18" y="38" width="2" height="11" fill="#8B4513"/>
          <rect x="28" y="38" width="2" height="11" fill="#8B4513"/>
          <rect x="38" y="38" width="2" height="11" fill="#8B4513"/>
          <rect x="48" y="38" width="2" height="11" fill="#8B4513"/>
          <text x="65" y="33" font-size="9" fill="#000">2×8 @ 16" O.C.</text>
          
          <!-- Subfloor -->
          <rect x="0" y="34" width="60" height="4" fill="#fbbf24"/>
          <text x="65" y="38" font-size="9" fill="#000">3/4" Subfloor</text>
        </g>
        
        <!-- Wall construction -->
        <g transform="translate(0, 80)">
          <text x="0" y="0" font-size="12" font-weight="bold" fill="#333">Wall Construction:</text>
          <rect x="0" y="8" width="12" height="45" fill="none" stroke="#000" stroke-width="1"/>
          
          <!-- Top plate -->
          <rect x="0" y="8" width="12" height="4" fill="#654321"/>
          <text x="17" y="15" font-size="9" fill="#000">Double Top Plate</text>
          
          <!-- Studs -->
          <rect x="2" y="12" width="2" height="37" fill="#8B4513"/>
          <rect x="6" y="12" width="2" height="37" fill="#8B4513"/>
          <text x="17" y="25" font-size="9" fill="#000">2×4 Studs @ 16" O.C.</text>
          
          <!-- Bottom plate -->
          <rect x="0" y="49" width="12" height="4" fill="#654321"/>
          <text x="17" y="53" font-size="9" fill="#000">Bottom Plate</text>
        </g>
        
        <!-- Roof structure -->
        <g transform="translate(0, 140)">
          <text x="0" y="0" font-size="12" font-weight="bold" fill="#333">Roof Structure:</text>
          <text x="0" y="12" font-size="11" font-weight="bold" fill="#333">${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof:</text>
          
          <text x="0" y="24" font-size="9" fill="#000">• 2×6 rafters @ 24" O.C.</text>
          <text x="0" y="34" font-size="9" fill="#000">• Ridge beam/board</text>
          <text x="0" y="44" font-size="9" fill="#000">• Ceiling joists @ 16" O.C.</text>
        </g>
      </g>
      
      <!-- Title -->
      <text x="${(totalWidth + 250)/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#000">CROSS SECTION</text>
      <text x="${(totalWidth + 250)/2}" y="225" text-anchor="middle" font-size="12" fill="#000">Scale: 1/4" = 1'-0" • Structural Framing Details</text>
    </svg>
  `;
}

function getCrossSectionRoofSVG(config: ShedConfig, startX: number, baseY: number, totalWidth: number, scale: number): string {
  const leftX = startX;
  const rightX = startX + totalWidth;
  const centerX = startX + totalWidth / 2;
  
  switch (config.roofType) {
    case 'gable':
      return `
        <!-- Gable roof rafters -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY}" 
          x2="${centerX}" 
          y2="${baseY - 40}"
          stroke="#8b4513" 
          stroke-width="4"
        />
        <line 
          x1="${rightX - 6}" 
          y1="${baseY}" 
          x2="${centerX}" 
          y2="${baseY - 40}"
          stroke="#8b4513" 
          stroke-width="4"
        />
        <!-- Ridge beam -->
        <circle cx="${centerX}" cy="${baseY - 40}" r="3" fill="#654321"/>
        <text x="${centerX + 10}" y="${baseY - 35}" font-size="10" fill="#000">Ridge Beam</text>
        <!-- Ceiling joists -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY + 10}" 
          x2="${rightX - 6}" 
          y2="${baseY + 10}"
          stroke="#8b4513" 
          stroke-width="3"
        />
        <text x="${centerX}" y="${baseY + 25}" text-anchor="middle" font-size="10" fill="#000">Ceiling Joists @ 16" O.C.</text>
      `;
    case 'hip':
      return `
        <!-- Hip roof rafters -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY}" 
          x2="${centerX}" 
          y2="${baseY - 25}"
          stroke="#8b4513" 
          stroke-width="4"
        />
        <line 
          x1="${rightX - 6}" 
          y1="${baseY}" 
          x2="${centerX}" 
          y2="${baseY - 25}"
          stroke="#8b4513" 
          stroke-width="4"
        />
        <!-- Ridge board -->
        <rect x="${centerX - 1}" y="${baseY - 30}" width="2" height="30" fill="#654321"/>
        <text x="${centerX + 10}" y="${baseY - 20}" font-size="10" fill="#000">Ridge Board</text>
      `;
    case 'shed':
    case 'lean-to':
      return `
        <!-- Shed roof rafters -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY}" 
          x2="${rightX - 6}" 
          y2="${baseY - 30}"
          stroke="#8b4513" 
          stroke-width="4"
        />
        <!-- Ceiling joists -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY + 10}" 
          x2="${rightX - 6}" 
          y2="${baseY + 10}"
          stroke="#8b4513" 
          stroke-width="3"
        />
        <text x="${centerX}" y="${baseY + 25}" text-anchor="middle" font-size="10" fill="#000">Sloped Rafters @ 24" O.C.</text>
      `;
    default:
      return `
        <!-- Standard roof structure -->
        <line 
          x1="${leftX + 6}" 
          y1="${baseY}" 
          x2="${rightX - 6}" 
          y2="${baseY - 20}"
          stroke="#8b4513" 
          stroke-width="4"
        />
      `;
  }
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

function getSideRoofSVG(config: ShedConfig, startX: number, baseY: number, totalWidth: number, scale: number): string {
  const leftX = startX;
  const rightX = startX + totalWidth;
  const centerX = startX + totalWidth / 2;
  
  switch (config.roofType) {
    case 'gable':
      return `
        <polygon 
          points="${leftX},${baseY} ${centerX},${baseY - 30} ${rightX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- End wall rafter -->
        <line x1="${centerX}" y1="${baseY}" x2="${centerX}" y2="${baseY - 30}" stroke="#8B4513" stroke-width="3"/>
        <text x="${centerX + 10}" y="${baseY - 15}" font-size="10" fill="#000">End Truss</text>
      `;
    case 'hip':
      return `
        <polygon 
          points="${leftX + 20},${baseY} ${centerX},${baseY - 20} ${rightX - 20},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- Hip rafters -->
        <line x1="${leftX}" y1="${baseY}" x2="${centerX}" y2="${baseY - 20}" stroke="#8B4513" stroke-width="2"/>
        <line x1="${rightX}" y1="${baseY}" x2="${centerX}" y2="${baseY - 20}" stroke="#8B4513" stroke-width="2"/>
      `;
    default:
      return `
        <polygon 
          points="${leftX},${baseY - 15} ${rightX},${baseY - 8} ${rightX},${baseY} ${leftX},${baseY}"
          fill="#7c2d12" 
          stroke="#451a03" 
          stroke-width="2"
        />
        <!-- Shed roof rafters -->
        <line x1="${leftX}" y1="${baseY}" x2="${leftX}" y2="${baseY - 15}" stroke="#8B4513" stroke-width="2"/>
        <line x1="${rightX}" y1="${baseY}" x2="${rightX}" y2="${baseY - 8}" stroke="#8B4513" stroke-width="2"/>
      `;
  }
}


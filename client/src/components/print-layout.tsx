import type { ShedConfig } from '@shared/schema';
import { calculateMaterials } from '@/lib/shed-calculations';
import Shed3DViewer from './shed-3d-viewer';

interface PrintLayoutProps {
  config: ShedConfig;
  zipCode: string;
}

export default function PrintLayout({ config, zipCode }: PrintLayoutProps) {
  const materials = calculateMaterials(config);
  
  // Group materials by category
  const lumberMaterials = materials.filter(m => m.category === "lumber");
  const hardwareMaterials = materials.filter(m => m.category === "hardware");
  const roofingMaterials = materials.filter(m => m.category === "roofing");
  const sidingMaterials = materials.filter(m => m.category === "siding");
  const foundationMaterials = materials.filter(m => m.category === "foundation");

  const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);

  // Generate cut list from lumber materials
  const cutList = lumberMaterials.map(material => {
    const pieces = [];
    
    // Generate specific cuts based on material type and shed dimensions
    if (material.name.includes('2x4')) {
      if (material.name.includes('Stud')) {
        // Wall studs
        const studCount = Math.ceil((config.length + config.width) * 2 / 1.33); // 16" OC
        pieces.push({ length: `${config.wallHeight}'`, count: studCount, purpose: 'Wall studs' });
      }
      if (material.name.includes('Plate')) {
        // Top and bottom plates
        pieces.push({ length: `${config.length}'`, count: 4, purpose: 'Top/bottom plates (front/back)' });
        pieces.push({ length: `${config.width - 3}'`, count: 4, purpose: 'Top/bottom plates (sides)' });
      }
    }
    
    if (material.name.includes('2x6') || material.name.includes('2x8')) {
      if (material.name.includes('Joist')) {
        // Floor joists
        const joistCount = Math.ceil(config.length * 12 / config.joistSpacing) + 1;
        pieces.push({ length: `${config.width}'`, count: joistCount, purpose: 'Floor joists' });
      }
      if (material.name.includes('Rafter')) {
        // Roof rafters - calculate rafter length based on roof type
        const rafterLength = config.roofType === 'gable' 
          ? Math.sqrt(Math.pow(config.width / 2, 2) + Math.pow(2, 2)) // Simple pitch calculation
          : config.width / Math.cos(Math.PI / 12); // 15-degree slope
        const rafterCount = Math.ceil(config.length * 12 / 24) + 1; // 24" OC
        pieces.push({ length: `${Math.ceil(rafterLength)}'`, count: rafterCount * 2, purpose: 'Roof rafters' });
      }
    }
    
    if (material.name.includes('Plywood') || material.name.includes('OSB')) {
      if (material.name.includes('Floor')) {
        const sheetsNeeded = Math.ceil((config.length * config.width) / 32); // 4x8 sheets
        pieces.push({ length: '8\'', count: sheetsNeeded, purpose: 'Floor sheathing (4x8 sheets)' });
      }
      if (material.name.includes('Wall')) {
        const wallArea = 2 * (config.length + config.width) * config.wallHeight;
        const sheetsNeeded = Math.ceil(wallArea / 32);
        pieces.push({ length: '8\'', count: sheetsNeeded, purpose: 'Wall sheathing (4x8 sheets)' });
      }
      if (material.name.includes('Roof')) {
        const roofArea = config.length * config.width * 1.2; // Add slope factor
        const sheetsNeeded = Math.ceil(roofArea / 32);
        pieces.push({ length: '8\'', count: sheetsNeeded, purpose: 'Roof sheathing (4x8 sheets)' });
      }
    }

    return { material: material.name, pieces };
  }).filter(item => item.pieces.length > 0);

  return (
    <div className="print-layout">
      {/* Page 1: Plans and Specifications */}
      <div className="print-page">
        <div className="print-header">
          <h1>Shed Construction Plans</h1>
          <div className="project-info">
            <div><strong>Project:</strong> {config.name}</div>
            <div><strong>Dimensions:</strong> {config.length}' × {config.width}' × {config.wallHeight}'</div>
            <div><strong>Roof Type:</strong> {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)}</div>
            <div><strong>Foundation:</strong> {config.foundationType.replace('-', ' ')}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="blueprints-section">
          <h2>Architectural Drawings</h2>
          <div className="blueprint-container">
            <Shed3DViewer config={config} />
          </div>
        </div>

        <div className="specifications">
          <h2>Specifications</h2>
          <div className="spec-grid">
            <div className="spec-item">
              <strong>Foundation Type:</strong> {config.foundationType.replace('-', ' ')}
            </div>
            <div className="spec-item">
              <strong>Lumber Grade:</strong> {config.lumberGrade.replace('-', ' ')}
            </div>
            <div className="spec-item">
              <strong>Joist Spacing:</strong> {config.joistSpacing}" O.C.
            </div>
            <div className="spec-item">
              <strong>Stud Size:</strong> {config.studSize}
            </div>
            <div className="spec-item">
              <strong>Wall Height:</strong> {config.wallHeight}'
            </div>
            <div className="spec-item">
              <strong>Doors:</strong> {config.doorCount}
            </div>
            <div className="spec-item">
              <strong>Windows:</strong> {config.windowCount}
            </div>
            <div className="spec-item">
              <strong>Siding:</strong> {config.sidingType.replace('-', ' ')}
            </div>
            <div className="spec-item">
              <strong>Roofing:</strong> {config.roofingType.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Cut List */}
      <div className="print-page page-break">
        <div className="print-header">
          <h1>Lumber Cut List</h1>
          <div className="project-info">
            <div><strong>Project:</strong> {config.name}</div>
            <div><strong>Cut Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {cutList.length > 0 ? (
          <div className="cut-list-section">
            {cutList.map((item, index) => (
              <div key={index} className="cut-list-item">
                <h3>{item.material}</h3>
                <table className="cut-table">
                  <thead>
                    <tr>
                      <th>Length</th>
                      <th>Quantity</th>
                      <th>Purpose</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.pieces.map((piece, pieceIndex) => (
                      <tr key={pieceIndex}>
                        <td>{piece.length}</td>
                        <td>{piece.count}</td>
                        <td>{piece.purpose}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-cuts">
            <p>No lumber cuts required for this configuration.</p>
          </div>
        )}

        <div className="cutting-notes">
          <h3>Cutting Notes</h3>
          <ul>
            <li>Always measure twice, cut once</li>
            <li>Mark all pieces clearly before cutting</li>
            <li>Use proper safety equipment when cutting</li>
            <li>Double-check measurements against plans</li>
            <li>Account for kerf (blade width) when cutting</li>
          </ul>
        </div>
      </div>

      {/* Page 3: Material List */}
      <div className="print-page page-break">
        <div className="print-header">
          <h1>Material Shopping List</h1>
          <div className="project-info">
            <div><strong>Project:</strong> {config.name}</div>
            <div><strong>Estimated Total:</strong> ${totalCost.toFixed(2)}</div>
            <div><strong>Location:</strong> {zipCode}</div>
          </div>
        </div>

        <div className="materials-section">
          {/* Lumber Materials */}
          {lumberMaterials.length > 0 && (
            <div className="material-category">
              <h2>Lumber & Wood Products</h2>
              <table className="material-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Est. Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lumberMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                      <td>${material.estimatedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Hardware Materials */}
          {hardwareMaterials.length > 0 && (
            <div className="material-category">
              <h2>Hardware & Fasteners</h2>
              <table className="material-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Est. Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {hardwareMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                      <td>${material.estimatedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Roofing Materials */}
          {roofingMaterials.length > 0 && (
            <div className="material-category">
              <h2>Roofing Materials</h2>
              <table className="material-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Est. Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {roofingMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                      <td>${material.estimatedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Siding Materials */}
          {sidingMaterials.length > 0 && (
            <div className="material-category">
              <h2>Siding & Trim</h2>
              <table className="material-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Est. Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sidingMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                      <td>${material.estimatedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Foundation Materials */}
          {foundationMaterials.length > 0 && (
            <div className="material-category">
              <h2>Foundation Materials</h2>
              <table className="material-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Est. Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {foundationMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                      <td>${material.estimatedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="total-section">
          <div className="total-cost">
            <strong>Total Estimated Cost: ${totalCost.toFixed(2)}</strong>
          </div>
          <div className="disclaimer">
            <p><em>Prices are estimates based on average market rates. Actual prices may vary by location and retailer. Always verify current pricing before purchase.</em></p>
          </div>
        </div>
      </div>
    </div>
  );
}
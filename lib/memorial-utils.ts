
import JSZip from 'jszip';
import * as toGeoJSON from '@tmcw/togeojson';
import proj4 from 'proj4';

// Define SIRGAS 2000 UTM zones (we will dynamicly pick based on longitude)
// SIRGAS 2000 is practically identical to WGS 84 for many purposes, but we use the proper definition.
// PROJ4 string for SIRGAS 2000 UTM Zone XXS/N.
// Heuristic: Calculate zone from longitude: floor((lon + 180) / 6) + 1

const getUTMZone = (lon: number) => {
    return Math.floor((lon + 180) / 6) + 1;
};

const getProjString = (zone: number, hemisphere: 'N' | 'S') => {
    return `+proj=utm +zone=${zone} +${hemisphere === 'S' ? 'south ' : ''}+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`;
};

export interface MemorialPoint {
    id: string; // A1, M2, etc.
    lat: number;
    lon: number;
    n: number;
    e: number;
}

export interface MemorialSegment {
    from: string; // Point ID
    to: string;   // Point ID
    azimuth: string; // Formatted DD°MM'SS"
    startN: number;
    startE: number;
    endN: number;
    endE: number;
    distance: number; // meters
    confrontante: string;
}

export interface MemorialData {
    points: MemorialPoint[];
    segments: MemorialSegment[];
    area: number; // sq meters
    perimeter: number; // meters
    city: string;
    state: string;
    utmZone: string;
}

// Decimal Degrees to DMS conversion
export const ddToDms = (deg: number): string => {
    const d = Math.floor(deg);
    const minFloat = (deg - d) * 60;
    const m = Math.floor(minFloat);
    const s = Math.round((minFloat - m) * 60);
    return `${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

// Calculate Azimuth between two points (N, E)
// Returns degrees [0, 360)
const calculateAzimuth = (n1: number, e1: number, n2: number, e2: number): number => {
    const dn = n2 - n1;
    const de = e2 - e1;
    let angle = Math.atan2(de, dn) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
};

export const parseKMZ = async (file: File): Promise<any> => {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    // Find KML file
    const kmlFilename = Object.keys(loadedZip.files).find(name => name.endsWith('.kml'));
    if (!kmlFilename) throw new Error("Arquivo KML não encontrado dentro do KMZ.");

    const kmlString = await loadedZip.files[kmlFilename].async("string");
    const parser = new DOMParser();
    const kmlDom = parser.parseFromString(kmlString, "text/xml");

    // Parse kml to geojson
    const geoJSON = toGeoJSON.kml(kmlDom);

    // Find first Polygon
    let polygonFeature: any = null;

    // Look in features
    if (geoJSON.type === 'FeatureCollection') {
        polygonFeature = geoJSON.features.find((f: any) => f.geometry.type === 'Polygon');
    } else if (geoJSON.type === 'Feature' && geoJSON.geometry.type === 'Polygon') {
        polygonFeature = geoJSON;
    }

    if (!polygonFeature) throw new Error("Nenhum polígono encontrado no arquivo.");

    return polygonFeature;
};

export const processMemorialData = (polygonFeature: any, startPointIndex: number = 0, clockwise: boolean = true): MemorialData => {
    // GeoJSON polygon coordinates are usually [ [ [lon, lat], ... ] ] (array of rings, first ring is exterior)
    // Coordinates are lon, lat
    let coordinates = polygonFeature.geometry.coordinates[0];

    // Remove last point if it duplicates the first (closed loop)
    if (
        coordinates.length > 0 &&
        coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
        coordinates[0][1] === coordinates[coordinates.length - 1][1]
    ) {
        coordinates = coordinates.slice(0, -1);
    }

    if (coordinates.length < 3) throw new Error("Polígono inválido (menos de 3 pontos).");

    // Determine UTM Zone from the first point
    const firstLon = coordinates[0][0];
    const firstLat = coordinates[0][1];
    const zone = getUTMZone(firstLon);
    const hemisphere = firstLat >= 0 ? 'N' : 'S';
    const projString = getProjString(zone, hemisphere);

    // Convert coordinates to UTM
    const utmPoints = coordinates.map((coord: number[], index: number) => {
        const [lon, lat] = coord;
        const [e, n] = proj4(proj4.defs('EPSG:4326')!, projString, [lon, lat]);
        return {
            id: '', // Will assign later
            originalIndex: index,
            lat,
            lon,
            n,
            e
        };
    });

    // Check orientation (Shoelace formula for signed area)
    // Area = 0.5 * sum(x_i * y_i+1 - x_i+1 * y_i)
    // If area is negative, it's clockwise (usually, depending on coord system, but for standard Cartesian N=y E=x)
    // Actually in math: Counter-Clockwise is positive. 
    // We want Clockwise (Horário).
    let sum = 0;
    for (let i = 0; i < utmPoints.length; i++) {
        const p1 = utmPoints[i];
        const p2 = utmPoints[(i + 1) % utmPoints.length];
        sum += (p1.e * p2.n - p2.e * p1.n);
    }
    const currentIsClockwise = sum < 0; // In standard math with Y up, clockwise is negative area.

    // Reorder if needed
    // User requested preference. If user wants Clockwise and it's not, reverse.
    // Note: The prompt says "Sentido do perímetro: Horário (padrão)".
    let orderedPoints = [...utmPoints];
    if (clockwise && !currentIsClockwise) {
        // We need to reverse but keep the start point logically correct?
        // Simpler: just reverse the whole array then we will rotate to start point.
        orderedPoints.reverse();
    } else if (!clockwise && currentIsClockwise) {
        orderedPoints.reverse();
    }

    // Rotate to start point
    // The "startPointIndex" refers to the index in the ORIGINAL array or the SORTED array? 
    // Usually user selects "Point 1". We'll just assume index 0 of the result is A1 unless specified.
    // For now, simple rotation if we were sophisticated, but let's just create labels starting from 0.

    // Assign IDs: A1 for start, M2, M3...
    // But points are vertices.
    // A/M usually refers to "Marco".
    // Let's use A1, P2, P3... or just P1, P2... Prompt says "Ponto inicial (A1)... segue até o marco M2".
    // Let's use A1, M2, M3...

    const finalPoints = orderedPoints.map((p, i) => ({
        ...p,
        id: i === 0 ? 'A1' : `M${i + 1}`
    }));

    // Calculate segments
    const segments: MemorialSegment[] = [];
    let perimeter = 0;

    for (let i = 0; i < finalPoints.length; i++) {
        const p1 = finalPoints[i];
        const p2 = finalPoints[(i + 1) % finalPoints.length];

        const dist = Math.sqrt(Math.pow(p2.e - p1.e, 2) + Math.pow(p2.n - p1.n, 2));
        const azDegrees = calculateAzimuth(p1.n, p1.e, p2.n, p2.e);
        const azString = ddToDms(azDegrees);

        perimeter += dist;

        segments.push({
            from: p1.id,
            to: p2.id,
            azimuth: azString,
            startN: p1.n,
            startE: p1.e,
            endN: p2.n,
            endE: p2.e,
            distance: dist,
            confrontante: 'Confrontante Genérico' // Placeholder
        });
    }

    // Absolute Area
    const area = Math.abs(sum) / 2;

    return {
        points: finalPoints,
        segments,
        area,
        perimeter,
        city: 'Não detectado', // Would require reverse geocoding
        state: 'ND',
        utmZone: `${zone}${hemisphere}`
    };
};

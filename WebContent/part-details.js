/**
 * Catalog copy for bike parts — keyed for material / node matching.
 * Shown in the inspect popup when the user taps a 3D mesh.
 */
export const PART_DETAILS = {
	frame: {
		id: 'frame',
		title: 'Carbon Frame',
		subtitle: 'Main chassis',
		material: 'T700 / T800 carbon fiber composite',
		lifecycle: '10–15 years with proper care · recyclable via specialized CFRP programs',
		weight: '~1.8 kg (frame only)',
		care: 'Avoid sharp impacts; inspect for cracks after crashes; wipe with mild soap.',
		summary:
			'Monocoque carbon frame tuned for stiffness and vibration damping. Carry load paths through the downtube and chainstays.',
		specs: [ 'Full-suspension MTB layout', 'Internal cable routing', 'Boost spacing ready' ],
		accent: '#1C1E22',
		icon: 'frame',
	},
	rim: {
		id: 'rim',
		title: 'Alloy Rim',
		subtitle: 'Wheel bed / Felge',
		material: '6061-T6 aluminum, anodized finish',
		lifecycle: '5–8 years typical · fully recyclable metal',
		weight: '~420 g per rim',
		care: 'Check spoke tension; true after big hits; keep brake track clean if rim-brake.',
		summary:
			'Hookless-style MTB rim bed. Inner finish color is cosmetic; structure stays aluminum underneath.',
		specs: [ '32-hole drill', 'Tubeless-ready tape bed', 'Disc-brake compatible' ],
		accent: '#BC6703',
		icon: 'rim',
	},
	tire: {
		id: 'tire',
		title: 'MTB Tire',
		subtitle: 'Vee / knobby rubber',
		material: 'Dual-compound rubber + nylon casing',
		lifecycle: '2,000–5,000 km depending on terrain · landfill / reclaim programs vary',
		weight: '~900 g per tire',
		care: 'Run correct PSI; sealant refresh every 3–6 months if tubeless.',
		summary:
			'Aggressive tread for mixed trail grip. Sidewall branding is molded rubber detail.',
		specs: [ 'Tubeless compatible', 'Folding bead', 'Trail / enduro profile' ],
		accent: '#222',
		icon: 'tire',
	},
	saddle: {
		id: 'saddle',
		title: 'Performance Saddle',
		subtitle: 'Seat & post contact',
		material: 'Chromoly / alloy rails · foam + synthetic cover',
		lifecycle: '3–6 years · foam compresses over time',
		weight: '~280 g',
		care: 'Keep cover dry; retighten rail clamp torque after travel.',
		summary:
			'Short-nose trail saddle balanced for climbing and descending control.',
		specs: [ 'Pressure-relief channel', 'Microfiber cover', '7 mm rails' ],
		accent: '#333',
		icon: 'saddle',
	},
	drivetrain: {
		id: 'drivetrain',
		title: 'Drivetrain',
		subtitle: 'Cassette · chain · cranks',
		material: 'Hardened steel sprockets · nickel-plated chain',
		lifecycle: 'Chain 1,500–3,000 km · cassette often 2–3 chains',
		weight: 'Group-dependent',
		care: 'Clean & lube chain regularly; replace chain before cassette wears.',
		summary:
			'Wide-range 1x MTB gearing for steep climbs and fast descents.',
		specs: [ '1x Eagle-style range', 'Clutch derailleur compatible', 'Boost crank' ],
		accent: '#666',
		icon: 'drive',
	},
	brakes: {
		id: 'brakes',
		title: 'Disc Brakes',
		subtitle: 'Rotors · calipers · pads',
		material: 'Stainless steel rotors · organic / metallic pads',
		lifecycle: 'Pads 500–2,000 km · rotors longer if not glazed',
		weight: '~180 g per rotor (200 mm)',
		care: 'Keep rotors oil-free; bed-in new pads; bleed mineral/DOT fluid as specified.',
		summary:
			'Hydraulic disc setup for consistent stopping power in wet and dry trails.',
		specs: [ '200 mm rotor option', '4-piston caliper ready', 'Heat-tolerant resin pads' ],
		accent: '#888',
		icon: 'brake',
	},
	suspension: {
		id: 'suspension',
		title: 'Suspension',
		subtitle: 'Fork & rear shock',
		material: 'Aluminum stanchions / body · steel spring or air shaft',
		lifecycle: 'Lower legs service 50h · full service 100–200h',
		weight: 'Fork ~1.9 kg · shock ~0.4 kg',
		care: 'Wipe stanchions after rides; check air pressure; service on schedule.',
		summary:
			'Trail-focused travel that keeps the tire planted over roots and rocks.',
		specs: [ 'Air spring adjustable', 'Rebound damping', 'Lockout / climb switch' ],
		accent: '#4a5560',
		icon: 'suspension',
	},
	handlebar: {
		id: 'handlebar',
		title: 'Cockpit',
		subtitle: 'Bar · grips · levers',
		material: 'Aluminum bar · dual-density rubber grips',
		lifecycle: 'Grips 1–3 years · bar inspect after crashes',
		weight: 'Bar ~300 g',
		care: 'Regrip when torn; check stem bolts to torque spec.',
		summary:
			'Wide trail bar for control; grip ends can match rim accent colors.',
		specs: [ '35 mm clamp common', 'Sweep / rise trail geometry', 'Lock-on grips' ],
		accent: '#BC6703',
		icon: 'bar',
	},
	pedal: {
		id: 'pedal',
		title: 'Pedals',
		subtitle: 'Platform contact',
		material: 'CNC aluminum body · chromoly axle',
		lifecycle: 'Bearings serviceable · 2–5 years',
		weight: '~350 g pair',
		care: 'Grease axles yearly; replace pins when rounded.',
		summary:
			'Flat pedals with pin grip for trail shoes.',
		specs: [ 'Sealed bearings', 'Replaceable pins', '9/16" axle' ],
		accent: '#222',
		icon: 'pedal',
	},
	hardware: {
		id: 'hardware',
		title: 'Hardware',
		subtitle: 'Bolts · clamps · small parts',
		material: 'Stainless / chromoly fasteners',
		lifecycle: 'Replace if stretched or corroded',
		weight: '—',
		care: 'Use correct torque & threadlocker where specified.',
		summary:
			'Structural fasteners that hold assemblies under trail loads.',
		specs: [ 'Metric hardware', 'Torque-critical joints', 'Corrosion resistant' ],
		accent: '#999',
		icon: 'bolt',
	},
	generic: {
		id: 'generic',
		title: 'Bike Component',
		subtitle: 'Selected part',
		material: 'Mixed alloys & polymers',
		lifecycle: 'Varies by part family',
		weight: '—',
		care: 'Inspect regularly; follow manufacturer service intervals.',
		summary:
			'Tap another area for a more specific part card — frame, rim, tire, brakes, and more.',
		specs: [ 'Interactive inspect mode', 'Tap parts on the 3D bike' ],
		accent: '#5c6370',
		icon: 'generic',
	},
};

/** Resolve a catalog entry from mesh material name + parent node names. */
export function resolvePartDetail( materialName = '', nodeNames = [] ) {

	const mat = ( materialName || '' ).toLowerCase();
	const nodes = nodeNames.map( ( n ) => ( n || '' ).toLowerCase() ).join( ' ' );

	const has = ( ...keys ) => keys.some( ( k ) => mat.includes( k ) || nodes.includes( k ) );

	if ( has( 'felge', 'rim' ) ) return PART_DETAILS.rim;
	if ( has( 'reifen', 'tire', 'schlauch' ) ) return PART_DETAILS.tire;
	if ( has( 'sattel' ) ) return PART_DETAILS.saddle;
	if ( has( 'getriebe', 'chain', 'ritzel', 'pedale', 'kurbel' ) ) return PART_DETAILS.drivetrain;
	if ( has( 'bremse', 'bremsscheibe', 'bremshebel', 'bremskloetze' ) ) return PART_DETAILS.brakes;
	if ( has( 'feder', 'federgabel', 'federung', 'federachse' ) ) return PART_DETAILS.suspension;
	if ( has( 'lenker', 'griff', 'griffe' ) ) return PART_DETAILS.handlebar;
	if ( has( 'pedale' ) ) return PART_DETAILS.pedal;
	if ( has( 'schrauben' ) ) return PART_DETAILS.hardware;
	if ( has( 'carbon', 'rahmen', 'bike_logo', 'label', 'unterschutz' ) ) return PART_DETAILS.frame;
	if ( has( 'metal' ) ) {

		if ( nodes.includes( 'feder' ) || nodes.includes( 'gabel' ) ) return PART_DETAILS.suspension;
		if ( nodes.includes( 'lenker' ) || nodes.includes( 'sattel' ) ) {

			return nodes.includes( 'sattel' ) ? PART_DETAILS.saddle : PART_DETAILS.handlebar;

		}

	}

	return PART_DETAILS.generic;

}

// ─── Unit Converter Data & Logic ─────────────────────────────────────────────

export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  toBase: number;
}

export interface UnitCategory {
  id: string;
  label: string;
  icon: string;
  units: UnitDef[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  // 1. Temperature — highest search volume ("celsius to fahrenheit")
  {
    id: 'temperature',
    label: 'Temperature',
    icon: '🌡️',
    units: [
      { id: 'celsius', label: 'Celsius', symbol: '°C', toBase: 1 },
      { id: 'fahrenheit', label: 'Fahrenheit', symbol: '°F', toBase: 1 },
      { id: 'kelvin', label: 'Kelvin', symbol: 'K', toBase: 1 },
    ],
  },
  // 2. Length — "inches to cm", "miles to km"
  {
    id: 'length',
    label: 'Length',
    icon: '📏',
    units: [
      { id: 'millimeter', label: 'Millimeters', symbol: 'mm', toBase: 0.001 },
      { id: 'centimeter', label: 'Centimeters', symbol: 'cm', toBase: 0.01 },
      { id: 'meter', label: 'Meters', symbol: 'm', toBase: 1 },
      { id: 'kilometer', label: 'Kilometers', symbol: 'km', toBase: 1000 },
      { id: 'inch', label: 'Inches', symbol: 'in', toBase: 0.0254 },
      { id: 'foot', label: 'Feet', symbol: 'ft', toBase: 0.3048 },
      { id: 'yard', label: 'Yards', symbol: 'yd', toBase: 0.9144 },
      { id: 'mile', label: 'Miles', symbol: 'mi', toBase: 1609.344 },
    ],
  },
  // 3. Weight — "kg to lbs", "lbs to kg"
  {
    id: 'weight',
    label: 'Weight',
    icon: '⚖️',
    units: [
      { id: 'milligram', label: 'Milligrams', symbol: 'mg', toBase: 0.001 },
      { id: 'gram', label: 'Grams', symbol: 'g', toBase: 1 },
      { id: 'kilogram', label: 'Kilograms', symbol: 'kg', toBase: 1000 },
      { id: 'pound', label: 'Pounds', symbol: 'lb', toBase: 453.592 },
      { id: 'ounce', label: 'Ounces', symbol: 'oz', toBase: 28.3495 },
      { id: 'metric_ton', label: 'Metric Tons', symbol: 't', toBase: 1_000_000 },
    ],
  },
  // 4. Volume — "cups to ml", "liters to gallons"
  {
    id: 'volume',
    label: 'Volume',
    icon: '🧪',
    units: [
      { id: 'milliliter', label: 'Milliliters', symbol: 'mL', toBase: 1 },
      { id: 'liter', label: 'Liters', symbol: 'L', toBase: 1000 },
      { id: 'us_gallon', label: 'Gallons (US)', symbol: 'gal', toBase: 3785.41 },
      { id: 'us_quart', label: 'Quarts (US)', symbol: 'qt', toBase: 946.353 },
      { id: 'us_cup', label: 'Cups (US)', symbol: 'cup', toBase: 236.588 },
      { id: 'us_fl_oz', label: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: 29.5735 },
      { id: 'tablespoon', label: 'Tablespoons', symbol: 'tbsp', toBase: 14.7868 },
      { id: 'teaspoon', label: 'Teaspoons', symbol: 'tsp', toBase: 4.92892 },
    ],
  },
  // 5. Digital Storage — "MB to GB", "GB to TB"
  {
    id: 'digital',
    label: 'Digital Storage',
    icon: '💾',
    units: [
      { id: 'byte', label: 'Bytes', symbol: 'B', toBase: 1 },
      { id: 'kilobyte', label: 'Kilobytes', symbol: 'KB', toBase: 1024 },
      { id: 'megabyte', label: 'Megabytes', symbol: 'MB', toBase: 1_048_576 },
      { id: 'gigabyte', label: 'Gigabytes', symbol: 'GB', toBase: 1_073_741_824 },
      { id: 'terabyte', label: 'Terabytes', symbol: 'TB', toBase: 1_099_511_627_776 },
      { id: 'petabyte', label: 'Petabytes', symbol: 'PB', toBase: 1_125_899_906_842_624 },
    ],
  },
  // 6. Area — "sq ft to sq m", "acres to hectares"
  {
    id: 'area',
    label: 'Area',
    icon: '📐',
    units: [
      { id: 'sq_millimeter', label: 'Square Millimeters', symbol: 'mm²', toBase: 0.000001 },
      { id: 'sq_centimeter', label: 'Square Centimeters', symbol: 'cm²', toBase: 0.0001 },
      { id: 'sq_meter', label: 'Square Meters', symbol: 'm²', toBase: 1 },
      { id: 'sq_kilometer', label: 'Square Kilometers', symbol: 'km²', toBase: 1_000_000 },
      { id: 'sq_foot', label: 'Square Feet', symbol: 'ft²', toBase: 0.092903 },
      { id: 'sq_yard', label: 'Square Yards', symbol: 'yd²', toBase: 0.836127 },
      { id: 'acre', label: 'Acres', symbol: 'ac', toBase: 4046.8564224 },
      { id: 'hectare', label: 'Hectares', symbol: 'ha', toBase: 10000 },
    ],
  },
  // 7. Speed — "km/h to mph"
  {
    id: 'speed',
    label: 'Speed',
    icon: '🚀',
    units: [
      { id: 'meter_per_second', label: 'Meters per Second', symbol: 'm/s', toBase: 1 },
      { id: 'kilometer_per_hour', label: 'Kilometers per Hour', symbol: 'km/h', toBase: 1 / 3.6 },
      { id: 'mile_per_hour', label: 'Miles per Hour', symbol: 'mph', toBase: 0.44704 },
      { id: 'knot', label: 'Knots', symbol: 'kn', toBase: 0.514444 },
      { id: 'foot_per_second', label: 'Feet per Second', symbol: 'ft/s', toBase: 0.3048 },
    ],
  },
  // 8. Data Rate — "Mbps to MB/s"
  {
    id: 'data_rate',
    label: 'Data Rate',
    icon: '📡',
    units: [
      { id: 'bit_per_second', label: 'Bits/sec', symbol: 'bps', toBase: 1 },
      { id: 'kilobit_per_second', label: 'Kilobits/sec', symbol: 'Kbps', toBase: 1000 },
      { id: 'megabit_per_second', label: 'Megabits/sec', symbol: 'Mbps', toBase: 1_000_000 },
      { id: 'gigabit_per_second', label: 'Gigabits/sec', symbol: 'Gbps', toBase: 1_000_000_000 },
      { id: 'byte_per_second', label: 'Bytes/sec', symbol: 'B/s', toBase: 8 },
      { id: 'megabyte_per_second', label: 'Megabytes/sec', symbol: 'MB/s', toBase: 8_000_000 },
    ],
  },
  // 9. Energy — "calories to joules", "kWh"
  {
    id: 'energy',
    label: 'Energy',
    icon: '⚡',
    units: [
      { id: 'joule', label: 'Joules', symbol: 'J', toBase: 1 },
      { id: 'kilojoule', label: 'Kilojoules', symbol: 'kJ', toBase: 1000 },
      { id: 'calorie', label: 'Calories', symbol: 'cal', toBase: 4.184 },
      { id: 'kilocalorie', label: 'Kilocalories', symbol: 'kcal', toBase: 4184 },
      { id: 'watt_hour', label: 'Watt-hours', symbol: 'Wh', toBase: 3600 },
      { id: 'kilowatt_hour', label: 'Kilowatt-hours', symbol: 'kWh', toBase: 3_600_000 },
      { id: 'btu', label: 'BTU', symbol: 'BTU', toBase: 1055.06 },
    ],
  },
  // 10. Time — "hours to minutes"
  {
    id: 'time',
    label: 'Time',
    icon: '⏱️',
    units: [
      { id: 'second', label: 'Seconds', symbol: 's', toBase: 1 },
      { id: 'minute', label: 'Minutes', symbol: 'min', toBase: 60 },
      { id: 'hour', label: 'Hours', symbol: 'h', toBase: 3600 },
      { id: 'day', label: 'Days', symbol: 'd', toBase: 86400 },
      { id: 'week', label: 'Weeks', symbol: 'wk', toBase: 604800 },
      { id: 'month', label: 'Months (30d)', symbol: 'mo', toBase: 2_592_000 },
      { id: 'year', label: 'Years (365d)', symbol: 'yr', toBase: 31_536_000 },
    ],
  },
  // 11. Pressure — "PSI to bar"
  {
    id: 'pressure',
    label: 'Pressure',
    icon: '🌀',
    units: [
      { id: 'pascal', label: 'Pascals', symbol: 'Pa', toBase: 1 },
      { id: 'kilopascal', label: 'Kilopascals', symbol: 'kPa', toBase: 1000 },
      { id: 'bar', label: 'Bars', symbol: 'bar', toBase: 100000 },
      { id: 'psi', label: 'PSI', symbol: 'psi', toBase: 6894.76 },
      { id: 'atmosphere', label: 'Atmospheres', symbol: 'atm', toBase: 101325 },
      { id: 'mmhg', label: 'mmHg', symbol: 'mmHg', toBase: 133.322 },
    ],
  },
  // 12. Power — "watts to horsepower"
  {
    id: 'power',
    label: 'Power',
    icon: '🔌',
    units: [
      { id: 'watt', label: 'Watts', symbol: 'W', toBase: 1 },
      { id: 'kilowatt', label: 'Kilowatts', symbol: 'kW', toBase: 1000 },
      { id: 'megawatt', label: 'Megawatts', symbol: 'MW', toBase: 1_000_000 },
      { id: 'horsepower', label: 'Horsepower', symbol: 'hp', toBase: 745.7 },
      { id: 'btu_per_hour', label: 'BTU/hour', symbol: 'BTU/h', toBase: 0.29307 },
      { id: 'foot_pound_per_second', label: 'Foot-pounds/sec', symbol: 'ft·lbf/s', toBase: 1.35582 },
    ],
  },
  // 13. Fuel Economy — "MPG to L/100km"
  {
    id: 'fuel_economy',
    label: 'Fuel Economy',
    icon: '⛽',
    units: [
      { id: 'km_per_liter', label: 'Kilometers/Liter', symbol: 'km/L', toBase: 1 },
      { id: 'mpg_us', label: 'Miles/Gallon (US)', symbol: 'mpg', toBase: 0.425144 },
      { id: 'mpg_uk', label: 'Miles/Gallon (UK)', symbol: 'mpg (UK)', toBase: 0.354006 },
      { id: 'l_per_100km', label: 'Liters/100km', symbol: 'L/100km', toBase: -1 },
    ],
  },
  // 14. Frequency — "MHz to GHz"
  {
    id: 'frequency',
    label: 'Frequency',
    icon: '🔊',
    units: [
      { id: 'hertz', label: 'Hertz', symbol: 'Hz', toBase: 1 },
      { id: 'kilohertz', label: 'Kilohertz', symbol: 'kHz', toBase: 1000 },
      { id: 'megahertz', label: 'Megahertz', symbol: 'MHz', toBase: 1_000_000 },
      { id: 'gigahertz', label: 'Gigahertz', symbol: 'GHz', toBase: 1_000_000_000 },
      { id: 'rpm', label: 'RPM', symbol: 'rpm', toBase: 1 / 60 },
    ],
  },
  // 15. Angle — "degrees to radians"
  {
    id: 'angle',
    label: 'Angle',
    icon: '📐',
    units: [
      { id: 'degree', label: 'Degrees', symbol: '°', toBase: 1 },
      { id: 'radian', label: 'Radians', symbol: 'rad', toBase: 180 / Math.PI },
      { id: 'gradian', label: 'Gradians', symbol: 'gon', toBase: 0.9 },
      { id: 'arcminute', label: 'Arcminutes', symbol: '′', toBase: 1 / 60 },
      { id: 'arcsecond', label: 'Arcseconds', symbol: '″', toBase: 1 / 3600 },
      { id: 'turn', label: 'Turns', symbol: 'turn', toBase: 360 },
    ],
  },
  // 16. Force — "Newton to pound-force"
  {
    id: 'force',
    label: 'Force',
    icon: '💪',
    units: [
      { id: 'newton', label: 'Newtons', symbol: 'N', toBase: 1 },
      { id: 'kilonewton', label: 'Kilonewtons', symbol: 'kN', toBase: 1000 },
      { id: 'pound_force', label: 'Pound-force', symbol: 'lbf', toBase: 4.44822 },
      { id: 'kilogram_force', label: 'Kilogram-force', symbol: 'kgf', toBase: 9.80665 },
      { id: 'dyne', label: 'Dynes', symbol: 'dyn', toBase: 0.00001 },
    ],
  },
  // 17. Radiation — "sievert to rem" (niche but low competition)
  {
    id: 'radiation',
    label: 'Radiation',
    icon: '☢️',
    units: [
      { id: 'sievert', label: 'Sieverts', symbol: 'Sv', toBase: 1 },
      { id: 'millisievert', label: 'Millisieverts', symbol: 'mSv', toBase: 0.001 },
      { id: 'microsievert', label: 'Microsieverts', symbol: 'μSv', toBase: 0.000001 },
      { id: 'rem', label: 'Rem', symbol: 'rem', toBase: 0.01 },
      { id: 'millirem', label: 'Millirem', symbol: 'mrem', toBase: 0.00001 },
      { id: 'gray', label: 'Grays', symbol: 'Gy', toBase: 1 },
      { id: 'milligray', label: 'Milligrays', symbol: 'mGy', toBase: 0.001 },
      { id: 'rad_unit', label: 'Rads', symbol: 'rad', toBase: 0.01 },
      { id: 'roentgen', label: 'Roentgens', symbol: 'R', toBase: 0.00877 },
    ],
  },
];

// ─── Temperature special conversion ─────────────────────────────────────────

function convertTemperature(value: number, fromId: string, toId: string): number {
  if (fromId === toId) return value;

  // Convert to Celsius first
  let celsius: number;
  switch (fromId) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      return value;
  }

  // Convert from Celsius to target
  switch (toId) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return celsius * (9 / 5) + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      return value;
  }
}

// ─── Fuel economy special conversion ─────────────────────────────────────────
// L/100km is an inverse relationship: lower = more efficient (opposite of km/L, mpg)

function convertFuelEconomy(value: number, fromId: string, toId: string): number {
  if (fromId === toId) return value;
  if (value === 0) return 0;

  // Convert to km/L first
  let kmPerL: number;
  switch (fromId) {
    case 'km_per_liter': kmPerL = value; break;
    case 'mpg_us': kmPerL = value * 0.425144; break;
    case 'mpg_uk': kmPerL = value * 0.354006; break;
    case 'l_per_100km': kmPerL = 100 / value; break;
    default: return value;
  }

  // Convert from km/L to target
  switch (toId) {
    case 'km_per_liter': return kmPerL;
    case 'mpg_us': return kmPerL / 0.425144;
    case 'mpg_uk': return kmPerL / 0.354006;
    case 'l_per_100km': return kmPerL > 0 ? 100 / kmPerL : 0;
    default: return value;
  }
}

// ─── Main convert function ──────────────────────────────────────────────────

export function convert(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: string,
): number {
  if (fromUnitId === toUnitId) return value;

  if (categoryId === 'temperature') {
    return convertTemperature(value, fromUnitId, toUnitId);
  }

  if (categoryId === 'fuel_economy') {
    return convertFuelEconomy(value, fromUnitId, toUnitId);
  }

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return value;

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return value;

  return (value * fromUnit.toBase) / toUnit.toBase;
}

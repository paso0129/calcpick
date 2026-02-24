// ─── Per-category SEO data for unit converter pages ─────────────────────────

export interface UnitCategorySEO {
  slug: string;
  title: string;
  pageTitle: string;
  description: string;
  h1: string;
  subtitle: string;
  faqs: { question: string; answer: string }[];
  article: { heading: string; paragraphs: string[] }[];
}

export const UNIT_SEO: Record<string, UnitCategorySEO> = {
  length: {
    slug: 'length',
    title: 'Length',
    pageTitle: 'Length Unit Converter - Meters, Feet, Miles, Kilometers | CalcPick',
    description: 'Free online length converter. Convert between meters, kilometers, miles, feet, inches, yards, centimeters, and millimeters instantly.',
    h1: 'Length Unit Converter',
    subtitle: 'Convert between metric and imperial length units',
    faqs: [
      {
        question: 'How many feet are in a meter?',
        answer: 'One meter equals approximately 3.28084 feet. Conversely, one foot equals exactly 0.3048 meters. This conversion is used frequently in construction, aviation, and everyday measurements when converting between the metric and imperial systems.',
      },
      {
        question: 'What is the difference between a mile and a kilometer?',
        answer: 'One mile equals approximately 1.60934 kilometers. The mile is used primarily in the United States, the United Kingdom, and a few other countries, while the kilometer is the standard unit of distance in most of the world. For a quick mental estimate, multiply miles by 1.6 to get kilometers.',
      },
      {
        question: 'How do I convert inches to centimeters?',
        answer: 'Multiply the number of inches by 2.54 to get centimeters. For example, 12 inches equals 30.48 centimeters. This conversion is essential when working with international product dimensions, screen sizes, or technical specifications.',
      },
    ],
    article: [
      {
        heading: 'Understanding Length Measurements',
        paragraphs: [
          'Length is one of the most fundamental physical quantities, used in virtually every field from construction and engineering to everyday navigation. The metric system uses meters as its base unit, with prefixes like milli-, centi-, and kilo- for smaller and larger measurements. The imperial system uses inches, feet, yards, and miles.',
          'International trade, travel, and scientific collaboration require frequent conversion between these systems. A runner tracking distances in miles may need to convert to kilometers for an international race. An engineer working with imported components may need to convert millimeters to inches for compatibility with domestic specifications.',
        ],
      },
      {
        heading: 'Common Length Conversions',
        paragraphs: [
          'The most frequently needed conversions include miles to kilometers for travel and navigation, feet to meters for construction and height measurements, and inches to centimeters for product dimensions and screen sizes. Understanding these relationships helps in everyday situations like reading foreign road signs, comparing product specifications, or following building plans.',
          'For precision work, it helps to know that one inch is defined as exactly 25.4 millimeters. This exact definition means that conversions between metric and imperial length units can be calculated with perfect accuracy, unlike some other unit conversions that rely on measured physical constants.',
        ],
      },
    ],
  },

  weight: {
    slug: 'weight',
    title: 'Weight',
    pageTitle: 'Weight & Mass Converter - Kilograms, Pounds, Ounces, Grams | CalcPick',
    description: 'Free online weight converter. Convert between kilograms, pounds, ounces, grams, milligrams, and metric tons instantly.',
    h1: 'Weight & Mass Converter',
    subtitle: 'Convert between metric and imperial weight units',
    faqs: [
      {
        question: 'How many pounds are in a kilogram?',
        answer: 'One kilogram equals approximately 2.20462 pounds. This conversion is commonly needed when traveling internationally, comparing body weight measurements, or working with shipping weights. For a quick estimate, multiply kilograms by 2.2.',
      },
      {
        question: 'What is the difference between mass and weight?',
        answer: 'Mass measures the amount of matter in an object and remains constant regardless of location. Weight is the force of gravity acting on that mass and varies depending on gravitational field strength. On Earth\'s surface, a 1 kg mass weighs approximately 9.81 Newtons. For everyday conversions, the terms are used interchangeably.',
      },
      {
        question: 'How many ounces are in a pound?',
        answer: 'There are exactly 16 ounces in one pound. One ounce equals approximately 28.35 grams. Ounces are commonly used in the US for food packaging, cooking measurements, and postal weights.',
      },
    ],
    article: [
      {
        heading: 'Understanding Weight Measurements',
        paragraphs: [
          'Weight and mass measurements are essential in cooking, shipping, medicine, science, and daily life. The metric system uses grams and kilograms, while the imperial system uses ounces, pounds, and tons. Most countries outside the United States use the metric system exclusively.',
          'In international commerce, weight conversions are critical for shipping calculations, trade agreements, and customs declarations. In medicine, accurate weight conversion between pounds and kilograms is essential for drug dosage calculations, making conversion errors potentially dangerous.',
        ],
      },
      {
        heading: 'Practical Weight Conversion Tips',
        paragraphs: [
          'For quick mental math: 1 kg is roughly 2.2 lbs, and 1 lb is roughly 450 grams. When cooking with international recipes, remember that many European recipes use grams while American recipes use ounces and cups. A kitchen scale that displays both units eliminates the need for manual conversion.',
          'For shipping and logistics, understanding the difference between metric tons (1,000 kg) and US tons (2,000 lbs, or about 907 kg) is important. A metric ton is approximately 10% heavier than a US ton, which can significantly impact shipping costs and load calculations.',
        ],
      },
    ],
  },

  temperature: {
    slug: 'temperature',
    title: 'Temperature',
    pageTitle: 'Temperature Converter - Celsius, Fahrenheit, Kelvin | CalcPick',
    description: 'Free online temperature converter. Convert between Celsius, Fahrenheit, and Kelvin with accurate non-linear formulas.',
    h1: 'Temperature Converter',
    subtitle: 'Convert between Celsius, Fahrenheit, and Kelvin scales',
    faqs: [
      {
        question: 'How do I convert Fahrenheit to Celsius?',
        answer: 'Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. For example, 72°F = (72 - 32) × 5/9 = 22.22°C. For a quick estimate, subtract 30 and divide by 2, which gives a rough approximation.',
      },
      {
        question: 'What is absolute zero?',
        answer: 'Absolute zero is 0 Kelvin, which equals -273.15°C or -459.67°F. It is the theoretical lowest temperature where all molecular motion stops. The Kelvin scale is used in scientific contexts because it starts at absolute zero, making it an absolute thermodynamic temperature scale.',
      },
      {
        question: 'Why does the US use Fahrenheit?',
        answer: 'The Fahrenheit scale was developed by Daniel Gabriel Fahrenheit in 1724 and was widely adopted in English-speaking countries. While most of the world has since switched to Celsius, the United States, along with a few other territories, continues to use Fahrenheit for weather, cooking, and everyday temperature references.',
      },
    ],
    article: [
      {
        heading: 'Understanding Temperature Scales',
        paragraphs: [
          'Three temperature scales are in common use: Celsius (used worldwide for everyday measurements), Fahrenheit (used primarily in the United States), and Kelvin (used in scientific contexts). Unlike length or weight conversions, temperature conversion requires formulas rather than simple multiplication because the scales have different zero points.',
          'Water freezes at 0°C (32°F, 273.15K) and boils at 100°C (212°F, 373.15K) at standard atmospheric pressure. These reference points make Celsius intuitive for everyday use, while the Kelvin scale\'s absolute zero reference point makes it essential for physics and chemistry.',
        ],
      },
      {
        heading: 'Practical Temperature Conversion',
        paragraphs: [
          'Common temperature references help with quick estimation: room temperature is about 20-22°C (68-72°F), body temperature is 37°C (98.6°F), and a hot summer day might be 35°C (95°F). For cooking, 180°C equals 356°F and 200°C equals 392°F, which are common oven temperatures in European recipes.',
          'In scientific and industrial applications, Kelvin is preferred because it provides an absolute scale with no negative values. This simplifies calculations in thermodynamics, gas laws, and radiation physics. Converting between Celsius and Kelvin is straightforward: simply add or subtract 273.15.',
        ],
      },
    ],
  },

  area: {
    slug: 'area',
    title: 'Area',
    pageTitle: 'Area Unit Converter - Square Meters, Acres, Hectares, Square Feet | CalcPick',
    description: 'Free online area converter. Convert between square meters, square feet, acres, hectares, square kilometers, and more.',
    h1: 'Area Unit Converter',
    subtitle: 'Convert between metric and imperial area units',
    faqs: [
      {
        question: 'How many square feet are in an acre?',
        answer: 'One acre equals exactly 43,560 square feet, or approximately 4,047 square meters. An acre is roughly the size of a football field without the end zones. This unit is commonly used in real estate and agriculture in the United States and United Kingdom.',
      },
      {
        question: 'What is the difference between a hectare and an acre?',
        answer: 'One hectare equals 10,000 square meters or approximately 2.471 acres. The hectare is used internationally for land measurement, while the acre is more common in the US and UK. For quick conversion, multiply hectares by 2.5 to get an approximate value in acres.',
      },
    ],
    article: [
      {
        heading: 'Understanding Area Measurements',
        paragraphs: [
          'Area measurements are essential in real estate, agriculture, construction, and urban planning. The metric system uses square meters and hectares, while the imperial system uses square feet, square yards, and acres. Converting between these systems is critical when dealing with international property transactions or comparing land sizes across countries.',
          'For smaller measurements, square centimeters and square inches are used for product dimensions and material specifications. For larger areas, square kilometers and square miles describe cities, countries, and geographic regions.',
        ],
      },
    ],
  },

  volume: {
    slug: 'volume',
    title: 'Volume',
    pageTitle: 'Volume Unit Converter - Liters, Gallons, Cups, Milliliters | CalcPick',
    description: 'Free online volume converter. Convert between liters, gallons, cups, milliliters, fluid ounces, tablespoons, and teaspoons.',
    h1: 'Volume Unit Converter',
    subtitle: 'Convert between metric and US customary volume units',
    faqs: [
      {
        question: 'How many cups are in a liter?',
        answer: 'One liter equals approximately 4.227 US cups. This conversion is frequently needed when following recipes from different countries. European recipes typically use milliliters and liters, while American recipes use cups, tablespoons, and teaspoons.',
      },
      {
        question: 'How many liters are in a gallon?',
        answer: 'One US gallon equals approximately 3.785 liters. Note that the UK (imperial) gallon is larger at approximately 4.546 liters. This distinction is important when comparing fuel economy figures or liquid volumes between American and British measurements.',
      },
    ],
    article: [
      {
        heading: 'Understanding Volume Measurements',
        paragraphs: [
          'Volume measurements are used daily in cooking, beverage serving, fuel purchasing, and scientific experiments. The metric system uses milliliters and liters, while the US customary system uses fluid ounces, cups, quarts, and gallons. Kitchen conversions between these systems are among the most commonly searched unit conversions online.',
          'For cooking, knowing that 1 tablespoon equals approximately 15 mL and 1 cup equals approximately 237 mL helps when adapting international recipes. For larger volumes, the US gallon (3.785 L) differs significantly from the imperial gallon (4.546 L), which can cause confusion in fuel economy comparisons.',
        ],
      },
    ],
  },

  speed: {
    slug: 'speed',
    title: 'Speed',
    pageTitle: 'Speed Unit Converter - km/h, mph, m/s, Knots | CalcPick',
    description: 'Free online speed converter. Convert between kilometers per hour, miles per hour, meters per second, knots, and feet per second.',
    h1: 'Speed Unit Converter',
    subtitle: 'Convert between common speed and velocity units',
    faqs: [
      {
        question: 'How do I convert km/h to mph?',
        answer: 'Divide the speed in km/h by 1.60934 to get mph. For example, 100 km/h equals approximately 62.14 mph. For a quick estimate, multiply km/h by 0.6. This conversion is essential when driving in countries that use different speed measurement systems.',
      },
      {
        question: 'What is a knot?',
        answer: 'A knot equals one nautical mile per hour, or approximately 1.852 km/h (1.151 mph). Knots are used in maritime and aviation navigation worldwide. The term comes from the historical practice of measuring a ship\'s speed by counting knots on a rope pulled through the water.',
      },
    ],
    article: [
      {
        heading: 'Understanding Speed Measurements',
        paragraphs: [
          'Speed is measured differently across countries and applications. Most countries use kilometers per hour (km/h) for road speed limits, while the US and UK use miles per hour (mph). Scientific and engineering applications typically use meters per second (m/s), and maritime and aviation use knots.',
          'Understanding speed conversions is important for international travel, automotive comparisons, and interpreting weather data. Wind speeds, for example, may be reported in km/h, mph, or knots depending on the source and country.',
        ],
      },
    ],
  },

  time: {
    slug: 'time',
    title: 'Time',
    pageTitle: 'Time Unit Converter - Seconds, Minutes, Hours, Days, Weeks | CalcPick',
    description: 'Free online time converter. Convert between seconds, minutes, hours, days, weeks, months, and years instantly.',
    h1: 'Time Unit Converter',
    subtitle: 'Convert between time duration units',
    faqs: [
      {
        question: 'How many seconds are in a day?',
        answer: 'There are exactly 86,400 seconds in a day (24 hours × 60 minutes × 60 seconds). This number is fundamental in computing, where Unix timestamps count seconds since January 1, 1970.',
      },
      {
        question: 'How many days are in a year?',
        answer: 'A standard calendar year has 365 days, while a leap year has 366 days. For conversion purposes, this tool uses 365 days per year. The average Gregorian calendar year is 365.2425 days, which is why we have leap years approximately every 4 years.',
      },
    ],
    article: [
      {
        heading: 'Understanding Time Conversions',
        paragraphs: [
          'Time conversion is essential in project management, scientific research, computing, and everyday planning. While the relationships between seconds, minutes, hours, and days are well known, larger units like months and years require approximations because they vary in actual duration.',
          'In this converter, one month is defined as 30 days and one year as 365 days. These are standard approximations used in financial calculations, project planning, and general estimation. For precise calendar calculations, dedicated date/time tools should be used.',
        ],
      },
    ],
  },

  digital: {
    slug: 'digital',
    title: 'Digital Storage',
    pageTitle: 'Digital Storage Converter - Bytes, KB, MB, GB, TB, PB | CalcPick',
    description: 'Free online digital storage converter. Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes using binary prefixes.',
    h1: 'Digital Storage Converter',
    subtitle: 'Convert between digital storage units (binary prefixes)',
    faqs: [
      {
        question: 'Is 1 KB equal to 1000 or 1024 bytes?',
        answer: 'This converter uses binary prefixes where 1 KB = 1,024 bytes. This matches how operating systems report file sizes and how memory is addressed. Some storage manufacturers use decimal prefixes (1 KB = 1,000 bytes) per the SI standard, which is why a "500 GB" hard drive may show as approximately 465 GB in your operating system.',
      },
      {
        question: 'How many gigabytes are in a terabyte?',
        answer: 'Using binary prefixes, 1 terabyte (TB) equals 1,024 gigabytes (GB). This means a 2 TB hard drive holds 2,048 GB of data. For reference, 1 TB can store approximately 250,000 photos, 500 hours of video, or 6.5 million document pages.',
      },
    ],
    article: [
      {
        heading: 'Understanding Digital Storage Units',
        paragraphs: [
          'Digital storage is measured in bytes and their multiples. The binary system (used by computers) counts in powers of 1,024: 1 KB = 1,024 bytes, 1 MB = 1,024 KB, and so on. This is because computers use binary addressing, making powers of 2 natural boundaries.',
          'The distinction between binary and decimal prefixes causes a well-known discrepancy: a "1 TB" hard drive advertised by manufacturers (using 1 TB = 1,000,000,000,000 bytes) shows as approximately 931 GB in an operating system (using 1 GB = 1,073,741,824 bytes). This converter uses binary prefixes to match how computers actually measure storage.',
        ],
      },
    ],
  },

  pressure: {
    slug: 'pressure',
    title: 'Pressure',
    pageTitle: 'Pressure Unit Converter - Pascal, Bar, PSI, ATM, mmHg | CalcPick',
    description: 'Free online pressure converter. Convert between Pascal, kilopascal, bar, PSI, atmospheres, and mmHg instantly.',
    h1: 'Pressure Unit Converter',
    subtitle: 'Convert between pressure and stress units',
    faqs: [
      {
        question: 'How do I convert PSI to bar?',
        answer: 'Divide PSI by 14.5038 to get bar, or multiply bar by 14.5038 to get PSI. For example, 30 PSI equals approximately 2.07 bar. This conversion is commonly needed when checking tire pressure, as European specifications use bar while American specifications use PSI.',
      },
      {
        question: 'What is standard atmospheric pressure?',
        answer: 'Standard atmospheric pressure is defined as 101,325 Pascals, which equals 1 atm, 1.01325 bar, 14.696 PSI, or 760 mmHg. This is the average air pressure at sea level and serves as a reference point for many scientific and engineering calculations.',
      },
    ],
    article: [
      {
        heading: 'Understanding Pressure Measurements',
        paragraphs: [
          'Pressure is force applied per unit area and is measured in various units depending on the application. The SI unit is the Pascal (Pa), but common alternatives include bar, PSI (pounds per square inch), atmospheres (atm), and millimeters of mercury (mmHg). Each unit is prevalent in different industries and regions.',
          'Tire pressure is typically measured in PSI in the US and bar in Europe. Blood pressure is measured in mmHg worldwide. Industrial and scientific applications often use Pascal or kilopascal. Weather reports may use hectopascals (hPa) or millibars, which are numerically equal.',
        ],
      },
    ],
  },

  energy: {
    slug: 'energy',
    title: 'Energy',
    pageTitle: 'Energy Unit Converter - Joules, Calories, kWh, BTU | CalcPick',
    description: 'Free online energy converter. Convert between joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours, and BTU.',
    h1: 'Energy Unit Converter',
    subtitle: 'Convert between energy and work units',
    faqs: [
      {
        question: 'How many calories are in a kilocalorie?',
        answer: 'One kilocalorie (kcal) equals exactly 1,000 calories (cal). In nutrition, the "Calories" listed on food labels are actually kilocalories. So when a food label says 200 Calories, it means 200 kilocalories or 200,000 calories in the physics sense.',
      },
      {
        question: 'How do I convert kWh to joules?',
        answer: 'Multiply kilowatt-hours by 3,600,000 to get joules. One kWh equals 3.6 megajoules (MJ). Kilowatt-hours are the standard billing unit for electricity worldwide, while joules are the SI unit of energy used in scientific calculations.',
      },
    ],
    article: [
      {
        heading: 'Understanding Energy Units',
        paragraphs: [
          'Energy is measured in many different units across various fields. The joule is the SI unit, but kilowatt-hours dominate electricity billing, calories are used in nutrition, and BTU (British Thermal Units) are common in heating and cooling specifications. Understanding the relationships between these units helps in energy efficiency analysis and cost comparison.',
          'In nutrition, kilocalories (often labeled simply as "Calories" with a capital C) measure the energy content of food. In electricity, one kilowatt-hour represents the energy consumed by a 1,000-watt appliance running for one hour. In HVAC systems, BTU measures heating and cooling capacity.',
        ],
      },
    ],
  },

  radiation: {
    slug: 'radiation',
    title: 'Radiation',
    pageTitle: 'Radiation Unit Converter - Sievert, Rem, Gray, Rad, Roentgen | CalcPick',
    description: 'Free online radiation dose converter. Convert between sieverts, millisieverts, microsieverts, rem, millirem, grays, rads, and roentgens.',
    h1: 'Radiation Dose Converter',
    subtitle: 'Convert between radiation dose and exposure units',
    faqs: [
      {
        question: 'What is the difference between sieverts and grays?',
        answer: 'The gray (Gy) measures absorbed radiation dose — the amount of energy deposited per kilogram of tissue. The sievert (Sv) measures equivalent dose, which accounts for the biological effectiveness of different radiation types. For X-rays and gamma rays, 1 Gy equals 1 Sv, but for alpha particles, 1 Gy equals 20 Sv because alpha radiation causes more biological damage.',
      },
      {
        question: 'How do sieverts relate to rem?',
        answer: 'One sievert equals exactly 100 rem. The rem (Roentgen Equivalent Man) is the older unit still commonly used in the United States, while the sievert is the SI unit used internationally. Typical annual background radiation exposure is about 2-3 mSv (200-300 mrem).',
      },
      {
        question: 'What is a safe radiation dose?',
        answer: 'The average person receives about 2-3 millisieverts (mSv) per year from natural background radiation. A chest X-ray delivers about 0.02 mSv, while a CT scan can deliver 5-10 mSv. Occupational dose limits are typically 20 mSv per year for radiation workers. Acute doses above 1 Sv (1,000 mSv) can cause radiation sickness.',
      },
      {
        question: 'What is a roentgen?',
        answer: 'The roentgen (R) measures radiation exposure — specifically the amount of ionization produced in air by X-rays or gamma rays. It is an older unit being replaced by the coulomb per kilogram in SI units. One roentgen of X-ray exposure produces approximately 8.77 milligrays of absorbed dose in soft tissue.',
      },
    ],
    article: [
      {
        heading: 'Understanding Radiation Measurement Units',
        paragraphs: [
          'Radiation measurement involves several related but distinct quantities: exposure (roentgen), absorbed dose (gray/rad), and equivalent dose (sievert/rem). Each measures a different aspect of radiation interaction with matter. The older CGS units (rad, rem, roentgen) are being replaced by SI units (gray, sievert) but remain in common use, especially in the United States.',
          'The sievert is the most practical unit for radiation protection because it accounts for the biological impact of different radiation types. Medical imaging, nuclear industry workers, and environmental monitoring all use sieverts or millisieverts to assess radiation risk. Understanding these units is critical for healthcare professionals, nuclear engineers, and radiation safety officers.',
        ],
      },
      {
        heading: 'Radiation Dose in Context',
        paragraphs: [
          'Natural background radiation exposes the average person to approximately 2-3 mSv per year, coming from cosmic rays, radon gas, and naturally occurring radioactive materials. Medical procedures add to this: a dental X-ray delivers about 0.005 mSv, while a full-body CT scan can deliver 10-20 mSv.',
          'In the nuclear industry, annual occupational dose limits are typically 20 mSv per year (averaged over 5 years) for classified workers. For the general public, the limit is 1 mSv per year above background. These limits are set by international bodies like the ICRP (International Commission on Radiological Protection) and enforced by national regulatory authorities.',
        ],
      },
    ],
  },

  frequency: {
    slug: 'frequency',
    title: 'Frequency',
    pageTitle: 'Frequency Unit Converter - Hz, kHz, MHz, GHz, RPM | CalcPick',
    description: 'Free online frequency converter. Convert between hertz, kilohertz, megahertz, gigahertz, and RPM instantly.',
    h1: 'Frequency Unit Converter',
    subtitle: 'Convert between frequency and rotation units',
    faqs: [
      {
        question: 'What is the difference between Hz and RPM?',
        answer: 'Hertz (Hz) measures cycles per second, while RPM (revolutions per minute) measures rotations per minute. To convert RPM to Hz, divide by 60. For example, a motor spinning at 3,600 RPM is rotating at 60 Hz. Both measure periodic phenomena but on different time scales.',
      },
      {
        question: 'What frequencies are used in WiFi?',
        answer: 'WiFi commonly operates at 2.4 GHz and 5 GHz frequency bands. The newer WiFi 6E standard also uses the 6 GHz band. Higher frequencies generally offer faster data transfer speeds but shorter range, while lower frequencies provide better range and wall penetration.',
      },
    ],
    article: [
      {
        heading: 'Understanding Frequency Measurements',
        paragraphs: [
          'Frequency measures how often a repeating event occurs per unit of time. The hertz (Hz) is the SI unit, representing one cycle per second. Frequency is fundamental to electronics, telecommunications, music, and mechanical engineering. Radio stations broadcast at megahertz (MHz) frequencies, while processors operate at gigahertz (GHz) speeds.',
          'In mechanical contexts, RPM (revolutions per minute) is preferred for describing engine speeds, motor rotation, and centrifuge operation. Converting between Hz and RPM is straightforward: multiply Hz by 60 to get RPM, or divide RPM by 60 to get Hz.',
        ],
      },
    ],
  },

  power: {
    slug: 'power',
    title: 'Power',
    pageTitle: 'Power Unit Converter - Watts, Kilowatts, Horsepower, BTU/h | CalcPick',
    description: 'Free online power converter. Convert between watts, kilowatts, megawatts, horsepower, and BTU per hour.',
    h1: 'Power Unit Converter',
    subtitle: 'Convert between power and energy rate units',
    faqs: [
      {
        question: 'How many watts are in one horsepower?',
        answer: 'One mechanical horsepower equals approximately 745.7 watts or 0.7457 kilowatts. This conversion is commonly needed when comparing electric motor specifications with engine ratings. A 100 HP engine produces about 74.57 kW of power.',
      },
      {
        question: 'What is the difference between watts and kilowatt-hours?',
        answer: 'Watts measure power (the rate of energy transfer), while kilowatt-hours measure energy (the total amount transferred over time). A 100-watt light bulb running for 10 hours consumes 1 kilowatt-hour (kWh) of energy. Your electricity bill charges for kWh consumed, not watts.',
      },
    ],
    article: [
      {
        heading: 'Understanding Power Measurements',
        paragraphs: [
          'Power is the rate at which energy is transferred or converted. The watt (W) is the SI unit, with kilowatts (kW) and megawatts (MW) used for larger quantities. Horsepower remains common for rating engines and motors, especially in the automotive industry. BTU per hour is used in HVAC systems for heating and cooling capacity.',
          'Understanding power units helps when comparing appliance efficiency, sizing electrical systems, choosing HVAC equipment, or evaluating vehicle performance. For example, knowing that 1 HP equals about 746 watts helps when converting between electric motor and combustion engine specifications.',
        ],
      },
    ],
  },

  angle: {
    slug: 'angle',
    title: 'Angle',
    pageTitle: 'Angle Unit Converter - Degrees, Radians, Gradians | CalcPick',
    description: 'Free online angle converter. Convert between degrees, radians, gradians, arcminutes, arcseconds, and turns.',
    h1: 'Angle Unit Converter',
    subtitle: 'Convert between angular measurement units',
    faqs: [
      {
        question: 'How do I convert degrees to radians?',
        answer: 'Multiply degrees by π/180 (approximately 0.01745) to get radians. For example, 180° = π radians ≈ 3.14159 radians, and 90° = π/2 radians ≈ 1.5708 radians. Radians are the standard unit in mathematics and physics, while degrees are more intuitive for everyday use.',
      },
      {
        question: 'What is a gradian?',
        answer: 'A gradian (also called a gon or grad) divides a right angle into 100 parts, making a full circle 400 gradians. This system is used primarily in surveying and civil engineering in some European countries because it simplifies percentage-of-slope calculations.',
      },
    ],
    article: [
      {
        heading: 'Understanding Angular Measurements',
        paragraphs: [
          'Angles can be measured in several systems. Degrees divide a full rotation into 360 parts, radians relate arc length to radius (a full circle is 2π radians), and gradians divide a right angle into 100 parts. Each system has its advantages depending on the application.',
          'In programming and scientific computing, most math functions expect angles in radians. Navigation and everyday use prefer degrees. Surveying sometimes uses gradians. Arcminutes and arcseconds provide finer divisions of degrees, essential in astronomy, navigation, and precision engineering.',
        ],
      },
    ],
  },

  force: {
    slug: 'force',
    title: 'Force',
    pageTitle: 'Force Unit Converter - Newtons, Pound-force, Kilogram-force, Dynes | CalcPick',
    description: 'Free online force converter. Convert between newtons, kilonewtons, pound-force, kilogram-force, and dynes.',
    h1: 'Force Unit Converter',
    subtitle: 'Convert between force measurement units',
    faqs: [
      {
        question: 'What is a Newton?',
        answer: 'A Newton (N) is the SI unit of force, defined as the force needed to accelerate one kilogram of mass at one meter per second squared (1 N = 1 kg·m/s²). It is named after Sir Isaac Newton. The weight of a medium apple is approximately 1 Newton.',
      },
      {
        question: 'How do I convert kilogram-force to Newtons?',
        answer: 'Multiply kilogram-force (kgf) by 9.80665 to get Newtons. One kgf is the force exerted by one kilogram of mass under standard gravity. For example, a 70 kg person exerts approximately 686.5 N of force on the ground due to gravity.',
      },
    ],
    article: [
      {
        heading: 'Understanding Force Units',
        paragraphs: [
          'Force is a fundamental physical quantity measured in various units across different disciplines. The Newton is the SI standard, but pound-force (lbf) is widely used in American engineering, and kilogram-force (kgf) appears in some older specifications and everyday language. The dyne is a CGS unit occasionally found in scientific literature.',
          'In structural engineering, forces are often expressed in kilonewtons (kN) for building loads and material strengths. In aerospace, both Newtons and pound-force are commonly used. Understanding these conversions is essential for engineers working with international specifications and standards.',
        ],
      },
    ],
  },

  data_rate: {
    slug: 'data_rate',
    title: 'Data Rate',
    pageTitle: 'Data Rate Converter - Mbps, Gbps, MB/s, Kbps | CalcPick',
    description: 'Free online data transfer rate converter. Convert between bits per second, kilobits, megabits, gigabits, bytes per second, and megabytes per second.',
    h1: 'Data Transfer Rate Converter',
    subtitle: 'Convert between network and data transfer speed units',
    faqs: [
      {
        question: 'What is the difference between Mbps and MB/s?',
        answer: 'Mbps (megabits per second) and MB/s (megabytes per second) differ by a factor of 8, since 1 byte = 8 bits. So 100 Mbps equals 12.5 MB/s. Internet service providers advertise speeds in Mbps, while file downloads often show progress in MB/s, which can cause confusion.',
      },
      {
        question: 'How fast is gigabit internet?',
        answer: '1 Gbps (gigabit per second) equals 1,000 Mbps or 125 MB/s. At this speed, you could theoretically download a 5 GB movie in about 40 seconds. In practice, actual speeds are lower due to network overhead, but gigabit connections are among the fastest available to consumers.',
      },
    ],
    article: [
      {
        heading: 'Understanding Data Transfer Rates',
        paragraphs: [
          'Data transfer rates measure how fast information moves between devices or across networks. The key distinction is between bits and bytes: network speeds are typically measured in bits per second (bps), while file sizes and storage transfers use bytes per second. Since 1 byte equals 8 bits, dividing your network speed in Mbps by 8 gives you the theoretical download speed in MB/s.',
          'Common internet speeds include 100 Mbps (12.5 MB/s), 500 Mbps (62.5 MB/s), and 1 Gbps (125 MB/s). Understanding these conversions helps when evaluating internet service plans, troubleshooting slow downloads, or planning network infrastructure.',
        ],
      },
    ],
  },

  fuel_economy: {
    slug: 'fuel_economy',
    title: 'Fuel Economy',
    pageTitle: 'Fuel Economy Converter - MPG, km/L, L/100km | CalcPick',
    description: 'Free online fuel economy converter. Convert between miles per gallon (US/UK), kilometers per liter, and liters per 100 kilometers.',
    h1: 'Fuel Economy Converter',
    subtitle: 'Convert between fuel efficiency measurement units',
    faqs: [
      {
        question: 'How do I convert MPG to L/100km?',
        answer: 'Divide 235.215 by the MPG (US) value to get L/100km. For example, 30 MPG equals approximately 7.84 L/100km. Note that higher MPG means better fuel economy, while lower L/100km means better fuel economy — the scales are inversely related.',
      },
      {
        question: 'What is the difference between US MPG and UK MPG?',
        answer: 'US and UK gallons have different sizes: one US gallon equals 3.785 liters, while one UK (imperial) gallon equals 4.546 liters. This means the same car will have a higher MPG number when measured in UK gallons. For example, 30 US MPG equals approximately 36 UK MPG.',
      },
    ],
    article: [
      {
        heading: 'Understanding Fuel Economy Measurements',
        paragraphs: [
          'Fuel economy is measured differently around the world. The United States uses miles per gallon (MPG), most of Europe and many other countries use liters per 100 kilometers (L/100km), and some Asian countries use kilometers per liter (km/L). These systems are not directly proportional — MPG and km/L measure distance per unit of fuel, while L/100km measures fuel per unit of distance.',
          'This inverse relationship means converting between them requires division rather than simple multiplication. A fuel-efficient car might achieve 40 MPG (US), which equals approximately 5.88 L/100km or 17.01 km/L. Understanding these conversions helps when comparing vehicles across different markets or reading international automotive reviews.',
        ],
      },
    ],
  },
};

const COUNTRY_MAP: Record<string, string> = {
  afghanistan: 'AF', albania: 'AL', algeria: 'DZ', angola: 'AO',
  argentina: 'AR', australia: 'AU', austria: 'AT', bangladesh: 'BD',
  belgium: 'BE', benin: 'BJ', botswana: 'BW', brazil: 'BR',
  'burkina faso': 'BF', burundi: 'BI', cameroon: 'CM', canada: 'CA',
  'cape verde': 'CV', 'central african republic': 'CF', chad: 'TD',
  china: 'CN', colombia: 'CO', comoros: 'KM', congo: 'CG',
  "cote d'ivoire": 'CI', 'dr congo': 'CD', denmark: 'DK',
  djibouti: 'DJ', egypt: 'EG', eritrea: 'ER', eswatini: 'SZ',
  ethiopia: 'ET', finland: 'FI', france: 'FR', gabon: 'GA',
  gambia: 'GM', germany: 'DE', ghana: 'GH', greece: 'GR',
  'guinea-bissau': 'GW', india: 'IN', indonesia: 'ID', iran: 'IR',
  iraq: 'IQ', ireland: 'IE', israel: 'IL', italy: 'IT', japan: 'JP',
  kenya: 'KE', lesotho: 'LS', liberia: 'LR', libya: 'LY',
  madagascar: 'MG', malawi: 'MW', malaysia: 'MY', mali: 'ML',
  mauritania: 'MR', mauritius: 'MU', mexico: 'MX', morocco: 'MA',
  mozambique: 'MZ', namibia: 'NA', nepal: 'NP', netherlands: 'NL',
  'new zealand': 'NZ', niger: 'NE', nigeria: 'NG', norway: 'NO',
  pakistan: 'PK', peru: 'PE', philippines: 'PH', poland: 'PL',
  portugal: 'PT', 'republic of the congo': 'CG', romania: 'RO',
  russia: 'RU', rwanda: 'RW', 'saudi arabia': 'SA',
  'sao tome and principe': 'ST', senegal: 'SN', seychelles: 'SC',
  'sierra leone': 'SL', somalia: 'SO', 'south africa': 'ZA',
  'south korea': 'KR', 'south sudan': 'SS', spain: 'ES',
  sudan: 'SD', sweden: 'SE', switzerland: 'CH', tanzania: 'TZ',
  thailand: 'TH', togo: 'TG', turkey: 'TR', tunisia: 'TN',
  uganda: 'UG', ukraine: 'UA', 'united kingdom': 'GB',
  'united states': 'US', vietnam: 'VN', 'western sahara': 'EH',
  zambia: 'ZM', zimbabwe: 'ZW',
};

export interface ParsedQuery {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
}

export function parseNaturalQuery(query: string): ParsedQuery | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const result: ParsedQuery = {};
  let matched = false;

  const hasMale = /\bmales?\b/.test(q);
  const hasFemale = /\bfemales?\b/.test(q);

  if (hasMale && hasFemale) {
    // "male and female teenagers" → skip gender, keep other filters
    matched = true;
  } else if (hasMale) {
    result.gender = 'male';
    matched = true;
  } else if (hasFemale) {
    result.gender = 'female';
    matched = true;
  }

  // AGE GROUPS
  if (/\badults?\b/.test(q)) {
    result.age_group = 'adult'; matched = true;
  } else if (/\bteenagers?\b|\bteens?\b/.test(q)) {
    result.age_group = 'teenager'; matched = true;
  } else if (/\bseniors?\b|\belderly\b/.test(q)) {
    result.age_group = 'senior'; matched = true;
  } else if (/\bchildren\b|\bchild\b|\bkids?\b/.test(q)) {
    result.age_group = 'child'; matched = true;
  }

  
  //Age Ranges
  if (/\byoung\b/.test(q)) {
    result.min_age = 16; result.max_age = 24; matched = true;
  }
  const aboveMatch = q.match(/\b(?:above|over|older than)\s+(\d+)\b/);
  if (aboveMatch) { result.min_age = parseInt(aboveMatch[1]); matched = true; }

  const belowMatch = q.match(/\b(?:below|under|younger than)\s+(\d+)\b/);
  if (belowMatch) { result.max_age = parseInt(belowMatch[1]); matched = true; }

  const betweenMatch = q.match(/\bbetween\s+(\d+)\s+and\s+(\d+)\b/);
  if (betweenMatch) {
    result.min_age = parseInt(betweenMatch[1]);
    result.max_age = parseInt(betweenMatch[2]);
    matched = true;
  }


  const sorted = Object.keys(COUNTRY_MAP).sort((a, b) => b.length - a.length);
  for (const country of sorted) {
    if (q.includes(country)) {
      result.country_id = COUNTRY_MAP[country];
      matched = true;
      break;
    }
  }

  return matched ? result : null;
}

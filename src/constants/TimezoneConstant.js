/**
 * Timezone Constants
 * All available timezones organized by GMT offset
 */

export const TIMEZONES = [
  // GMT-12 to GMT-9
  { label: '(GMT-12) Baker Island', value: 'GMT-12' },
  { label: '(GMT-11) American Samoa, Niue', value: 'GMT-11' },
  { label: '(GMT-10) Hawaii, Cook Islands', value: 'GMT-10' },
  { label: '(GMT-9) Alaska, Marquesas Islands', value: 'GMT-9' },
  
  // GMT-8 to GMT-5
  { label: '(GMT-8) Los Angeles, Vancouver, Tijuana', value: 'GMT-8' },
  { label: '(GMT-7) Denver, Phoenix, Calgary', value: 'GMT-7' },
  { label: '(GMT-6) Chicago, Mexico City, Guatemala', value: 'GMT-6' },
  { label: '(GMT-5) New York, Toronto, Lima', value: 'GMT-5' },
  
  // GMT-4 to GMT-1
  { label: '(GMT-4) La Paz, Santiago, Atlanta', value: 'GMT-4' },
  { label: '(GMT-3) Brasília, Buenos Aires, Greenland', value: 'GMT-3' },
  { label: '(GMT-2) Mid-Atlantic, Newfoundland', value: 'GMT-2' },
  { label: '(GMT-1) Azores, Cape Verde', value: 'GMT-1' },
  
  // GMT/UTC
  { label: '(GMT+0/UTC) London, Dublin, Lisbon, Casablanca', value: 'GMT+0' },
  
  // GMT+1 to GMT+4
  { label: '(GMT+1) Paris, Berlin, Rome, Madrid', value: 'GMT+1' },
  { label: '(GMT+2) Cairo, Athens, Istanbul, Helsinki', value: 'GMT+2' },
  { label: '(GMT+3) Istanbul, Kirov, Minsk, Moscow, Simferopol, and Volgograd', value: 'GMT+3' },
  { label: '(GMT+3.5) Tehran', value: 'GMT+3.5' },
  { label: '(GMT+4) Amman, Baghdad, Damascus, Qatar, and Riyadh', value: 'GMT+4' },
  
  // GMT+4.5 to GMT+5.5
  { label: '(GMT+4.5) Kabul', value: 'GMT+4.5' },
  { label: '(GMT+5) Baku, Dubai, Tbilisi, Ekaterinburg', value: 'GMT+5' },
  { label: '(GMT+5.5) India Standard Time, Sri Lanka', value: 'GMT+5.5' },
  
  // GMT+6 to GMT+8
  { label: '(GMT+6) Almaty, Astrakhan, Samara, Saratov, and Ulyanovsk', value: 'GMT+6' },
  { label: '(GMT+6.5) Myanmar', value: 'GMT+6.5' },
  { label: '(GMT+7) Bangkok, Hanoi, Jakarta, Ho Chi Minh City', value: 'GMT+7' },
  { label: '(GMT+8) Beijing, Hong Kong, Manila, Singapore, Taipei', value: 'GMT+8' },
  
  // GMT+9 to GMT+12
  { label: '(GMT+9) Tokyo, Seoul, Pyongyang, Osaka', value: 'GMT+9' },
  { label: '(GMT+9.5) Adelaide, Darwin', value: 'GMT+9.5' },
  { label: '(GMT+10) Brisbane, Canberra, Melbourne, Sydney', value: 'GMT+10' },
  { label: '(GMT+11) Honiara, Kosrae, Noumea, Ponape', value: 'GMT+11' },
  { label: '(GMT+12) Fiji, Nauru, Palau, Kiribati', value: 'GMT+12' },
];

/**
 * Get timezone by value
 */
export const getTimezoneLabel = (value) => {
  const tz = TIMEZONES.find(t => t.value === value);
  return tz ? tz.label : value;
};

/**
 * Timezone groups for better organization
 */
export const TIMEZONE_GROUPS = {
  'Western Hemisphere': TIMEZONES.filter(tz => {
    const val = tz.value;
    return val.includes('-') || val === 'GMT+0';
  }),
  'Europe & Africa': TIMEZONES.filter(tz => {
    const val = tz.value;
    return (parseInt(val.replace('GMT', '')) >= 0 && parseInt(val.replace('GMT', '')) <= 2) || val === 'GMT+0';
  }),
  'Middle East & Asia': TIMEZONES.filter(tz => {
    const val = tz.value;
    const num = parseFloat(val.replace('GMT+', '').replace('GMT', ''));
    return num > 2 && num <= 8;
  }),
  'Asia Pacific': TIMEZONES.filter(tz => {
    const val = tz.value;
    const num = parseFloat(val.replace('GMT+', ''));
    return num > 8;
  }),
};

export default TIMEZONES;

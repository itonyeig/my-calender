import axios from 'axios';
import { Holiday } from '../interfaces/Holiday';

const HOLIDAY_API_URL = 'https://date.nager.at/Api/v2/PublicHolidays';

const groupHolidaysByDate = (holidays: Holiday[]): Holiday[] => {
    // Create a map to record one occurrence of each holiday by date
    const uniqueHolidays = new Map<string, Holiday>();
  
    holidays.forEach(holiday => {
      // Use the holiday's name and date to create a unique key
      const uniqueKey = `${holiday.date}-${holiday.name}`;
  
      if (!uniqueHolidays.has(uniqueKey)) {
        uniqueHolidays.set(uniqueKey, holiday);
      }
    });
  
    // Convert the map values back to an array
    return Array.from(uniqueHolidays.values());
  };

const fetchHolidaysForCountry = async (year: number, countryCode: string): Promise<Holiday[]> => {
  const url = `${HOLIDAY_API_URL}/${year}/${countryCode}`;
  try {
    const response = await axios.get(url);
    return response.data as Holiday[];
  } catch (error) {
    console.error("Error fetching holidays for country: ", countryCode, error);
    return [];
  }
};

const fetchWorldwideHolidays = async (year: number): Promise<Holiday[]> => {
    try {
        const cacheKey = `worldwideHolidays_${year}`;
  
    // Try to get cached holidays first
    const storedHolidays = localStorage.getItem(cacheKey);
    if (storedHolidays) {
      return JSON.parse(storedHolidays) as Holiday[];
    }
  
    // Fetch holidays for all available countries
    const availableCountriesResponse = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    const availableCountries = availableCountriesResponse.data as { countryCode: string; name: string }[];
  
    const promises = availableCountries.map(country => fetchHolidaysForCountry(year, country.countryCode));
    const holidayArrays = await Promise.all(promises);
    const allHolidays = holidayArrays.flat();
  
    // Group holidays by date and local name to remove duplicates
    const uniqueHolidays = groupHolidaysByDate(allHolidays);
  
    // Cache the grouped results in local storage with the year as part of the key
    localStorage.setItem(cacheKey, JSON.stringify(uniqueHolidays));
  
    return uniqueHolidays;
    } catch (error) {
        return []
    }
  };
  

export default fetchWorldwideHolidays;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('../models/Country');
const Favorite = require('../models/Favorite');

// Load env vars
dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/country_explorer';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collection records
    await Country.deleteMany({});
    await Favorite.deleteMany({});
    console.log('Cleared existing Countries and Favorites.');

    console.log('Fetching live country data from REST Countries API (Part 1 & Part 2)...');
    
    // We fetch in two parts because the API restricts responses to at most 10 fields per query on `/all`
    const [res1, res2] = await Promise.all([
      fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flag,flags,capital,population,region,subregion,languages'),
      fetch('https://restcountries.com/v3.1/all?fields=cca3,currencies,borders,area')
    ]);

    if (!res1.ok || !res2.ok) {
      throw new Error(`Failed to fetch country data from one of the API endpoints.`);
    }

    const list1 = await res1.json();
    const list2 = await res2.json();

    console.log(`Fetched ${list1.length} country profiles. Merging datasets...`);

    // Map list2 by cca3 for fast lookups
    const list2Map = new Map(list2.map(item => [item.cca3, item]));

    const processedCountries = list1.map(item => {
      // Find matching item from part 2
      const details = list2Map.get(item.cca3) || {};

      // Extract capital
      const capital = item.capital && item.capital.length > 0 ? item.capital[0] : "";
      
      // Parse languages
      const languages = item.languages ? Object.values(item.languages) : [];
      
      // Parse currencies
      const currencies = [];
      if (details.currencies) {
        for (const [code, currDetails] of Object.entries(details.currencies)) {
          currencies.push({
            code: code,
            name: currDetails.name || "",
            symbol: currDetails.symbol || ""
          });
        }
      }

      // Generate a clean, permanent Google Maps search URL (avoiding deprecated/broken goo.gl shortlinks)
      const mapsGoogle = `https://www.google.com/maps/place/${encodeURIComponent(item.name.common)}`;

      // Generate a dynamic, premium description
      const officialNameStr = item.name.official && item.name.official !== item.name.common 
        ? `, officially known as the ${item.name.official},` 
        : "";
      const capitalStr = capital ? ` The capital city is ${capital}.` : "";
      const subregionStr = item.subregion || item.region || "Unknown";
      const areaVal = details.area || 0;
      
      const description = `${item.name.common}${officialNameStr} is a sovereign nation located in the ${subregionStr} region. It has a population of approximately ${item.population.toLocaleString()} people and covers an area of ${areaVal ? areaVal.toLocaleString() : 'N/A'} km².${capitalStr}`;

      return {
        name: item.name.common,
        officialName: item.name.official || item.name.common,
        cca2: item.cca2,
        cca3: item.cca3,
        flag: item.flag || "🏳️",
        flagSvg: item.flags && item.flags.svg ? item.flags.svg : "https://flagcdn.com/un.svg",
        capital: capital,
        population: item.population || 0,
        region: item.region || "Unknown",
        subregion: item.subregion || "",
        languages: languages,
        currencies: currencies,
        borders: details.borders || [],
        area: areaVal,
        mapsGoogle: mapsGoogle,
        description: description
      };
    });

    // Remove duplicates based on cca3 and name (just in case)
    const uniqueCountriesMap = new Map();
    processedCountries.forEach(c => {
      if (c.cca3 && c.name) {
        uniqueCountriesMap.set(c.cca3, c);
      }
    });
    const uniqueCountries = Array.from(uniqueCountriesMap.values());

    console.log(`Inserting ${uniqueCountries.length} countries into MongoDB...`);
    const createdCountries = await Country.insertMany(uniqueCountries);
    console.log(`Successfully seeded ${createdCountries.length} countries from REST Countries API!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

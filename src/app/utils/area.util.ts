import { city_data } from './area.data';

export const getProvinces = () => {
  const provices = [];
  for (const province of Object.keys(city_data)) {
    provices.push(province);
  }
  return provices;
};

export const getCitiesByProvince = (province: string) => {
  if (!province || !city_data[province]) {
    return [];
  }
  const cities = [];
  const val = city_data[province];
  for (const city of Object.keys(val)) {
    cities.push(city);
  }
  return cities;
};

export const getAreaByCity = (province: string, city: string) => {
  if (!province || !city_data[province] || !city_data[province][city]) {
    return [];
  }
  return city_data[province][city];
};

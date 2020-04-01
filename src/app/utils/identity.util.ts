import { GB2260 } from './identity.data';

export const extractInfo = (idNo: string) => {
  const addrPart = idNo.substring(0, 6);
  const birthPart = idNo.substring(6, 10) + '-' + idNo.substring(10, 12) + '-' + idNo.substring(12, 14) + ' 00:00:00';
  return {
    addrCode: addrPart,
    dateOfBirth: birthPart
  };
};

export const isValidAddr = (addr: string) => {
  return GB2260[addr] !== undefined;
};

export const getAddrByCode = (code: string) => {
  const province = GB2260[code.substring(0, 2) + '0000'];
  const city = GB2260[code.substring(0, 4) + '00'].replace(province, '');
  const district = GB2260[code].replace(province + city, '');
  return {
    province,
    city,
    district
  };
};

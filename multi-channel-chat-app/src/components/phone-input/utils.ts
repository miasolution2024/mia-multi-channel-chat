/* eslint-disable @typescript-eslint/no-explicit-any */
import { countries } from "@/assets/data";
import { parsePhoneNumber } from "react-phone-number-input";

// ----------------------------------------------------------------------

export function getCountryCode(inputValue: any, countryCode: string) {
  if (inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);

    if (phoneNumber) {
      return phoneNumber?.country;
    }
  }

  return countryCode ?? "US";
}

// ----------------------------------------------------------------------

export function getCountry(countryCode: string) {
  const option = countries.filter((country) => country.code === countryCode)[0];
  return option;
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, query }: any) {
  if (!query) return inputData;

  const lowerCaseQuery = query.toLowerCase();

  return inputData.filter(({ label, code, phone }: any) =>
    [label, code, phone].some((field) =>
      field.toLowerCase().includes(lowerCaseQuery)
    )
  );
}

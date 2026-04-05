import Papa from 'papaparse';
import { StockRecord, CrisisRecord } from '../types/dashboard';

export async function fetchStockData(url: string): Promise<StockRecord[]> {
  try {
    const timestampedUrl = `${url}&t=${new Date().getTime()}`;
    const response = await fetch(timestampedUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const summaryLabels = ['domestic', 'commercial', 'industrial', 'total', 'segment', 'summary'];

    return (result.data as Record<string, string | number>[])
      .map((row) => {
        const getVal = (keys: string[]) => {
          const foundKey = Object.keys(row).find(k =>
            keys.some(target => k.trim().toLowerCase().includes(target.toLowerCase()))
          );
          return foundKey ? row[foundKey] : undefined;
        };

        return {
          Date: String(getVal(['Last Available Date', 'Date']) || ''),
          AgencyName: String(getVal(['Agency Name']) || '').trim(),
          DomesticClosingStock: Number(getVal(['Domestic Closing', 'Closing Stock (14.2 KG)'])) || 0,
          DomesticBacklog: Number(getVal(['Domestic Backlog', 'Backlog of Cylinders (14.2 KG)'])) || 0,
          CommercialClosingStock: Number(getVal(['Commercial Closing', 'Closing Stock (19 KG)'])) || 0,
          IndustrialClosingStock47_5: Number(getVal(['47.5KG Closing', 'Closing Stock (47.5 KG)'])) || 0,
          IndustrialClosingStock425: Number(getVal(['425KG Closing', 'Closing Stock (425 KG)'])) || 0,
        };
      })
      .filter(record =>
        record.AgencyName &&
        !summaryLabels.includes(record.AgencyName.toLowerCase()) &&
        record.Date
      );
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

export async function fetchCrisisData(url: string): Promise<CrisisRecord[]> {
  try {
    const timestampedUrl = `${url}&t=${new Date().getTime()}`;
    const response = await fetch(timestampedUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return (result.data as Record<string, string>[])
      .map((row) => {
        const getVal = (keys: string[]) => {
          const foundKey = Object.keys(row).find(k =>
            keys.some(target => k.trim().toLowerCase().includes(target.toLowerCase()))
          );
          return foundKey ? row[foundKey] : undefined;
        };

        return {
          RequestID: String(getVal(['Request ID']) || ''),
          ConsumerName: String(getVal(['Consumer Name']) || ''),
          Category: String(getVal(['Category']) || ''),
          AgencyName: String(getVal(['Agency Name']) || ''),
          Issue: String(getVal(['Issue']) || ''),
          CurrentStatus: String(getVal(['Current Status']) || ''),
        };
      })
      .filter(record => record.RequestID || record.AgencyName);
  } catch (error) {
    console.error('Error fetching crisis data:', error);
    return [];
  }
}

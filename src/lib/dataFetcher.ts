import Papa from 'papaparse';
import { StockRecord, CrisisRecord } from '../types/dashboard';

export async function fetchStockData(url: string): Promise<StockRecord[]> {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    return (result.data as Record<string, string | number>[]).map((row) => ({
      Date: String(row['Date']),
      AgencyName: String(row['Agency Name']),
      DomesticClosingStock: Number(row['Closing Stock (14.2 KG)']) || 0,
      DomesticBacklog: Number(row['Backlog of Cylinders (14.2 KG)']) || 0,
      CommercialClosingStock: Number(row['Closing Stock (19 KG)']) || 0,
      IndustrialClosingStock47_5: Number(row['Closing Stock (47.5 KG)']) || 0,
      IndustrialClosingStock425: Number(row['Closing Stock (425 KG)']) || 0,
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

export async function fetchCrisisData(url: string): Promise<CrisisRecord[]> {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return (result.data as Record<string, string>[]).map((row) => ({
      RequestID: row['Request ID'],
      ConsumerName: row['Consumer Name'],
      Category: row['Category'],
      AgencyName: row['Agency Name'],
      Issue: row['Issue'],
      CurrentStatus: row['Current Status'],
    }));
  } catch (error) {
    console.error('Error fetching crisis data:', error);
    return [];
  }
}

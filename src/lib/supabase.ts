import { createClient } from '@supabase/supabase-js';
import type { Region, LandPlot } from '@/types';

const supabaseUrl = 'https://bxxehorsyeuztthyxrwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eGVob3JzeWV1enR0aHl4cndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjI5NjUsImV4cCI6MjA5ODI5ODk2NX0.5QNfF5i1m9b0RUG__2J8xKiuob9HDQPihNLbpRgdbGo';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase.from('regions').select('*');
  if (error) throw error;
  return data || [];
}

export async function fetchRegionById(id: number): Promise<Region | null> {
  const { data, error } = await supabase.from('regions').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function fetchLandPlotsByRegion(regionId: number): Promise<LandPlot[]> {
  const { data, error } = await supabase.from('land_plots').select('*').eq('region_id', regionId);
  if (error) throw error;
  return data || [];
}

export async function fetchLandPlotById(id: number): Promise<LandPlot | null> {
  const { data, error } = await supabase.from('land_plots').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

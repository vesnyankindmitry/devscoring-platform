export type Segment = 'economy' | 'comfort' | 'business';

export interface Region {
  id: number;
  name: string;
  region_code: string;
  federal_district: string;
  city_type: string;
  population_thousands: number;
  population_growth_3yr_percent: number;
  migration_saldo: number;
  working_age_population_percent: number;
  avg_monthly_salary_rub: number;
  salary_growth_2yr_percent: number;
  unemployment_percent: number;
  grp_per_capita_thousands: number;
  housing_supply_per_capita: number;
  housing_deficit_percent: number;
  avg_price_per_sqm_economy: number;
  avg_price_per_sqm_comfort: number;
  avg_price_per_sqm_business: number;
  price_dynamics_yoy_percent: number;
  mortgage_volume_per_capita: number;
  mortgage_rate_percent: number;
  mortgage_programs_count: number;
  active_developers_count: number;
  federal_developers_share_percent: number;
  market_concentration: number;
  transport_infrastructure: number;
  city_development_plan: number;
  social_infrastructure: number;
  admin_cooperation_level: number;
  support_mechanisms_count: number;
  permit_procedure_months: number;
  business_culture_level: number;
  ecology_level: number;
  score_economy: number;
  score_comfort: number;
  score_business: number;
  lat: number;
  lng: number;
}

export interface LandPlot {
  id: number;
  region_id: number;
  cadastral_number: string;
  address: string;
  distance_from_center_km: number;
  transport_accessibility: number;
  road_quality: number;
  development_prospects: number;
  schools_within_1_5km: number;
  kindergartens_within_1km: number;
  retail_infrastructure: number;
  medical_facilities_within_2km: number;
  parks_within_1km: number;
  electricity_supply: number;
  water_supply: number;
  heat_supply: number;
  gas_supply: number;
  area_hectares: number;
  shape_quality: number;
  terrain_geology: number;
  groundwater_level: number;
  vri_compliance: number;
  height_restrictions: number;
  legal_cleanliness: number;
  cadastral_cost_per_sqm: number;
  cadastral_to_market_ratio_percent: number;
  preparation_costs_level: number;
  nearby_avg_price_per_sqm: number;
  absorption_rate_months: number;
  competition_within_3km: number;
  ecology_level: number;
  distance_from_pollutants_meters: number;
  water_green_zones_within_1km: number;
  lat: number;
  lng: number;
  score_economy: number;
  score_comfort: number;
  score_business: number;
}

export interface BriefData {
  company_name: string;
  contact_email: string;
  current_regions: number[];
  home_region_id: number | null;
  management_center_region_id: number | null;
  construction_type: string;
  building_type: string;
  floors_count: string;
  target_segment: Segment;
  max_distance_from_home_km: number;
  preferred_districts: string[];
  min_population: number;
}

export interface ScoringResult {
  region_id: number;
  region_name: string;
  segment: Segment;
  total_score: number;
  match_score: number;
  block_scores: {
    demography: number;
    economy: number;
    housing_market: number;
    mortgage: number;
    competition: number;
    infrastructure: number;
    admin_climate: number;
    prestige: number;
  };
  region: Region;
}

import type { Region, LandPlot, Segment, ScoringResult, BriefData } from '@/types';

// ─── Individual parameter scorers (0–10) ───────────────────────────

function scorePopulation(value: number): number {
  if (value > 1000) return 10;
  if (value >= 500) return 8;
  if (value >= 250) return 6;
  if (value >= 100) return 4;
  return 2;
}

function scorePopGrowth(value: number): number {
  if (value > 5) return 10;
  if (value >= 0) return 8;
  if (value >= -2) return 6;
  if (value >= -5) return 4;
  return 2;
}

function scoreMigration(value: number): number {
  if (value > 5000) return 10;
  if (value >= 1000) return 8;
  if (value >= 0) return 6;
  if (value >= -1000) return 4;
  return 2;
}

function scoreWorkingAge(value: number): number {
  if (value > 65) return 10;
  if (value >= 60) return 8;
  if (value >= 55) return 6;
  if (value >= 50) return 4;
  return 2;
}

function scoreSalary(value: number): number {
  if (value > 100000) return 10;
  if (value >= 70000) return 8;
  if (value >= 50000) return 6;
  if (value >= 35000) return 4;
  return 2;
}

function scoreSalaryGrowth(value: number): number {
  if (value > 25) return 10;
  if (value >= 15) return 8;
  if (value >= 10) return 6;
  if (value >= 5) return 4;
  return 2;
}

function scoreUnemployment(value: number): number {
  if (value < 3) return 10;
  if (value < 4.5) return 8;
  if (value < 6) return 6;
  if (value < 8) return 4;
  return 2;
}

function scoreGRP(value: number): number {
  if (value > 800) return 10;
  if (value >= 600) return 8;
  if (value >= 400) return 6;
  if (value >= 250) return 4;
  return 2;
}

function scoreHousingSupply(value: number): number {
  if (value >= 0.3 && value <= 0.5) return 10;
  if (value >= 0.5 && value <= 0.7) return 8;
  if (value >= 0.2 && value < 0.3) return 6;
  if (value >= 0.7 && value <= 1.0) return 4;
  return 2;
}

function scoreHousingDeficit(value: number): number {
  if (value > 30) return 10;
  if (value >= 20) return 8;
  if (value >= 10) return 6;
  if (value >= 5) return 4;
  return 2;
}

function scorePriceEconomy(value: number): number {
  if (value >= 80 && value <= 120) return 10;
  if (value >= 120 && value <= 160) return 8;
  if (value >= 60 && value < 80) return 6;
  if (value >= 160 && value <= 200) return 4;
  return 2;
}

function scorePriceComfort(value: number): number {
  if (value >= 120 && value <= 180) return 10;
  if (value >= 180 && value <= 220) return 8;
  if (value >= 80 && value < 120) return 6;
  if (value >= 220 && value <= 300) return 4;
  return 2;
}

function scorePriceBusiness(value: number): number {
  if (value > 200) return 10;
  if (value >= 150) return 8;
  if (value >= 100 && value < 150) return 6;
  if (value >= 50 && value < 100) return 4;
  return 2;
}

function getPriceScore(region: Region, segment: Segment): number {
  if (segment === 'economy') return scorePriceEconomy(region.avg_price_per_sqm_economy);
  if (segment === 'comfort') return scorePriceComfort(region.avg_price_per_sqm_comfort);
  return scorePriceBusiness(region.avg_price_per_sqm_business);
}

function scorePriceDynamics(value: number): number {
  if (value >= 5 && value <= 15) return 10;
  if (value >= 0 && value < 5) return 8;
  if (value >= 15 && value <= 25) return 6;
  if (value >= -5 && value < 0) return 4;
  return 2;
}

function scoreMortgageVolume(value: number): number {
  if (value > 150) return 10;
  if (value >= 100) return 8;
  if (value >= 70) return 6;
  if (value >= 40) return 4;
  return 2;
}

function scoreMortgageRate(value: number): number {
  if (value < 6) return 10;
  if (value < 8) return 8;
  if (value < 10) return 6;
  if (value < 13) return 4;
  return 2;
}

function scoreMortgagePrograms(value: number): number {
  if (value >= 2) return 10;
  if (value >= 1) return 7;
  return 3;
}

function scoreDevCount(value: number): number {
  if (value >= 3 && value <= 7) return 10;
  if (value >= 7 && value <= 12) return 8;
  if (value >= 12 && value <= 20) return 6;
  if (value >= 1 && value <= 2) return 4;
  return 2;
}

function scoreFederalShare(value: number): number {
  if (value >= 20 && value <= 40) return 10;
  if (value >= 10 && value < 20) return 8;
  if (value >= 40 && value <= 60) return 6;
  if (value < 10) return 4;
  return 2;
}

function scoreConcentration(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  if (value === 3) return 4;
  return 2;
}

function scoreTransport(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  return 4;
}

function scoreDevPlan(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  return 3;
}

function scoreSocialInfra(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 8;
  if (value === 3) return 6;
  return 4;
}

function scoreAdminCoop(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  if (value === 3) return 4;
  return 2;
}

function scoreSupportMech(value: number): number {
  if (value >= 2) return 10;
  if (value >= 1) return 7;
  return 3;
}

function scorePermitMonths(value: number): number {
  if (value < 6) return 10;
  if (value < 12) return 8;
  if (value < 18) return 6;
  if (value < 24) return 4;
  return 2;
}

function scoreCityStatus(region: Region): number {
  if (region.city_type === 'capital') return 10;
  if (region.population_thousands > 500) return 8;
  if (region.population_thousands >= 100) return 6;
  return 4;
}

function scoreBusinessCulture(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  return 4;
}

function scoreEcology(value: number): number {
  if (value === 1) return 10;
  if (value === 2) return 7;
  return 4;
}

// ─── Weights by segment ──────────────────────────────────────────────

const W = {
  economy: {
    demography: { pop: 5, growth: 5, migr: 4, work: 4 },
    economy:    { sal: 5, sgrow: 3, unemp: 4, grp: 3 },
    housing:    { sup: 4, def: 5, price: 4, dyn: 3 },
    mortgage:   { vol: 5, rate: 4, prog: 4 },
    competition:{ dev: 3, fed: 3, conc: 2 },
    infra:      { trans: 4, plan: 3, soc: 4 },
    admin:      { coop: 4, supp: 3, perm: 3 },
    prestige:   { stat: 2, cult: 2, eco: 3 },
  },
  comfort: {
    demography: { pop: 4, growth: 4, migr: 4, work: 3 },
    economy:    { sal: 5, sgrow: 3, unemp: 3, grp: 3 },
    housing:    { sup: 4, def: 5, price: 4, dyn: 3 },
    mortgage:   { vol: 5, rate: 4, prog: 3 },
    competition:{ dev: 3, fed: 3, conc: 2 },
    infra:      { trans: 4, plan: 3, soc: 4 },
    admin:      { coop: 4, supp: 3, perm: 3 },
    prestige:   { stat: 3, cult: 3, eco: 3 },
  },
  business: {
    demography: { pop: 4, growth: 3, migr: 3, work: 3 },
    economy:    { sal: 4, sgrow: 3, unemp: 2, grp: 4 },
    housing:    { sup: 4, def: 5, price: 3, dyn: 3 },
    mortgage:   { vol: 4, rate: 3, prog: 2 },
    competition:{ dev: 3, fed: 4, conc: 2 },
    infra:      { trans: 5, plan: 3, soc: 4 },
    admin:      { coop: 4, supp: 3, perm: 3 },
    prestige:   { stat: 5, cult: 5, eco: 4 },
  },
};

// ─── Main region scorer ──────────────────────────────────────────────

export function calculateRegionScore(region: Region, segment: Segment): ScoringResult {
  const w = W[segment];

  const dPop = scorePopulation(region.population_thousands);
  const dGrow = scorePopGrowth(region.population_growth_3yr_percent);
  const dMigr = scoreMigration(region.migration_saldo);
  const dWork = scoreWorkingAge(region.working_age_population_percent);
  const dw = w.demography;
  const dwSum = dw.pop + dw.growth + dw.migr + dw.work;
  const dAvg = (dPop * dw.pop + dGrow * dw.growth + dMigr * dw.migr + dWork * dw.work) / dwSum;

  const eSal = scoreSalary(region.avg_monthly_salary_rub);
  const eSGrow = scoreSalaryGrowth(region.salary_growth_2yr_percent);
  const eUnemp = scoreUnemployment(region.unemployment_percent);
  const eGRP = scoreGRP(region.grp_per_capita_thousands);
  const ew = w.economy;
  const ewSum = ew.sal + ew.sgrow + ew.unemp + ew.grp;
  const eAvg = (eSal * ew.sal + eSGrow * ew.sgrow + eUnemp * ew.unemp + eGRP * ew.grp) / ewSum;

  const hSup = scoreHousingSupply(region.housing_supply_per_capita);
  const hDef = scoreHousingDeficit(region.housing_deficit_percent);
  const hPrice = getPriceScore(region, segment);
  const hDyn = scorePriceDynamics(region.price_dynamics_yoy_percent);
  const hw = w.housing;
  const hwSum = hw.sup + hw.def + hw.price + hw.dyn;
  const hAvg = (hSup * hw.sup + hDef * hw.def + hPrice * hw.price + hDyn * hw.dyn) / hwSum;

  const mVol = scoreMortgageVolume(region.mortgage_volume_per_capita);
  const mRate = scoreMortgageRate(region.mortgage_rate_percent);
  const mProg = scoreMortgagePrograms(region.mortgage_programs_count);
  const mw = w.mortgage;
  const mwSum = mw.vol + mw.rate + mw.prog;
  const mAvg = (mVol * mw.vol + mRate * mw.rate + mProg * mw.prog) / mwSum;

  const cDev = scoreDevCount(region.active_developers_count);
  const cFed = scoreFederalShare(region.federal_developers_share_percent);
  const cConc = scoreConcentration(region.market_concentration);
  const cw = w.competition;
  const cwSum = cw.dev + cw.fed + cw.conc;
  const cAvg = (cDev * cw.dev + cFed * cw.fed + cConc * cw.conc) / cwSum;

  const iTrans = scoreTransport(region.transport_infrastructure);
  const iPlan = scoreDevPlan(region.city_development_plan);
  const iSoc = scoreSocialInfra(region.social_infrastructure);
  const iw = w.infra;
  const iwSum = iw.trans + iw.plan + iw.soc;
  const iAvg = (iTrans * iw.trans + iPlan * iw.plan + iSoc * iw.soc) / iwSum;

  const aCoop = scoreAdminCoop(region.admin_cooperation_level);
  const aSupp = scoreSupportMech(region.support_mechanisms_count);
  const aPerm = scorePermitMonths(region.permit_procedure_months);
  const aw = w.admin;
  const awSum = aw.coop + aw.supp + aw.perm;
  const aAvg = (aCoop * aw.coop + aSupp * aw.supp + aPerm * aw.perm) / awSum;

  const pStat = scoreCityStatus(region);
  const pCult = scoreBusinessCulture(region.business_culture_level);
  const pEco = scoreEcology(region.ecology_level);
  const pw = w.prestige;
  const pwSum = pw.stat + pw.cult + pw.eco;
  const pAvg = (pStat * pw.stat + pCult * pw.cult + pEco * pw.eco) / pwSum;

  const totalScore = (dAvg + eAvg + hAvg + mAvg + cAvg + iAvg + aAvg + pAvg) / 8 * 10;

  return {
    region_id: region.id,
    region_name: region.name,
    segment,
    total_score: Math.round(totalScore * 100) / 100,
    match_score: 0,
    block_scores: {
      demography: Math.round(dAvg * 100) / 100,
      economy: Math.round(eAvg * 100) / 100,
      housing_market: Math.round(hAvg * 100) / 100,
      mortgage: Math.round(mAvg * 100) / 100,
      competition: Math.round(cAvg * 100) / 100,
      infrastructure: Math.round(iAvg * 100) / 100,
      admin_climate: Math.round(aAvg * 100) / 100,
      prestige: Math.round(pAvg * 100) / 100,
    },
    region,
  };
}

// ─── Match algorithm: brief ↔ region ─────────────────────────────────

export function calculateMatchScore(region: Region, brief: BriefData): number {
  let score = 50;

  if (brief.home_region_id && region.id === brief.home_region_id) score += 20;

  if (brief.min_population && region.population_thousands >= brief.min_population) score += 15;

  if (brief.preferred_districts?.length > 0) {
    if (brief.preferred_districts.includes(region.federal_district)) score += 15;
  }

  if (brief.building_type === 'apartment' && region.population_thousands > 250) score += 10;
  else if (brief.building_type === 'izhs') score += 5;

  if (brief.floors_count === 'low' || brief.floors_count === 'mid') {
    if (region.population_thousands >= 100 && region.population_thousands <= 500) score += 8;
  }
  if (brief.floors_count === 'high' || brief.floors_count === 'sky') {
    if (region.population_thousands > 250) score += 8;
  }

  if (region.avg_monthly_salary_rub > 50000) score += 5;
  if (region.population_growth_3yr_percent > 0) score += 5;
  if (region.migration_saldo > 0) score += 5;

  return Math.min(100, Math.max(0, score));
}

// ─── Main ranking function ───────────────────────────────────────────

export function rankRegions(regions: Region[], brief: BriefData): ScoringResult[] {
  const seg = brief.target_segment;
  const results = regions.map(r => {
    const sr = calculateRegionScore(r, seg);
    const ms = calculateMatchScore(r, brief);
    return { ...sr, match_score: Math.round(ms * 100) / 100 };
  });

  return results.sort((a, b) => {
    const ca = a.total_score * 0.7 + a.match_score * 0.3;
    const cb = b.total_score * 0.7 + b.match_score * 0.3;
    return cb - ca;
  });
}

// ─── Land Plot Scoring (29 parameters, 8 blocks) ─────────────────────

function scoreDistanceEconomy(v: number): number {
  if (v >= 5 && v <= 15) return 10;
  if (v >= 15 && v <= 25) return 8;
  if (v < 5) return 6;
  if (v >= 25 && v <= 35) return 6;
  return 4;
}
function scoreDistanceComfort(v: number): number {
  if (v >= 3 && v <= 10) return 10;
  if (v >= 10 && v <= 20) return 8;
  if (v < 3) return 6;
  if (v >= 20 && v <= 30) return 6;
  return 4;
}
function scoreDistanceBusiness(v: number): number {
  if (v < 5) return 10;
  if (v >= 5 && v <= 10) return 8;
  if (v >= 10 && v <= 15) return 6;
  if (v >= 15 && v <= 25) return 4;
  return 2;
}

function scoreTransportAccess(v: number): number {
  if (v < 10) return 10;
  if (v < 20) return 8;
  if (v < 15) return 7;
  if (v < 30) return 6;
  return 3;
}

function scoreRoadQuality(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 5;
  return 2;
}

function scoreProspects(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreSchools(v: number): number {
  if (v >= 2) return 10;
  if (v === 1) return 7;
  if (v === 0) return 2;
  return 5;
}

function scoreKindergartens(v: number): number {
  if (v >= 2) return 10;
  if (v === 1) return 7;
  if (v === 0) return 2;
  return 5;
}

function scoreRetail(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreMedical(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 5;
  return 2;
}

function scoreParks(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  return 3;
}

function scoreElectricity(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 5;
  return 3;
}

function scoreWater(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 5;
  return 3;
}

function scoreHeat(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 6;
  return 4;
}

function scoreGas(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  return 4;
}

function scoreAreaEconomy(v: number): number {
  if (v >= 1 && v <= 3) return 10;
  if (v >= 3 && v <= 5) return 8;
  return 6;
}
function scoreAreaComfortBusiness(v: number): number {
  if (v >= 0.5 && v <= 2) return 10;
  if (v >= 2 && v <= 3) return 8;
  return 6;
}

function scoreShape(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 8;
  if (v === 3) return 5;
  return 3;
}

function scoreTerrain(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreGroundwater(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  return 4;
}

function scoreVRI(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 6;
  return 3;
}

function scoreHeightRestrict(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreLegalClean(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 1;
}

function scoreCadastralCost(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreCadToMarket(v: number): number {
  if (v < 70) return 10;
  if (v < 85) return 8;
  if (v < 100) return 6;
  if (v < 120) return 4;
  return 2;
}

function scorePrepCosts(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scoreNearbyPriceEconomy(v: number): number {
  if (v >= 80 && v <= 120) return 10;
  if (v >= 120 && v <= 150) return 7;
  return 5;
}
function scoreNearbyPriceComfort(v: number): number {
  if (v >= 120 && v <= 180) return 10;
  if (v >= 180 && v <= 220) return 7;
  return 5;
}
function scoreNearbyPriceBusiness(v: number): number {
  if (v > 200) return 10;
  if (v >= 150) return 8;
  return 5;
}

function scoreAbsorption(v: number): number {
  if (v >= 6 && v <= 12) return 10;
  if (v >= 12 && v <= 18) return 8;
  if (v >= 18 && v <= 24) return 6;
  if (v >= 24 && v <= 30) return 4;
  return 2;
}

function scorePlotCompetition(v: number): number {
  if (v >= 1 && v <= 2) return 10;
  if (v >= 3 && v <= 4) return 8;
  if (v >= 5 && v <= 7) return 6;
  if (v === 0) return 5;
  return 3;
}

function scorePlotEcology(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  if (v === 3) return 4;
  return 2;
}

function scorePollutantDist(v: number): number {
  if (v > 500) return 10;
  if (v >= 300) return 7;
  if (v >= 150) return 5;
  return 2;
}

function scoreWaterGreen(v: number): number {
  if (v === 1) return 10;
  if (v === 2) return 7;
  return 4;
}

// Plot weights
const PW = {
  economy: {
    location: { dist: 4, trans: 5, road: 3, prospect: 4 },
    infra:    { school: 5, kinder: 5, retail: 4, med: 4, park: 3 },
    engineer: { elec: 5, water: 5, heat: 4, gas: 3 },
    physical: { area: 4, shape: 4, terrain: 3, ground: 3 },
    legal:    { vri: 5, height: 4, clean: 5 },
    financial:{ cost: 4, ratio: 4, prep: 4 },
    market:   { price: 4, absorb: 4, comp: 3 },
    ecology:  { eco: 3, pollutant: 3, watergreen: 2 },
  },
  comfort: {
    location: { dist: 4, trans: 5, road: 3, prospect: 4 },
    infra:    { school: 4, kinder: 4, retail: 4, med: 4, park: 4 },
    engineer: { elec: 4, water: 4, heat: 3, gas: 3 },
    physical: { area: 4, shape: 4, terrain: 3, ground: 3 },
    legal:    { vri: 5, height: 4, clean: 5 },
    financial:{ cost: 4, ratio: 4, prep: 4 },
    market:   { price: 4, absorb: 4, comp: 3 },
    ecology:  { eco: 4, pollutant: 3, watergreen: 3 },
  },
  business: {
    location: { dist: 3, trans: 4, road: 3, prospect: 4 },
    infra:    { school: 3, kinder: 3, retail: 4, med: 3, park: 5 },
    engineer: { elec: 4, water: 4, heat: 3, gas: 2 },
    physical: { area: 4, shape: 4, terrain: 3, ground: 3 },
    legal:    { vri: 5, height: 4, clean: 5 },
    financial:{ cost: 3, ratio: 3, prep: 4 },
    market:   { price: 4, absorb: 4, comp: 3 },
    ecology:  { eco: 5, pollutant: 4, watergreen: 5 },
  },
};

export function calculatePlotScore(plot: LandPlot, segment: Segment) {
  const w = PW[segment];

  const distFn = segment === 'economy' ? scoreDistanceEconomy : segment === 'comfort' ? scoreDistanceComfort : scoreDistanceBusiness;
  const lDist = distFn(plot.distance_from_center_km);
  const lTrans = scoreTransportAccess(plot.transport_accessibility);
  const lRoad = scoreRoadQuality(plot.road_quality);
  const lProspect = scoreProspects(plot.development_prospects);
  const lw = w.location;
  const lwSum = lw.dist + lw.trans + lw.road + lw.prospect;
  const lAvg = (lDist * lw.dist + lTrans * lw.trans + lRoad * lw.road + lProspect * lw.prospect) / lwSum;

  const iSchool = scoreSchools(plot.schools_within_1_5km);
  const iKinder = scoreKindergartens(plot.kindergartens_within_1km);
  const iRetail = scoreRetail(plot.retail_infrastructure);
  const iMed = scoreMedical(plot.medical_facilities_within_2km);
  const iPark = scoreParks(plot.parks_within_1km);
  const iw2 = w.infra;
  const iwSum = iw2.school + iw2.kinder + iw2.retail + iw2.med + iw2.park;
  const iAvg = (iSchool * iw2.school + iKinder * iw2.kinder + iRetail * iw2.retail + iMed * iw2.med + iPark * iw2.park) / iwSum;

  const eElec = scoreElectricity(plot.electricity_supply);
  const eWater = scoreWater(plot.water_supply);
  const eHeat = scoreHeat(plot.heat_supply);
  const eGas = scoreGas(plot.gas_supply);
  const ew2 = w.engineer;
  const ewSum = ew2.elec + ew2.water + ew2.heat + ew2.gas;
  const engAvg = (eElec * ew2.elec + eWater * ew2.water + eHeat * ew2.heat + eGas * ew2.gas) / ewSum;

  const areaFn = segment === 'economy' ? scoreAreaEconomy : scoreAreaComfortBusiness;
  const pArea = areaFn(plot.area_hectares);
  const pShape = scoreShape(plot.shape_quality);
  const pTerrain = scoreTerrain(plot.terrain_geology);
  const pGround = scoreGroundwater(plot.groundwater_level);
  const pw2 = w.physical;
  const pwSum = pw2.area + pw2.shape + pw2.terrain + pw2.ground;
  const pAvg = (pArea * pw2.area + pShape * pw2.shape + pTerrain * pw2.terrain + pGround * pw2.ground) / pwSum;

  const leVRI = scoreVRI(plot.vri_compliance);
  const leHeight = scoreHeightRestrict(plot.height_restrictions);
  const leClean = scoreLegalClean(plot.legal_cleanliness);
  const lew = w.legal;
  const lewSum = lew.vri + lew.height + lew.clean;
  const leAvg = (leVRI * lew.vri + leHeight * lew.height + leClean * lew.clean) / lewSum;

  const fCost = scoreCadastralCost(1);
  const fRatio = scoreCadToMarket(plot.cadastral_to_market_ratio_percent);
  const fPrep = scorePrepCosts(plot.preparation_costs_level);
  const fw = w.financial;
  const fwSum = fw.cost + fw.ratio + fw.prep;
  const fAvg = (fCost * fw.cost + fRatio * fw.ratio + fPrep * fw.prep) / fwSum;

  const priceFn = segment === 'economy' ? scoreNearbyPriceEconomy : segment === 'comfort' ? scoreNearbyPriceComfort : scoreNearbyPriceBusiness;
  const mPrice = priceFn(plot.nearby_avg_price_per_sqm);
  const mAbsorb = scoreAbsorption(plot.absorption_rate_months);
  const mComp = scorePlotCompetition(plot.competition_within_3km);
  const mw2 = w.market;
  const mwSum2 = mw2.price + mw2.absorb + mw2.comp;
  const mAvg2 = (mPrice * mw2.price + mAbsorb * mw2.absorb + mComp * mw2.comp) / mwSum2;

  const ecEco = scorePlotEcology(plot.ecology_level);
  const ecPoll = scorePollutantDist(plot.distance_from_pollutants_meters);
  const ecWater = scoreWaterGreen(plot.water_green_zones_within_1km);
  const ecw = w.ecology;
  const ecwSum = ecw.eco + ecw.pollutant + ecw.watergreen;
  const ecAvg = (ecEco * ecw.eco + ecPoll * ecw.pollutant + ecWater * ecw.watergreen) / ecwSum;

  const totalScore = (lAvg + iAvg + engAvg + pAvg + leAvg + fAvg + mAvg2 + ecAvg) / 8 * 10;

  return {
    total_score: Math.round(totalScore * 100) / 100,
    block_scores: {
      location: Math.round(lAvg * 100) / 100,
      infrastructure: Math.round(iAvg * 100) / 100,
      engineering: Math.round(engAvg * 100) / 100,
      physical: Math.round(pAvg * 100) / 100,
      legal: Math.round(leAvg * 100) / 100,
      financial: Math.round(fAvg * 100) / 100,
      market: Math.round(mAvg2 * 100) / 100,
      ecology: Math.round(ecAvg * 100) / 100,
    },
  };
}

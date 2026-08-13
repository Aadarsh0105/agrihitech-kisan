import type { CityRecord, DistrictRecord, StateRecord } from '../types';

export const states: StateRecord[] = [
{ id: 'st_01', name: 'Maharashtra', code: 'MH', districtCount: 36, cityCount: 534, status: 'active' },
{ id: 'st_02', name: 'Uttar Pradesh', code: 'UP', districtCount: 75, cityCount: 915, status: 'active' },
{ id: 'st_03', name: 'Punjab', code: 'PB', districtCount: 23, cityCount: 217, status: 'active' },
{ id: 'st_04', name: 'Telangana', code: 'TG', districtCount: 33, cityCount: 312, status: 'active' },
{ id: 'st_05', name: 'Gujarat', code: 'GJ', districtCount: 33, cityCount: 398, status: 'active' },
{ id: 'st_06', name: 'Madhya Pradesh', code: 'MP', districtCount: 55, cityCount: 476, status: 'active' },
{ id: 'st_07', name: 'Karnataka', code: 'KA', districtCount: 31, cityCount: 347, status: 'active' },
{ id: 'st_08', name: 'West Bengal', code: 'WB', districtCount: 23, cityCount: 289, status: 'inactive' }];


export const districts: DistrictRecord[] = [
{ id: 'dt_01', name: 'Nashik', stateId: 'st_01', stateName: 'Maharashtra', cityCount: 24, status: 'active' },
{ id: 'dt_02', name: 'Pune', stateId: 'st_01', stateName: 'Maharashtra', cityCount: 31, status: 'active' },
{ id: 'dt_03', name: 'Lucknow', stateId: 'st_02', stateName: 'Uttar Pradesh', cityCount: 18, status: 'active' },
{ id: 'dt_04', name: 'Ludhiana', stateId: 'st_03', stateName: 'Punjab', cityCount: 14, status: 'active' },
{ id: 'dt_05', name: 'Warangal', stateId: 'st_04', stateName: 'Telangana', cityCount: 11, status: 'active' },
{ id: 'dt_06', name: 'Rajkot', stateId: 'st_05', stateName: 'Gujarat', cityCount: 21, status: 'active' },
{ id: 'dt_07', name: 'Indore', stateId: 'st_06', stateName: 'Madhya Pradesh', cityCount: 16, status: 'inactive' }];


export const cities: CityRecord[] = [
{ id: 'ct_01', name: 'Nashik', districtId: 'dt_01', districtName: 'Nashik', stateName: 'Maharashtra', pincode: '422001', status: 'active' },
{ id: 'ct_02', name: 'Dindori', districtId: 'dt_01', districtName: 'Nashik', stateName: 'Maharashtra', pincode: '422202', status: 'active' },
{ id: 'ct_03', name: 'Baramati', districtId: 'dt_02', districtName: 'Pune', stateName: 'Maharashtra', pincode: '413102', status: 'active' },
{ id: 'ct_04', name: 'Malihabad', districtId: 'dt_03', districtName: 'Lucknow', stateName: 'Uttar Pradesh', pincode: '227107', status: 'active' },
{ id: 'ct_05', name: 'Jagraon', districtId: 'dt_04', districtName: 'Ludhiana', stateName: 'Punjab', pincode: '142026', status: 'active' },
{ id: 'ct_06', name: 'Hanamkonda', districtId: 'dt_05', districtName: 'Warangal', stateName: 'Telangana', pincode: '506001', status: 'active' },
{ id: 'ct_07', name: 'Gondal', districtId: 'dt_06', districtName: 'Rajkot', stateName: 'Gujarat', pincode: '360311', status: 'inactive' }];
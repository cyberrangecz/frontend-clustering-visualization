import { GenericObject } from './visualization/models/generic-object.type';

export class AppConfig {
	levelsTimePlan: number[];
	trainingColors: string[];
	playerColors: string[];
	darkColor: string;
	finalViewBarPadding: number;
	minBarHeight: number;
	maxBarHeight: number;
	maxZoomValue: number;
	zoomStep: number;
	simulationInterval: number;
	loadDataInterval: number;
	assetsRoot: string;
}

export const CTF_PROGRESS_CONFIG: AppConfig = {
	levelsTimePlan: [],
	trainingColors: ['#ebebeb', '#dadada', '#c0c0c0', '#aeaeae', '#9b9b9b', '#646464', '#3e3e3c'],
	playerColors: ['#D8008C', '#92D88C', '#372A9F', '#9035A6', '#D88C8C', '#7A9EBD', '#D8D88C', '#ADAAE1', '#8CD8C7'],
	// playerColors: ['#D88C8C', '#7A9EBD', '#D8D88C', '#92D88C', '#ADAAE1', '#D8008C', '#8CD8C7'],
	darkColor: '#2f2f2f',
	finalViewBarPadding: 50,
	minBarHeight: 18,
	maxBarHeight: 35,
	maxZoomValue: 10,
	zoomStep: 0.25,
	simulationInterval: 800,
	loadDataInterval: 5000,
	assetsRoot: '/portlet_ctf_progress-0.1/',
};


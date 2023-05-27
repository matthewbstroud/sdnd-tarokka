import { contants } from './constants.js';
import { moduleSettings } from './settings.js';

export let socket;
Hooks.once('init', async function() {
	
});

Hooks.once('socketlib.ready', async function() {
	socket = socketlib.registerModule(contants.MODULE_ID);
});
Hooks.once('ready', async function() {
	//moduleSettings.registerSettings();
	console.log("SDND Tarokka");
	
});
globalThis['sdndTarokka'] = {
}
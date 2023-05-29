import { constants } from './constants.js';
import { moduleSettings } from './settings.js';
import { folders } from './folders.js';
import { tarokka } from './tarokka.js';

export let socket;
Hooks.once('init', async function() {
	
});

Hooks.once('socketlib.ready', async function() {
	socket = socketlib.registerModule(constants.MODULE_ID);
});
Hooks.once('ready', async function() {
	await folders.init();
	await tarokka.init();
	console.log("SDND Tarokka");
});
globalThis['sdndTarokka'] = {
	tarokka
}
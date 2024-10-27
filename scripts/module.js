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


const migrationPacks = [
    `sdnd-tarokka.SDND-Tarokka-Cards`,
    `sdnd-tarokka.SDND-Tarokka-Macros`,
    `sdnd-tarokka.SDND-Tarokka-Scenes`
];

let utility = {
    "forceDnd5eMigration": async function _forceDnd5eMigration() {
        for (const packID of migrationPacks) {
            let pack = await game.packs.get(packID);
            await dnd5e.migrations.migrateCompendium(pack);
        }
        console.log("sdnd-tarokka compendium migration complete...");
    }
};
globalThis['sdndTarokka'] = {
    tarokka,
    utility
}

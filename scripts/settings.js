import { constants } from "./constants.js";

export let moduleSettings = {
	'registerSettings': function _registerSettings() {
		for (let key in this) {
			if (!this[key].config) {
				continue;
			}
			game.settings.register(constants.MODULE_ID, key, this[key].config);
		}
	}
};

function getModuleSettingValue(settingName) {
	return game?.settings?.get(constants.MODULE_ID, settingName);
}

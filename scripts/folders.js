import { constants } from "./constants.js";
export let folders = {
    "init": initFolders, 
    "ensureFolder": ensureFolder
};

async function createFolder(folderName, folderType, parentID) {
    return await Folder.create({ "name": folderName, "type": folderType, "parent": parentID });
}

async function ensureFolder(folderName, folderType, parentID) {
    let folder = await game.folders.find(f => f.name == folderName && f.folder?.id == parentID);

    if (!folder) {
        folder = await createFolder(folderName, folderType, parentID);
    }

    return folder;
}

async function initFolders() {
    let tarokkaFolder = await ensureFolder(constants.FOLDERS.MACROS.TAROKKA, "Macro", null);
    await ensureFolder(constants.FOLDERS.MACROS.BTS, "Macro", tarokkaFolder.id);
    await ensureFolder(constants.FOLDERS.CARDS.TAROKKA, "Cards", null);
}
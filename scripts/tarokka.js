import { constants } from "./constants.js";

export let tarokka = {
    "dealTarokka": _dealTarokka,
    "init": init,
    "readHand": _readHand
};

async function init() {
    await ensureMacro(constants.MACROS.DEAL, constants.PACKS.COMPENDIUMS.MACRO.GM, constants.FOLDERS.MACROS.TAROKKA);
}

async function ensureCards(cardsName, packId, parentFolderName) {
    let cards = await game.cards.getName(cardsName);
    if (!cards) {
        let pack = game.packs.get(packId);
        if (!pack) {
            ui.notifications.error(`Cannot find compendium ${packId}!`);
            return null;
        }
        let packCards = pack.index.getName(cardsName);
        if (!packCards) {
            ui.notifications.error(`Cannot find cards ${cardsName} in compendium ${packId}!`);
            return null;
        }
        let parentFolder = game.folders.find(f => f.type == "Cards" && f.name == parentFolderName);
        cards = await game.cards.importFromCompendium(pack, packCards._id, { "folder": parentFolder?.id });
    }
    return cards;
}

async function ensureMacro(macroName, packId, parentFolderName) {
    let macro = await game.macros.getName(macroName);
    if (!macro) {
        let pack = game.packs.get(packId);
        if (!pack) {
            ui.notifications.error(`Cannot find compendium ${packId}!`);
            return null;
        }
        let packMacro = pack.index.getName(macroName);
        if (!packMacro) {
            ui.notifications.error(`Cannot find macro ${macroName} in compendium ${packId}!`);
            return null;
        }
        let parentFolder = await getFolder(parentFolderName);
        macro = await game.macros.importFromCompendium(pack, packMacro._id, { "folder": parentFolder?.id });
    }
    return macro;
}

async function getFolder(folderName, parentFolderID) {
    debugger;
    let parts = folderName.split('/');
    if (parts.length > 1) {
        let parentFolderName = parts[0];
        let childFolder = parts.slice(1).join('/');
        let parentFolder = await game.folders.getName(parentFolderName);
        if (!parentFolder) {
            return null;
        }
        return getFolder(childFolder, parentFolder.id);
    }
    return await game.folders.find(f => f.name == folderName && f.folder?.id == parentFolderID);
}

async function _readHand(card_slot, card) {
    const TREASURE_LOCATIONS = {
        "Avenger": {
            "player": "The treasure lies in a dragon's house, in hands once clean and now corrupted.",
            "gm": "The treasure is in the possession of Vladimir Horngaard in Argynvostholt (chapter 7, area Q36)."
        },
        "Paladin": {
            "player": "I see a sleeping prince, a servant of light and the brother of darkness. The treasure lies with him.",
            "gm": "The treasure lies in Sergei's tomb (chapter 4, area K85)."
        },
        "Soldier": {
            "player": "Go to the mountains. Climb the white tower guarded by golden knights.",
            "gm": "The treasure lies on the rooftop of the Tsolenka Pass guard tower (chapter 9, area T6)."
        },
        "Mercenary": {
            "player": "The thing you seek lies with the dead, under mountains of gold coins.",
            "gm": "The treasure lies in a crypt in Castle Ravenloft (chapter 4, area K84, crypt 31)."
        },
        "Myrmidon": {
            "player": "Look for a den of wolves in the hills overlooking a mountain lake. The treasure belongs to Mother Night.",
            "gm": "The treasure lies in the shrine of Mother Night in the werewolf den (chapter 15, area Z7)."
        },
        "Berserker": {
            "player": "Find the Mad Dog's crypt. The treasure lies within, beneath blackened bones.",
            "gm": "The treasure lies in the crypt of General Kroval “Mad Dog” Grislek (chapter 4, area K84, crypt 38)."
        },
        "Hooded One": {
            "player": "I see a faceless god. He awaits you at the end of a long and winding road, deep in the mountains.",
            "gm": "The treasure is inside the head of the giant statue in the Amber Temple (chapter 13, area X5a)."
        },
        "Dictator": {
            "player": "I see a throne fit for a king.",
            "gm": "The treasure lies in Castle Ravenloft's audience hall (chapter 4, area K25)."
        },
        "Torturer": {
            "player": "There is a town where all is not well. There you will find a house of corruption, and within, a dark room full of still ghosts.",
            "gm": "The treasure is hidden in the attic of the Burgomaster's mansion in Vallaki (chapter 5, area N3s)."
        },
        "Warrior": {
            "player": "That which you seek lies in the womb of darkness, the devil's lair: the one place to which he must return.",
            "gm": "The treasure lies in Strahd's tomb (chapter 4, area K86)."
        },
        "Transmuter": {
            "player": "Go to a place of dizzying heights, where the stone itself is alive!",
            "gm": "The treasure lies in Castle Ravenloft's north tower peak (chapter 4, area K60)."
        },
        "Diviner": {
            "player": "Look to the one who sees all. The treasure is hidden in her camp.",
            "gm": "The treasure lies in Madam Eva's encampment (chapter 2, area G). If she is the one performing the card reading, she says, “I think the treasure is under my very nose!”"
        },
        "Enchanter": {
            "player": "I see a kneeling woman—a rose of great beauty plucked too soon. The master of the marsh knows of whom I speak.",
            "gm": "The treasure lies under Marina's monument in Berez (chapter 10, area U5). “The master of the marsh” refers to Burgomaster Lazlo Ulrich (area U2), whose ghost can point characters toward the monument."
        },
        "Abjurer": {
            "player": "I see a fallen house guarded by a great stone dragon. Look to the highest peak.",
            "gm": "The treasure lies in the beacon of Argynvostholt (chapter 7, area Q53). “Great stone dragon” refers to the statue in area Q1."
        },
        "Elementalist": {
            "player": "The treasure is hidden in a small castle beneath a mountain, guarded by amber giants.",
            "gm": "The treasure is inside a model of Castle Ravenloft in the Amber Temple (chapter 13, area X20)."
        },
        "Evoker": {
            "player": "Search for the crypt of a wizard ordinaire. His staff is the key.",
            "gm": "The treasure is hidden in the crypt of Gralmore Nimblenobs (chapter 4, area K84, crypt 37)."
        },
        "Illusionist": {
            "player": "A man is not what he seems. He comes here in a carnival wagon. Therein lies what you seek.",
            "gm": "The treasure lies in Rictavio's carnival wagon (chapter 5, area N5)."
        },
        "Necromancer": {
            "player": "A woman hangs above a roaring fire. Find her, and you will find the treasure.",
            "gm": "The treasure lies in Castle Ravenloft's study (chapter 4, area K37)."
        },
        "Conjurer": {
            "player": "I see a dead village, drowned by a river, ruled by one who has brought great evil into the world.",
            "gm": "The treasure is in Baba Lysaga's hut (chapter 10, area U3)."
        },
        "Wizard": {
            "player": "Look for a wizard's tower on a lake. Let the wizard's name and servant guide you to that which you seek.",
            "gm": "The treasure lies on the top floor of Van Richten's Tower (chapter 11, area V7)."
        },
        "Swashbuckler": {
            "player": "I see the skeleton of a deadly warrior, lying on a bed of stone flanked by gargoyles.",
            "gm": "The treasure lies in the crypt of Endorovich (chapter 4, area K84, crypt 7)."
        },
        "Philanthropist": {
            "player": "Look to a place where sickness and madness are bred. Where children once cried, the treasure lies still.",
            "gm": "The treasure is in the nursery of the Abbey of Saint Markovia (chapter 8, area S23)."
        },
        "Trader": {
            "player": "Look to the wizard of wines! In wood and sand the treasure hides.",
            "gm": "The treasure lies in the glassblower's workshop in the Wizard of Wines winery (chapter 12, area W10)."
        },
        "Merchant": {
            "player": "Seek a cask that once contained the finest wine, of which not a drop remains.",
            "gm": "The treasure lies in Castle Ravenloft's wine cellar (chapter 4, area K63)."
        },
        "Guild Member": {
            "player": "I see a dark room full of bottles. It is the tomb of a guild member.",
            "gm": "The treasure lies in the crypt of Artank Swilovich (chapter 4, area K84, crypt 5)."
        },
        "Beggar": {
            "player": "A wounded elf has what you seek. He will part with the treasure to see his dark dreams fulfilled.",
            "gm": "The treasure is hidden in Kasimir's hovel (chapter 5, area N9a)."
        },
        "Thief": {
            "player": "What you seek lies at the crossroads of life and death, among the buried dead.",
            "gm": "The treasure is buried in the graveyard at the River Ivlis crossroads (chapter 2, area F)."
        },
        "Tax Collector": {
            "player": "The Vistani have what you seek. A missing child holds the key to the treasure's release.",
            "gm": "The treasure is hidden in the Vistani treasure wagon (chapter 5, area N9i). “A missing child” refers to Arabelle (see chapter 2, area L)."
        },
        "Miser": {
            "player": "Look for a fortress inside a fortress, in a place hidden behind fire.",
            "gm": "The treasure lies in Castle Ravenloft's treasury (chapter 4, area K41)."
        },
        "Rogue": {
            "player": "I see a nest of ravens. There you will find the prize..",
            "gm": "The treasure is hidden in the attic of the Blue Water Inn (chapter 5, area N2q)."
        },
        "Monk": {
            "player": "The treasure you seek is hidden behind the sun, in the house of a saint.",
            "gm": "The treasure lies in the main hall of the Abbey of Saint Markovia (chapter 8, area S13)."
        },
        "Missionary": {
            "player": "I see a garden dusted with snow, watched over by a scarecrow with a sackcloth grin. Look not to the garden but to the guardian.",
            "gm": "The treasure is hidden inside one of the scarecrows in the garden of the Abbey of Saint Markovia (chapter 8, area S9)."
        },
        "Healer": {
            "player": "Look to the west. Find a pool blessed by the light of the white sun.",
            "gm": "The treasure lies beneath the gazebo in the Shrine of the White Sun (chapter 8, area S4)."
        },
        "Shepherd": {
            "player": "Find the mother—she who gave birth to evil.",
            "gm": "The treasure lies in the tomb of King Barov and Queen Ravenovia (chapter 4, area K88)."
        },
        "Druid": {
            "player": "An evil tree grows atop a hill of graves where the ancient dead sleep. The ravens can help you find it. Look for the treasure there.",
            "gm": "The treasure lies at the base of the Gulthias tree (chapter 14, area Y4). Any wereraven encountered in the wilderness can lead the characters to the location."
        },
        "Anarchist": {
            "player": "I see walls of bones, a chandelier of bones, and a table of bones—all that remains of enemies long forgotten.",
            "gm": "The treasure lies in Castle Ravenloft's hall of bones (chapter 4, area K67)."
        },
        "Charlatan": {
            "player": "I see a lonely mill on a precipice. The treasure lies within.",
            "gm": "The treasure lies in the attic of Old Bonegrinder (chapter 6, area O4)."
        },
        "Bishop": {
            "player": "What you seek lies in a pile of treasure, beyond a set of amber doors.",
            "gm": "The treasure lies in the sealed treasury of the Amber Temple (chapter 13, area X40)."
        },
        "Traitor": {
            "player": "Look for a wealthy woman. A staunch ally of the devil, she keeps the treasure under lock and key, with the bones of an ancient enemy.",
            "gm": "The treasure is hidden in the master bedroom of Wachterhaus (chapter 5, area N4o)."
        },
        "Priest": {
            "player": "You will find what you seek in the castle, amid the ruins of a place of supplication.",
            "gm": "The treasure lies in Castle Ravenloft's chapel (chapter 4, area K15)."
        }
    }

    const STRAHDS_ENEMIES = {
        "Artifact": {
            "player": "Look for an entertaining man with a monkey. This man is more than he seems.",
            "gm": "This card refers to Rictavio (see appendix D), who can be found at the Blue Water Inn in Vallaki (chapter 5, area N2)." +
                "<br/><br/>Normally reluctant to accompany the characters, Rictavio changes his tune if the characters tell him about the card reading. He sheds his disguise and introduces himself as Dr. Rudolph van Richten." +
                "<br/><br/>The characters might think that Gadof Blinsky, the toymaker of Vallaki (area N7), is the figure they seek, because he has a pet monkey. If they speak to him about this possibility, Blinsky jokes that he and the monkey are “old friends,” but if the characters ask him to come with them to fight Strahd, he politely declines. If the characters tell him about the tarokka reading, Blinsky admits that he acquired the monkey from a half-elf carnival ringmaster named Rictavio."
        },
        "Beast": {
            "player": "A werewolf holds a secret hatred for your enemy. Use her hatred to your advantage.",
            "gm": "This card refers to the werewolf Zuleika Toranescu (see chapter 15, area Z7)." +
                "<br/><br/>She will accompany the characters if they promise to avenge her mate, Emil, by killing the leader of her pack, Kiril Stoyanovich."
        },
        "Broken One": {
            "player": "Your greatest ally will be a wizard. His mind is broken, but his spells are strong.",
            "gm": "This card refers to the Mad Mage of Mount Baratok (see chapter 2, area M)."
        },
        "Darklord": {
            "player": "Ah, the worst of all truths: You must face the evil of this land alone!",
            "gm": "There is no NPC who can inspire the characters."
        },
        "Donjon": {
            "player": "Search for a troubled young man surrounded by wealth and madness. His home is his prison.",
            "gm": "This card refers to Victor Vallakovich (see chapter 5, area N3t)." +
                "<br/><br/>Realizing that the characters are the key to his salvation, he enthusiastically leaves home and accompanies them to Castle Ravenloft."
        },
        "Seer": {
            "player": "Look for a dusk elf living among the Vistani. He has suffered a great loss and is haunted by dark dreams. Help him, and he will help you in return.",
            "gm": "This card refers to Kasimir Velikov (see chapter 5, area N9a)." +
                "<br/><br/>The dusk elf accompanies the characters to Castle Ravenloft only after they lead him to the Amber Temple and help him find the means to resurrect his dead sister, Patrina Velikovna."
        },
        "Ghost": {
            "player": "I see a fallen paladin of a fallen order of knights. He lingers like a ghost in a dead dragon's lair.",
            "gm": "This card refers to the revenant Sir Godfrey Gwilym (see chapter 7, area Q37). " +
                "<br/><br/>Although initially unwilling to accompany the characters, he will do so if the characters convince him that the honor of the Order of the Silver Dragon can be restored with his help. Doing this requires a successful DC 15 Charisma (Persuasion) check."
        },
        "Executioner": {
            "player": "Seek out the brother of the devil's bride. They call him “the lesser,” but he has a powerful soul.",
            "gm": "This card refers to Ismark Kolyanovich (see chapter 3, area E2).<br/><br/>Ismark won't accompany the characters to Castle Ravenloft until he knows that his sister, Ireena Kolyana, is safe."
        },
        "Horseman": {
            "player": "I see a dead man of noble birth, guarded by his widow. Return life to the dead man's corpse, and he will be your staunch ally.",
            "gm": "This card refers to Nikolai Wachter the elder, who is dead (see chapter 5, area N4o). If the characters cast a raise dead spell or a resurrection " +
                "spell on his preserved corpse, Nikolai (LN male human noble) agrees to help the characters once he feels well enough, despite his wife's protests. " +
                "Although his family has long supported Strahd, Nikolai came to realize toward the end of his life that Strahd must be destroyed to save Barovia. " +
                "<br/><br/>If the characters dont have the means to raise Nikolai from the dead, Rictavio (see appendix D) gives them a spell scroll of raise dead if he learns of their need. If they're staying at the Blue Water Inn, he leaves the scroll in one of their rooms."
        },
        "Innocent": {
            "player": "I see a young man with a kind heart. A mother's boy! He is strong in body but weak of mind. Seek him out in the village of Barovia.",
            "gm": "This card refers to Parriwimple (see chapter 3, area E1). " +
                "<br/><br/>Although he's a simpleton, he won't travel to Castle Ravenloft without good cause. Characters can manipulate him into going by preying on his good heart. For instance, he might go there to help rescue missing Barovians, or to save the life of Ireena Kolyana, who is very beautiful. The characters must somehow deal with Bildrath, Parriwimple's employer, who won't let the foolish boy go to the castle for any reason."
        },
        "Marionette": {
            "player": "This card refers to Clovin Belview (see chapter 8, area S17), the two-headed mongrelfolk.",
            "gm": "This card refers to Pidlwick II (see chapter 4, area K59, as well as appendix D)." +
                "<br/><br/>Clovin serves the Abbot out of fear and a perverse sense of loyalty. His job is to deliver food to the other mongrelfolk, whom he abhors. If the Abbot still lives, Clovin doesn't want to earn his Master's ire by attempting to leave, and he refuses to accompany the characters. But if the Abbot dies, Clovin doesn't have any reason to remain in the abbey, so he's willing to come along if he is bribed with wine. Clovin provides no benefit to the party without his viol."
        },
        "Mists": {
            "player": "A Vistana wanders this land alone, searching for her mentor. She does not stay in one place for long. Seek her out at Saint Markovia's abbey, near the mists.",
            "gm": "This card refers to Ezmerelda d'Avenir (see appendix D)." +
                "<br/><br/>She can be found in the Abbey of Saint Markovia (see chapter 8, area S19), as well as several other locations throughout Barovia."
        },
        "Raven": {
            "player": "Find the leader of the feathered ones who live among the vines. Though old, he has one more fight left in him.",
            "gm": "This card refers to Davian Martikov (see chapter 12, “The Wizard of Wines”)." +
                "<br/><br/> The old wereraven, realizing that he has a chance to end Strahd's tyranny, leaves his vineyard and winery in the capable hands of his sons, Adrian and Elvir. But before he travels to Castle Ravenloft to face Strahd, Davian insists on reconciling with his third son, Urwin Martikov (see chapter 5, area N2)."
        },
        "Tempter": {
            "player": "I see a child—a Vistana. You must hurry, for her fate hangs in the balance. Find her at the lake!",
            "gm": "This card refers to Arabelle (see chapter 2, area L)." +
                "<br/><br/>She gladly joins the party. But if she returns to her camp (chapter 5, area N9), her father, Luvash, refuses to let her leave."
        }
    }

    const STRAHD_LOCATIONS = {
        "Artifact": {
            "player": "He lurks in the darkness where the morning light once shone—a sacred place.",
            "gm": "Strahd faces the characters in the chapel (area K15)."
        },
        "Beast": {
            "player": "The beast sits on his dark throne.",
            "gm": "Strahd faces the characters in the audience hall (area K25)."
        },
        "Broken One": {
            "player": "He haunts the tomb of the man he envied above all.",
            "gm": "Strahd faces the characters in Sergei's tomb (area K85)."
        },
        "Darklord": {
            "player": "He lurks in the depths of darkness, in the one place to which he must return.",
            "gm": "Strahd faces the characters in his tomb (area K86)."
        },
        "Donjon": {
            "player": "He lurks in a hall of bones, in the dark pits of his castle.",
            "gm": "Strahd faces the characters in the hall of bones (area K67)."
        },
        "Seer": {
            "player": "He waits for you in a place of wisdom, warmth, and despair. Great secrets are there.",
            "gm": "Strahd faces the characters in the study (area K37)."
        },
        "Ghost": {
            "player": "Look to the father's tomb.",
            "gm": "Strahd faces the characters in the tomb of King Barov and Queen Ravenovia (area K88)."
        },
        "Executioner": {
            "player": "I see a dark figure on a balcony, looking down upon this tortured land with a twisted smile.",
            "gm": "Strahd faces the characters at the overlook (area K6)."
        },
        "Horseman": {
            "player": "He lurks in the one place to which he must return—a place of death.",
            "gm": "Strahd faces the characters in his tomb (area K86)."
        },
        "Innocent": {
            "player": "He dwells with the one whose blood sealed his doom, a brother of light snuffed out too soon.",
            "gm": "Strahd faces the characters in Sergei's tomb (area K85)."
        },
        "Marionette": {
            "player": "Look to great heights. Find the beating heart of the castle. He waits nearby.",
            "gm": "Strahd faces the characters in the north tower peak (area K60)."
        },
        "Mists": {
            "player": "The cards can't see where the evil lurks. The mists obscure all!",
            "gm": "The card offers no clue about where the final showdown with Strahd will occur. It can happen anywhere you like in Castle Ravenloft. Alternatively, Madam Eva tells the characters to return to her after at least three days, and she will consult the cards again for them, but only to discern the location of their enemy."
        },
        "Raven": {
            "player": "Look to the mother's tomb.",
            "gm": "Strahd faces the characters in the tomb of King Barov and Queen Ravenovia (area K88)."
        },
        "Tempter": {
            "player": "I see a secret place—a vault of temptation hidden behind a woman of great beauty. The evil waits atop his tower of treasure.",
            "gm": "Strahd confronts the characters in the treasury (area K41). “A woman of great beauty” refers to the portrait of Tatyana hanging in the castle's study (area K37), which contains a secret door that leads to the treasury."
        }
    }

    let messageData = "";
    let objectName = "";
    switch (card_slot) {
        case "TomeOfStrahd":
            objectName = "Tome of Strahd";
            messageData = TREASURE_LOCATIONS[card];
            break;
        case "SymbolOfRavenkind":
            objectName = "Holy Symbol of Ravenkind";
            messageData = TREASURE_LOCATIONS[card];
            break;
        case "SunSword":
            objectName = "Sunsword";
            messageData = TREASURE_LOCATIONS[card];
            break;
        case "StrahdEnemy":
            objectName = "Enemy of Strahd";
            messageData = STRAHDS_ENEMIES[card];
            break;
        case "Strahd":
            objectName = "Location of Strahd";
            messageData = STRAHD_LOCATIONS[card];
            break;
    }

    ChatMessage.create({
        flavor: `Prophecy of the ${objectName}.`,
        content: messageData.player,
        type: CONST.CHAT_MESSAGE_TYPES.OOC
    });
    ChatMessage.create({
        flavor: `Prophecy of the ${objectName}.`,
        content: messageData.gm,
        whisper: ChatMessage.getWhisperRecipients('GM'),
    });
}

async function _dealTarokka() {
    if (!game.user.isGM) {
        ui.notifications.notify(`Can only be run by the gamemaster!`);
        return;
    }
    if (!game.scenes.current.name.includes("Tarokka")) {
        ui.notifications.notify(`This doesn't appear to be a Tarokka Table!`);
        return;
    }

    // CONSTANTS
    const HIGH_DECK_NAME = "Tarokka - High Deck";
    const COMMON_DECK_NAME = "Tarokka - Common Deck";
    const DST_CARD_PILE_NAME = "Tarokka Reading";
    const CARD_WIDTH = 200;
    const CARD_HEIGHT = 300;
    const CARD_DATA = [
        {
            "name": "TomeOfStrahd",
            "x": 800,
            "y": 750
        },
        {
            "name": "SymbolOfRavenkind",
            "x": 1100,
            "y": 400
        },
        {
            "name": "SunSword",
            "x": 1400,
            "y": 750
        },
        {
            "name": "StrahdEnemy",
            "x": 1100,
            "y": 1100
        },
        {
            "name": "Strahd",
            "x": 1100,
            "y": 750
        },
    ];

    async function createCard(template, card, cardBackImage) {
        let tileImageFront = card.faces[card.face].img;

        let cardData = {
            "width": CARD_WIDTH,
            "height": CARD_HEIGHT,
            "x": template.x,
            "y": template.y,
            "z": 100,
            "rotation": 0,
            "alpha": 1,
            "hidden": false,
            "locked": false,
            "overhead": false,
            "occlusion": {
                "mode": 1,
                "alpha": 0,
                "radius": null
            },
            "video": {
                "loop": true,
                "autoplay": true,
                "volume": 0
            },
            "flags": {
                "dnd5e-helpers": {
                    "coverLevel": 0
                },
                "betterroofs": {
                    "brMode": false,
                    "manualPoly": "",
                    "occlusionLinkId": "",
                    "occlusionLinkSource": false
                },
                "monks-active-tiles": {
                    "active": true,
                    "record": false,
                    "restriction": "all",
                    "controlled": "gm",
                    "trigger": [
                        "dblclick"
                    ],
                    "allowpaused": false,
                    "usealpha": false,
                    "pointer": false,
                    "pertoken": false,
                    "minrequired": 0,
                    "chance": 100,
                    "fileindex": 0,
                    "actions": [

                    ],
                    "files": []
                }
            },
            "texture": {
                "src": cardBackImage,
                "tint": null,
                "scaleX": 1,
                "scaleY": 1,
                "offsetX": 0,
                "offsetY": 0,
                "rotation": 0
            },
            "roof": false
        };


        let newCard = await canvas.scene.createEmbeddedDocuments("Tile", [cardData]);
        if (readCardMacro && newCard.length == 1) {
            let monksData = {
                "monks-active-tiles": {
                    "active": true,
                    "record": false,
                    "restriction": "all",
                    "controlled": "gm",
                    "trigger": [
                        "dblclick"
                    ],
                    "allowpaused": false,
                    "usealpha": false,
                    "pointer": false,
                    "pertoken": false,
                    "minrequired": 0,
                    "chance": 100,
                    "fileindex": 0,
                    "actions": [
                        {
                            "action": "tileimage",
                            "data": {
                                "entity": "",
                                "select": "next",
                                "transition": "blur",
                                "speed": 1,
                                "loop": 1
                            },
                            "id": `${randomID()}`
                        },
                        {
                            "action": "runmacro",
                            "data": {
                                "entity": {
                                    "id": `Macro.${readCardMacro.id}`,
                                    "name": `${readCardMacro.name}`
                                },
                                "args": `"${template.name}" "${card.name}"`,
                                "runasgm": "gm"
                            },
                            "id": `${randomID()}`
                        }
                    ],
                    "files": [
                        {
                            "id": `${randomID()}`,
                            "name": cardBackImage,
                            "selected": true
                        },
                        {
                            "id": `${randomID()}`,
                            "name": tileImageFront,
                            "selected": false
                        }
                    ]
                }
            };
            await newCard[0].update({ "flags": monksData });
        }

    }


    // get reference to src/dst cards objects
    const high_cards = await ensureCards(HIGH_DECK_NAME, constants.PACKS.COMPENDIUMS.CARD.TAROKKA, constants.FOLDERS.CARDS.TAROKKA);
    const common_cards = await ensureCards(COMMON_DECK_NAME, constants.PACKS.COMPENDIUMS.CARD.TAROKKA, constants.FOLDERS.CARDS.TAROKKA);
    const dst_cards = await ensureCards(DST_CARD_PILE_NAME, constants.PACKS.COMPENDIUMS.CARD.TAROKKA, constants.FOLDERS.CARDS.TAROKKA);
    const readCardMacro = await ensureMacro("readCard", constants.PACKS.COMPENDIUMS.MACRO.GM, `${constants.FOLDERS.MACROS.TAROKKA}/${constants.FOLDERS.MACROS.BTS}`)
    
    // reset the deck if there are less than 5 cards
    if (high_cards.availableCards.length < 2 || common_cards.availableCards.length < 3) {
        await high_cards.recall();
        await common_cards.recall();
    }

    // deal 5 random card and grab reference to the dealt card
    await common_cards.deal([dst_cards], 3, { how: CONST.CARD_DRAW_MODES.RANDOM });
    await high_cards.deal([dst_cards], 2, { how: CONST.CARD_DRAW_MODES.RANDOM });
    let card_back = high_cards.img;

    let existingCards = canvas.scene.tiles.filter((t) => t.flags['monks-active-tiles']?.files[0]?.name == card_back);
    for (var x = 0; x < existingCards.length; x++) {
        existingCards[x].delete();
    }

    for (var i = 0; i < 5; i++) {
        let cardIndex = dst_cards.cards.size - (5 - i);
        createCard(CARD_DATA[i], dst_cards.cards.contents[[cardIndex]], card_back);
    }
}
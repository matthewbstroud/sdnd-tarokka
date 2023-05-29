
export let tarokka = {
    "dealTarokka": _dealTarokka
};

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


async function _dealTarokka() {
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
    const high_cards = game.cards.filter(cards => cards.name === HIGH_DECK_NAME)[0];
    const common_cards = game.cards.filter(cards => cards.name === COMMON_DECK_NAME)[0];
    const dst_cards = game.cards.filter(cards => cards.name === DST_CARD_PILE_NAME)[0];
    const readCardMacro = game.macros.contents.find(m => m.name == "readCard");

    // reset the deck if there are less than 5 cards
    if (high_cards.availableCards.length < 2 || common_cards.availableCards.length < 3) {
        await dst_cards.reset();
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
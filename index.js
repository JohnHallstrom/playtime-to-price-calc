import fetch from "node-fetch";

/**
 *  Fetching wishlisted games on Steam by user ID
 */

const convertToEuro = (price) => {
    return price / 100;
};

const steamUserId = "76561197987446879;";
const steamUserWishlistUrl = `https://store.steampowered.com/wishlist/profiles/${steamUserId}/wishlistdata/`;

const response = await fetch(steamUserWishlistUrl);
const body = await response.text();
const wishlistedGames = JSON.parse(body);

const steamGames = Object.keys(wishlistedGames).map((key) => {
    const price = wishlistedGames[key].subs.length === 0 ? "-" : `${convertToEuro(wishlistedGames[key].subs[0].price)}€`;
    return {
        name: wishlistedGames[key].name.replace("&amp;", "&"),
        reviews: wishlistedGames[key].review_desc,
        price: price,
    };
});

/**
 *  Looking up wishlisted games' estimated playtime
 */

const convertToHours = (minutes) => {
    return Math.round((minutes / Math.pow(60, 2)) * 100) / 100;
};

const getGameCompletionTimes = async (gameToSearch) => {
    const response = await fetch("https://howlongtobeat.com/api/search", {
        method: "post",
        body: JSON.stringify({ searchTerms: [gameToSearch.name] }),
        headers: {
            "content-type": "application/json",
            referer: "https://howlongtobeat.com/",
            "user-agent": "HackThePlanet/v1.0",
        },
    });

    const data = await response.json();
    const gameMatches = data.data;

    if (gameMatches[Object.keys(gameMatches)[0]] === undefined) {
        console.log(gameToSearch);
        console.log(gameMatches);
    }

    // return {
    //     mainStory: convertToHours(gameMatches[Object.keys(gameMatches)[0]].comp_main),
    //     mainStoryPlus: convertToHours(gameMatches[Object.keys(gameMatches)[0]].comp_plus),
    //     completionist: convertToHours(gameMatches[Object.keys(gameMatches)[0]].comp_100),
    // };

    // for (const game of gameMatches) {
    //     if (gameToSearch.name.toLowerCase() === game.game_name.toLowerCase()) {
    //         return {
    //             mainStory: convertToHours(game.comp_main),
    //             mainStoryPlus: convertToHours(game.comp_plus),
    //             completionist: convertToHours(game.comp_100),
    //         };
    //     }
    // }
};

for (const game of steamGames) {
    game["timeToBeat"] = await getGameCompletionTimes(game);
    // console.log(`Added ${game.name}`);
    // console.log(game["timeToBeat"]);
}

// console.log(steamGames);

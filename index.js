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
    const price = wishlistedGames[key].sub.length === 0 ? "-" : `${convertToEuro(wishlistedGames[key].subs[0].price)}€`;

    return {
        game: wishlistedGames[key].name,
        reviews: wishlistedGames[key].review_desc,
        price: price,
    };
});

console.log(steamGames);

/**
 *  Looking up wishlisted games' estimated playtime
 */
process.exit(1);

const convertToHours = (minutes) => {
    return Math.round((minutes / Math.pow(60, 2)) * 100) / 100;
};

const getGameCompletionTimes = async (gameToSearch) => {
    const response = await fetch("https://howlongtobeat.com/api/search", {
        method: "post",
        body: JSON.stringify({ searchTerms: [gameToSearch] }),
        headers: {
            "content-type": "application/json",
            referer: "https://howlongtobeat.com/",
            "user-agent": "HackThePlanet/v1.0",
        },
    });

    const data = await response.json();
    const gameMatches = data.data;

    for (const game of gameMatches) {
        if (gameToSearch === game.game_name) {
            return {
                game: game.game_name,
                timeToBeat: {
                    mainStory: convertToHours(game.comp_main),
                    mainStoryPlus: convertToHours(game.comp_plus),
                    completionist: convertToHours(game.comp_100),
                },
            };
        }
    }
};

const games = ["Elden Ring", "Stray"];

for (const game of games) {
    console.log(await getGameCompletionTimes(game));
}

import openid from 'openid';

const relyingParty = new openid.RelyingParty(
    'http://localhost:3000/api/auth/steam/return', // Return URL
    'http://localhost:3000/',                      // Realm
    true,                                          // Use HTTPS
    false,                                         // Strict mode
    []                                             // Extensions
);

export default function handler(req, res) {
    relyingParty.verifyAssertion(req, (error, result) => {
        if (error || !result || !result.authenticated) {
            res.status(500).send('Authentication failed: ' + error);
            return;
        }

        const claimedId = result.claimedIdentifier;
        const steamIdMatch = claimedId.match(/\/id\/(\d+)$/) || claimedId.match(/\/profiles\/(\d+)$/);
        const steamId = steamIdMatch ? steamIdMatch[1] : null;

        if (steamId) {
            // Now you have the SteamID. You can store it, use it, etc.
            res.status(200).send(`Your SteamID is: ${steamId}`);
        } else {
            res.status(500).send('Could not extract SteamID');
        }
    });
}
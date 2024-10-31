import openid from 'openid';

const relyingParty = new openid.RelyingParty(
    'http://localhost:3000/api/auth/steam/return', // Return URL (must match exactly the URL in Steam settings)
    'http://localhost:3000/',                      // Realm (the part of URL before the return URL)
    true,                                          // Use HTTPS
    false,                                         // Strict mode (true for production)
    []                                             // Extensions (none in this case)
);

export default function handler(req, res) {
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (error, authUrl) => {
        if (error) {
            res.status(500).send('Authentication failed: ' + error);
        } else if (!authUrl) {
            res.status(500).send('Authentication failed.');
        } else {
            res.redirect(authUrl);
        }
    });
}
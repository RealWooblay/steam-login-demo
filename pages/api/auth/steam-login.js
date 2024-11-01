export default function handler(req, res) {
    const loginUrlParams = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': 'http://localhost:3000/api/auth/steam-callback', // Adjust to your redirect URL
        'openid.realm': `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    const steamLoginUrl = `https://steamcommunity.com/openid/login?${loginUrlParams.toString()}`;
    res.redirect(steamLoginUrl);
}
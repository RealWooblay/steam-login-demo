export default async function handler(req, res) {
    const currentUrl = new URL(req.url, `http://${req.headers.host}`);
    const openid_assoc_handle = currentUrl.searchParams.get('openid.assoc_handle');
    const openid_signed = currentUrl.searchParams.get('openid.signed');
    const openid_sig = currentUrl.searchParams.get('openid.sig');
    const openid_claimed_id = currentUrl.searchParams.get('openid.claimed_id');

    // Log to confirm each parameter is correctly extracted
    console.log('openid_assoc_handle:', openid_assoc_handle);
    console.log('openid_signed:', openid_signed);
    console.log('openid_sig:', openid_sig);
    console.log('openid_claimed_id:', openid_claimed_id);

    if (!openid_signed) {
        return res.status(400).send('Missing required OpenID parameters.');
    }

    // Construct validation parameters
    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'check_authentication',
        'openid.assoc_handle': openid_assoc_handle,
        'openid.signed': openid_signed,
        'openid.sig': openid_sig
    });

    openid_signed.split(',').forEach(item => {
        const value = currentUrl.searchParams.get(`openid.${item.replace('.', '_')}`);
        params.append(`openid.${item}`, value);
    });

    // Validate with Steam
    const response = await fetch('https://steamcommunity.com/openid/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    const resultText = await response.text();
    if (/is_valid\s*:\s*true/i.test(resultText)) {
        const steamIDMatch = openid_claimed_id.match(/https:\/\/steamcommunity.com\/openid\/id\/(\d+)/);
        const steamID64 = steamIDMatch ? steamIDMatch[1] : null;

        if (steamID64) {
            console.log('Steam ID:', steamID64);
            return res.status(200).json({ steamID64 });
        } else {
            return res.status(400).send('Unable to extract Steam ID.');
        }
    } else {
        res.status(401).send('Steam OpenID verification failed.');
    }
}
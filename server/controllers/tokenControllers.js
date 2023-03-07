async function verifyToken(req, res) {
    const { access_token, user_id } = req.cookies
    const result = await verifyTokenLogic(access_token, user_id);
    if (result.tokenRegenerated) {
        res.cookie('access_token', result.newAccessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'strict', secure: true });
        return res.status(200).json({ message: 'Token has been regenerated' });
    } else if (result.validToken) {
        return res.status(200).json({ message: `Token validity confirmed`, user: result.user });
    } else {
        return res.status(401).json({ message: result.error || 'Unauthorized HTTP.' });
    }
}
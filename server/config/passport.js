const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {

            let user = await prisma.user.findUnique({
                where: { googleId: profile.id }
            });

            if (!user) {

                const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

                if (email) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: email }
                    });

                    if (existingUser) {

                        user = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                googleId: profile.id,

                            }
                        });
                    } else {

                        user = await prisma.user.create({
                            data: {
                                googleId: profile.id,
                                email: email,
                                name: profile.displayName,
                                authProvider: 'GOOGLE'
                            }
                        });
                    }
                } else {

                    return done(new Error("No email found in Google Profile"), null);
                }
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

module.exports = passport;

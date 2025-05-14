package util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

public class JWTUtil {
    // Secret key JWT za potpis
    private static final String SECRET = "your-secret-key-should-be-very-long-and-secure";

    // JWT expiration time (1 dan u milisekundama)
    private static final long EXPIRATION_TIME = 86400000;

    // Algorithm for signing the JWT
    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    // JWT verifier
    private static final JWTVerifier verifier = JWT.require(algorithm).build();

    // Generate a JWT token for a user
    public static String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    // Verify and decode a JWT token
    public static String verifyToken(String token) throws JWTVerificationException {
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getSubject();
    }
}

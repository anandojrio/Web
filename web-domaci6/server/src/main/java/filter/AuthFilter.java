package filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import util.JWTUtil;

import java.io.IOException;

@Provider
@Secured
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // uzima authorization header iz requesta
        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // authentikacija
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            abortWithUnauthorized(requestContext, "Authorization header is missing or invalid");
            return;
        }

        // uzima token koji se proverava
        String token = authHeader.substring(BEARER_PREFIX.length()).trim();

        try {
            // validacija tokena
            String username = JWTUtil.verifyToken(token);

            // Set the user as a request property
            requestContext.setProperty("username", username);
        } catch (JWTVerificationException e) {
            System.out.println("JWT Verification failed: " + e.getMessage());
            abortWithUnauthorized(requestContext, "Invalid token: " + e.getMessage());
        }
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        // Abort the request with a 401 Unauthorized status code
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(message)
                        .build());
    }
}

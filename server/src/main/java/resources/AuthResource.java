package resources;

import at.favre.lib.crypto.bcrypt.BCrypt;
import dto.LoginRequest;
import dto.LoginResponse;
import dto.RegisterRequest;
import entities.User;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repositories.UserRepository;
import util.JWTUtil;

@Path("/auth")
public class AuthResource {
    private UserRepository userRepository = UserRepository.getInstance();

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(RegisterRequest request) {
        // Validate request
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username and password are required").build();
        }

        // Check if username already exists
        if (userRepository.usernameExists(request.getUsername())) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Username already exists").build();
        }

        // Hash the password with BCrypt
        String hashedPassword = BCrypt.withDefaults()
                .hashToString(12, request.getPassword().toCharArray());

        // Create and save the user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(hashedPassword);

        try {
            userRepository.createUser(user);

            // Generate JWT token for the new user
            String token = JWTUtil.generateToken(user.getUsername());
            LoginResponse response = new LoginResponse(token, user.getUsername());

            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating user: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        // Validate request
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username and password are required").build();
        }

        // Find the user by username
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid username or password").build();
        }

        // Verify the password
        BCrypt.Result result = BCrypt.verifyer()
                .verify(request.getPassword().toCharArray(), user.getPassword());

        if (!result.verified) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid username or password").build();
        }

        // Generate JWT token
        String token = JWTUtil.generateToken(user.getUsername());
        LoginResponse response = new LoginResponse(token, user.getUsername());

        return Response.ok(response).build();
    }
}

package resources;

import entities.Post;
import filter.Secured;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.container.ContainerRequestContext;
import repositories.PostRepository;

@Path("/posts")
public class PostResource {
    private PostRepository repository = PostRepository.getInstance();

    @Context
    private ContainerRequestContext requestContext;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPosts() {
        return Response.ok(repository.getAllPosts()).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Secured // Require authentication
    public Response createPost(Post post) {
        // get username from JWT token koji AuthFilter stavi
        String username = (String) requestContext.getProperty("username");
        if (username == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        post.setAuthor(username);  // automatski setuje authora
        Post created = repository.createPost(post);
        return Response.status(201).entity(created).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostById(@PathParam("id") int id) {
        Post post = repository.getPostById(id);
        if (post == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(post).build();
    }
}

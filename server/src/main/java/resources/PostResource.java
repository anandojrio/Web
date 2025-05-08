package resources;

import entities.Post;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repositories.PostRepository;

@Path("/posts")
public class PostResource {
    private PostRepository repository = PostRepository.getInstance();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPosts() {
        return Response.ok(repository.getAllPosts()).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(Post post) {
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

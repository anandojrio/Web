package blog.resource;

import blog.model.Post;
import blog.repository.PostRepository;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/posts")
public class PostResource {
    private PostRepository repository = PostRepository.getInstance();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Post> getAllPosts() {
        return repository.getAllPosts();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPost(@PathParam("id") int id) {
        Post post = repository.getPost(id);
        if (post != null) {
            return Response.ok(post).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(Post post) {
        Post created = repository.createPost(post);
        return Response.status(Response.Status.CREATED)
                .entity(created)
                .build();
    }
}

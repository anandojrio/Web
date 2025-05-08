package resources;

import entities.Comment;
import entities.Post;
import filter.Secured;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.container.ContainerRequestContext;
import repositories.PostRepository;

@Path("/posts/{postId}/comments")
public class CommentResource {
    private PostRepository repository = PostRepository.getInstance();

    @Context
    private ContainerRequestContext requestContext;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Secured // Require authentication
    public Response addComment(
            @PathParam("postId") int postId,
            Comment comment
    ) {
        Post post = repository.getPostById(postId);
        if (post == null) {
            return Response.status(404).entity("Post not found").build();
        }

        // Get username from JWT token
        String username = (String) requestContext.getProperty("username");
        if (username == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        comment.setPostId(postId);
        comment.setAuthor(username);  // Set author automatically
        post.addComment(comment);
        return Response.status(201).entity(comment).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComments(@PathParam("postId") int postId) {
        Post post = repository.getPostById(postId);
        if (post == null) {
            return Response.status(404).build();
        }
        return Response.ok(post.getComments()).build();
    }
}

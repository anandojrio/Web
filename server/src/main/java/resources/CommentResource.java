package resources;

import entities.Comment;
import entities.Post;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repositories.PostRepository;

@Path("/posts/{postId}/comments")
public class CommentResource {
    private PostRepository repository = PostRepository.getInstance();

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addComment(
            @PathParam("postId") int postId,
            Comment comment
    ) {
        Post post = repository.getPost(postId);
        if (post == null) {
            return Response.status(404).entity("Post not found").build();
        }

        comment.setPostId(postId);
        post.addComment(comment);
        return Response.status(201).entity(comment).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComments(@PathParam("postId") int postId) {
        Post post = repository.getPost(postId);
        if (post == null) {
            return Response.status(404).build();
        }
        return Response.ok(post.getComments()).build();
    }
}

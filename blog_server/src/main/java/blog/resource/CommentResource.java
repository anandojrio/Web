package blog.resource;

import blog.model.Comment;
import blog.repository.PostRepository;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/posts/{postId}/comments")
public class CommentResource {
    private PostRepository repository = PostRepository.getInstance();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Comment> getComments(@PathParam("postId") int postId) {
        return (List<Comment>) repository.getComments(postId);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addComment(@PathParam("postId") int postId, Comment comment) {
        Comment created = repository.addComment(postId, comment);
        if (created != null) {
            return Response.status(Response.Status.CREATED)
                    .entity(created)
                    .build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Post with ID " + postId + " not found")
                    .build();
        }
    }
}

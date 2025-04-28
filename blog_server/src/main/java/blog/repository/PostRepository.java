package blog.repository;

import blog.model.Comment;
import blog.model.Post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostRepository {
    private static PostRepository instance = new PostRepository();
    private Map<Integer, Post> posts = new HashMap<>();

    // Private constructor for singleton
    private PostRepository() {
        // Add a sample post for testing
        Post post = new Post("Welcome to the Blog", "Admin", "This is your first post!");
        posts.put(post.getId(), post);
    }

    public static PostRepository getInstance() {
        return instance;
    }

    public List<Post> getAllPosts() {
        return new ArrayList<>(posts.values());
    }

    public Post getPost(int id) {
        return posts.get(id);
    }

    public Post createPost(Post post) {
        // Ensure post has an ID and date
        if (post.getId() == 0) {
            post = new Post(post.getTitle(), post.getAuthor(), post.getContent());
        }
        posts.put(post.getId(), post);
        return post;
    }

    public Comment addComment(int postId, Comment comment) {
        Post post = posts.get(postId);
        if (post != null) {
            comment.setPostId(postId);
            post.addComment((org.w3c.dom.Comment) comment);
            return comment;
        }
        return null;
    }

    public List<? extends Object> getComments(int postId) {
        Post post = posts.get(postId);
        return post != null ? post.getComments() : new ArrayList<>();
    }
}

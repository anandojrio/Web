package repositories;

import entities.Comment;
import entities.Post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostRepository {
    private static PostRepository instance = new PostRepository();
    private Map<Integer, Post> posts = new HashMap<>();

    public static PostRepository getInstance() {
        return instance;
    }

    public List<Post> getAllPosts() {
        return new ArrayList<>(posts.values());
    }

    public Post getPost(int id) {
        return posts.get(id);
    }

    // PostRepository.java
    public Comment addComment(int postId, Comment comment) {
        Post post = posts.get(postId);
        if (post != null) {
            comment.setPostId(postId);
            post.addComment(comment);
            return comment;
        }
        return null;
    }


    public Post createPost(Post post) {
        post.setId(posts.size() + 1);
        posts.put(post.getId(), post);
        return post;
    }
}

package repositories;

import entities.Comment;
import entities.Post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostRepository {
    // singlton
    private static PostRepository instance = new PostRepository();
    public static PostRepository getInstance() {
        return instance;
    }
    //lista svih
    private Map<Integer, Post> posts = new HashMap<>();

    //prikaz svih
    public List<Post> getAllPosts() {
        return new ArrayList<>(posts.values());
    }

    //prikaz jednog posta
    public Post getPostById(int id) {
        return posts.get(id);
    }

    //novi komentar
    public Comment addComment(int postId, Comment comment) {
        Post post = posts.get(postId);
        if (post != null) {
            comment.setPostId(postId);
            post.addComment(comment);
            return comment;
        }
        return null;
    }


    //novi post
    public Post createPost(Post post) {
        post.setId(posts.size() + 1);
        posts.put(post.getId(), post);
        return post;
    }
}

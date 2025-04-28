package blog.model;

import java.util.Date;

public class Comment {
    private static int nextId = 1;

    private int id;
    private int postId;
    private String author;
    private String content;
    private Date date;

    public Comment() {
        this.id = nextId++;
        this.date = new Date();
    }

    public Comment(int postId, String author, String content) {
        this();
        this.postId = postId;
        this.author = author;
        this.content = content;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPostId() { return postId; }
    public void setPostId(int postId) { this.postId = postId; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
}

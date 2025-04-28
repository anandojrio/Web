package blog.model;

import org.w3c.dom.Comment;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Post {
    private static int nextId = 1;

    private int id;
    private String title;
    private String author;
    private String content;
    private Date date;
    private List<Comment> comments;

    public Post() {
        this.id = nextId++;
        this.date = new Date();
        this.comments = new ArrayList<>();
    }

    public Post(String title, String author, String content) {
        this();
        this.title = title;
        this.author = author;
        this.content = content;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }
}

package blog;

import blog.filter.CORSFilter;
import blog.resource.CommentResource;
import blog.resource.PostResource;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api") // Base URI for all REST endpoints
public class BlogApplication extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        // Register resource classes
        classes.add(PostResource.class);
        classes.add(CommentResource.class);
        // Register filters
        classes.add(CORSFilter.class);
        return classes;
    }
}

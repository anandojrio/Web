import filter.CORSFilter;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import resources.CommentResource;
import resources.PostResource;

import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class BlogApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(PostResource.class);
        classes.add(CommentResource.class);
        classes.add(CORSFilter.class);
        return classes;
    }
}

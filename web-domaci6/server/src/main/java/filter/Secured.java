package filter;

import jakarta.ws.rs.NameBinding;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

// REQUIRE AUTHENTICATION

@NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({TYPE, METHOD})
public @interface Secured {
}

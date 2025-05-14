package util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class DatabaseUtil {
    private static final String PERSISTENCE_UNIT_NAME = "blog-pu";
    private static EntityManagerFactory emf;

    static {
        try {
            // Load database
            Properties dbProps = new Properties();
            InputStream is = DatabaseUtil.class.getClassLoader().getResourceAsStream("database.properties");
            if (is != null) {
                dbProps.load(is);
                is.close();
            } else {
                System.err.println("Could not find database.properties");
            }

            // Create persistence properties map
            Map<String, String> properties = new HashMap<>();
            properties.put("jakarta.persistence.jdbc.driver", "org.mariadb.jdbc.Driver");
            properties.put("jakarta.persistence.jdbc.url", "jdbc:mariadb://localhost:3306/blog_db?createDatabaseIfNotExist=true");
            properties.put("jakarta.persistence.jdbc.user", "root");
            properties.put("jakarta.persistence.jdbc.password", "Nopussies7");


            // Create EntityManagerFactory with properties
            emf = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME, properties);
        } catch (IOException e) {
            throw new RuntimeException("Error initializing database connection", e);
        }
    }

    public static EntityManager createEntityManager() {
        return emf.createEntityManager();
    }

    public static void closeEntityManagerFactory() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}


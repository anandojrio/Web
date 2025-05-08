package repositories;

import entities.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import util.DatabaseUtil;

public class UserRepository {
    // Singleton pattern
    private static UserRepository instance = new UserRepository();

    public static UserRepository getInstance() {
        return instance;
    }

    private UserRepository() {
        // Private constructor for singleton
    }

    // Create a new user
    public User createUser(User user) {
        EntityManager em = DatabaseUtil.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(user);
            em.getTransaction().commit();
            return user;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    // Find user by username
    public User findByUsername(String username) {
        EntityManager em = DatabaseUtil.createEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE u.username = :username", User.class);
            query.setParameter("username", username);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }

    // Check if username already exists
    public boolean usernameExists(String username) {
        return findByUsername(username) != null;
    }

    // Get user by ID
    public User findById(Integer id) {
        EntityManager em = DatabaseUtil.createEntityManager();
        try {
            return em.find(User.class, id);
        } finally {
            em.close();
        }
    }
}

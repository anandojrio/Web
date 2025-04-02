package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "adminServlet", value = "/admin")
public class AdminServlet extends HttpServlet {

    private String validPassword;
    private Map<String, Map<String, String>> orders;

    @Override
    public void init() throws ServletException {
        ServletContext ctx = getServletContext();
        validPassword = (String) ctx.getAttribute("adminPassword");
        orders = (ConcurrentHashMap<String, Map<String, String>>) ctx.getAttribute("orders");

        if (validPassword == null || orders == null) {
            throw new ServletException("Failed to initialize. Ensure AppInitializer is correctly set up.");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String submittedPassword = request.getParameter("lozinka");
        if (!validPassword.equals(submittedPassword)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
            return;
        }

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Admin Dashboard</title></head>");
        out.println("<body>");
        out.println("<h1>Admin Dashboard</h1>");

        if (orders.isEmpty()) {
            out.println("<p>No orders have been placed yet.</p>");
        } else {
            out.println("<h2>Orders:</h2>");
            orders.forEach((sessionId, selections) -> {
                out.println("<p><strong>Session ID:</strong> " + sessionId + "</p>");
                out.println("<ul>");
                selections.forEach((day, meal) -> out.println("<li>" + day + ": " + meal + "</li>"));
                out.println("</ul>");
            });
        }

        out.println("<form method='POST'>");
        out.println("<button type='submit'>Reset All Orders</button>");
        out.println("</form>");

        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        orders.clear();
        response.sendRedirect("/admin?lozinka=" + request.getParameter("lozinka"));
    }
}

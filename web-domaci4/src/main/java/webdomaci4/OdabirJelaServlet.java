package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "odabirJelaServlet", value = "/select-meals")
public class OdabirJelaServlet extends HttpServlet {

    private Map<String, List<String>> weeklyMeals;
    private Map<String, Map<String, String>> orders;

    @Override
    public void init() throws ServletException {
        ServletContext ctx = getServletContext();
        weeklyMeals = (Map<String, List<String>>) ctx.getAttribute("weeklyMeals");
        orders = (ConcurrentHashMap<String, Map<String, String>>) ctx.getAttribute("orders");

        if (weeklyMeals == null || orders == null) {
            throw new ServletException("Failed to initialize. Ensure AppInitializer is correctly set up.");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = request.getSession();
        if (session.getAttribute("selectedMeals") != null) {
            response.sendRedirect("potvrda.html");
            return;
        }

        request.setAttribute("weeklyMeals", weeklyMeals);
        request.getRequestDispatcher("meal-selection.html").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(true);
        if (session.getAttribute("selectedMeals") != null) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Order already submitted");
            return;
        }

        Map<String, String> userSelections = new HashMap<>();
        weeklyMeals.keySet().forEach(day -> {
            String meal = request.getParameter(day);
            if (meal != null) {
                userSelections.put(day, meal);
            }
        });

        orders.put(session.getId(), userSelections);
        session.setAttribute("selectedMeals", userSelections);

        response.sendRedirect("potvrda.html");
    }
}

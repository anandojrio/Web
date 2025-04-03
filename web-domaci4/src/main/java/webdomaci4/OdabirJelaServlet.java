package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
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

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Meal Selection</title>");
        out.println("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
        out.println("<style>");
        out.println("body { font-family: Arial, sans-serif; font-size: 18px; padding: 20px; }");
        out.println(".container { max-width: 600px; margin: 0 auto; }");
        out.println("h1 { text-align: center; margin-bottom: 30px; }");
        out.println(".form-group { margin-bottom: 25px; }");
        out.println("label { font-weight: bold; margin-bottom: 10px; display: block; }");
        out.println(".submit-btn { margin-top: 30px; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<div class=\"container\">");
        out.println("<h1>Odaberite vas rucak:</h1>");
        out.println("<form method=\"POST\" action=\"/select-meals\">");

        // Generate dropdown for each day with its meals
        for (String day : weeklyMeals.keySet()) {
            out.println("<div class=\"form-group\">");
            out.println("<label for=\"" + day.toLowerCase() + "\">" + day + ":</label>");
            out.println("<select id=\"" + day.toLowerCase() + "\" name=\"" + day + "\" class=\"form-select form-select-lg\">");

            List<String> meals = weeklyMeals.get(day);
            for (String meal : meals) {
                out.println("<option value=\"" + meal + "\">" + meal + "</option>");
            }

            out.println("</select>");
            out.println("</div>");
        }

        out.println("<div class=\"text-center\">");
        out.println("<button type=\"submit\" class=\"btn btn-primary btn-lg submit-btn\">Submit</button>");
        out.println("</div>");
        out.println("</form>");
        out.println("</div>");
        out.println("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js\"></script>");
        out.println("</body></html>");
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

        synchronized (orders) {
            orders.put(session.getId(), userSelections);
        }
        session.setAttribute("selectedMeals", userSelections);

        response.sendRedirect("potvrda.html");
    }
}


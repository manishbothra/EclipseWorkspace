import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/Demo")
public class Demo extends HttpServlet{
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		
		String name="Manish";
		request.setAttribute("name",name);
		RequestDispatcher rd=request.getRequestDispatcher("file.jsp");
		rd.forward(request, response);
	}
}

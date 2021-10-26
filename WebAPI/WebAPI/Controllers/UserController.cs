using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string sqlDataSource;
        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
            sqlDataSource = _configuration.GetConnectionString("CrmAppCon");
        }


        public JsonResult GetQuery(string query)
        {
            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }

        public JsonResult ChangeDatabase(string query, string message)
        {
            SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(message);
        }


        [Route("GetAllUsers")]
        [HttpGet]
        public JsonResult GetAllUsers()
        {
            string query = "SELECT u.id AS 'id', u.name AS 'name', surname, CONVERT(varchar(10), dateOfBirth, 120) AS dateOfBirth, login, password, role AS 'roleId', isDeleted, roleName AS 'roleName' " +
                            "FROM dbo.Users AS u " +
                                "JOIN dbo.Roles AS r " +
                                    "ON r.id = u.role";
            
            return GetQuery(query);
        }

        [Route("GetOnlyAvailableUsers")]
        [HttpGet]
        public JsonResult GetOnlyAvailableUsers()
        {
            string query = "SELECT u.id AS 'id', u.name AS 'name', surname, CONVERT(varchar(10), dateOfBirth, 120) AS dateOfBirth, login, password, role AS 'roleId', isDeleted, roleName AS 'roleName' " +
                            "FROM dbo.Users AS u " +
                                "JOIN dbo.Roles AS r " +
                                    "ON r.id = u.role " +
                            "WHERE isDeleted=0";

            return GetQuery(query);
        }

        [Route("GetUserWithIdenticalLogin")]
        [HttpGet]
        public JsonResult GetUserWithIdenticalLogin(User user)
        {
            string query =  "SELECT id " +
                            "FROM dbo.Users " +
                            "WHERE login LIKE '" + user.login + "'";

            return GetQuery(query);
        }

        [Route("AddNewUser")]
        [HttpPost]
        public JsonResult AddNewUser(User user)
        {
            string query =  "INSERT INTO dbo.Users VALUES " +
                            "('" + user.name + "', '" + user.surname + "', '" + DateService.TransformDateToString(user.dateOfBirth) + 
                                "', '" + user.login + "', '" + user.password + "', DEFAULT, DEFAULT)";

            return ChangeDatabase(query, "Successfully added user!");
            
        }

        [Route("DeleteUser")]
        [HttpPut]
        public JsonResult DeleteUser(User user)
        {
            string query =  "UPDATE dbo.Users " +
                            "SET isDeleted = 1 " +
                            "WHERE id = " + user.id;

            return ChangeDatabase(query, "Successfully deleted user!");
        }

        [Route("RestoreUser")]
        [HttpPut]
        public JsonResult RestoreUser(User user)
        {
            string query = "UPDATE dbo.Users " +
                            "SET isDeleted = 0 " +
                            "WHERE id = " + user.id;

            return ChangeDatabase(query, "Successfully restored user!");
        }

        [Route("EditUser")]
        [HttpPut]
        public JsonResult EditUser(User user)
        {
            string query =  "UPDATE dbo.Users " +
                            "SET name = '" + user.name + "', " +
                                "surname = '" + user.surname + "', " +
                                "dateOfBirth = '" + DateService.TransformDateToString(user.dateOfBirth) + "', " +
                                "login = '" + user.login + "', " +
                                "role = " + user.role + " " +
                            "WHERE id = " + user.id;

            return ChangeDatabase(query, "Successfully edited user!");
        }
    }
}

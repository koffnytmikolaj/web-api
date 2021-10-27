using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
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
                            "WHERE login LIKE '" + user.Login + "'";

            return GetQuery(query);
        }

        [Route("AddNewUser")]
        [HttpPost]
        public JsonResult AddNewUser(User user)
        {
            Dictionary<string, bool> correctDataArray = UserVerificationService.VerifyUser(user, sqlDataSource);
            if (!UserVerificationService.VerifyTable(correctDataArray))
                return new JsonResult(JsonConvert.SerializeObject(correctDataArray, Formatting.Indented));

            string query =  "INSERT INTO dbo.Users VALUES " +
                            "('" + user.Name + "', '" + user.Surname + "', '" + DateService.TransformDateToString(user.DateOfBirth) + 
                                "', '" + user.Login + "', '" + user.Password + "', DEFAULT, DEFAULT)";

            return ChangeDatabase(query, "Successfully added user!");
            
        }

        [Route("DeleteUser")]
        [HttpPut]
        public JsonResult DeleteUser(User user)
        {
            string query =  "UPDATE dbo.Users " +
                            "SET isDeleted = 1 " +
                            "WHERE id = " + user.Id;

            return ChangeDatabase(query, "Successfully deleted user!");
        }

        [Route("RestoreUser")]
        [HttpPut]
        public JsonResult RestoreUser(User user)
        {
            string query = "UPDATE dbo.Users " +
                            "SET isDeleted = 0 " +
                            "WHERE id = " + user.Id;

            return ChangeDatabase(query, "Successfully restored user!");
        }

        [Route("EditUser")]
        [HttpPut]
        public JsonResult EditUser(User user)
        {
            string query =  "UPDATE dbo.Users " +
                            "SET name = '" + user.Name + "', " +
                                "surname = '" + user.Surname + "', " +
                                "dateOfBirth = '" + DateService.TransformDateToString(user.DateOfBirth) + "', " +
                                "login = '" + user.Login + "', " +
                                "role = " + user.Role + " " +
                            "WHERE id = " + user.Id;

            return ChangeDatabase(query, "Successfully edited user!");
        }
    }
}

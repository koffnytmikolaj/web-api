using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
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

        [Route("GetAllUsers")]
        [HttpGet]
        public JsonResult Get()
        {
            string query = "SELECT u.id AS 'id', u.name AS 'name', surname, CONVERT(varchar(10), dateOfBirth, 120) AS dateOfBirth, login, password, role AS 'roleId', isDeleted, roleName AS 'roleName' " +
                            "FROM dbo.Users AS u " +
                                "JOIN dbo.Roles AS r " +
                                    "ON r.id = u.role";
            
            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
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

            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }

        [Route("GetUserWithIdenticalLogin")]
        [HttpGet]
        public JsonResult GetUserWithIdenticalLogin(User user)
        {
            string query =  "SELECT id " +
                            "FROM dbo.Users " +
                            "WHERE login LIKE '" + user.login + "'";

            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(User user)
        {
            string query =  "INSERT INTO dbo.Users VALUES " +
                            "('" + user.name + "', '" + user.surname + "', '" + DateService.TransformDateToString(user.dateOfBirth) + 
                                "', '" + user.login + "', '" + user.password + "', DEFAULT, DEFAULT)";

            SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult("Successfully added user!");
        }

        [Route("DeleteUser")]
        [HttpPut]
        public JsonResult DeleteUser(User user)
        {
            string query =  "ALTER TABLE dbo.Users " +
                            "SET isDeleted=1 " +
                            "WHERE id=" + user.id;

            SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult("Successfully deleted user!");
        }
    }
}

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

        [HttpGet]
        public JsonResult Get()
        {
            string query =  "SELECT id, name, surname, CONVERT(varchar(10), dateOfBirth, 120) AS dateOfBirth, login, password, role, isDeleted " +
                            "FROM dbo.Users";
            
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
    }
}

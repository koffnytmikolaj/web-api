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
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query =  "SELECT id, name, surname, CONVERT(varchar(10), dateOfBirth, 120) AS dateOfBirth, login, password, role, isDeleted " +
                            "FROM dbo.Users";
            string sqlDataSource = _configuration.GetConnectionString("CrmAppCon");
            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }
    }
}

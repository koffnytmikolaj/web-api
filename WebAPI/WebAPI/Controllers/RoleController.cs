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
    public class RoleController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string sqlDataSource;
        public RoleController(IConfiguration configuration)
        {
            _configuration = configuration;
            sqlDataSource = _configuration.GetConnectionString("CrmAppCon");
        }

        [Route("GetRoles")]
        [HttpGet]
        public JsonResult GetRoles()
        {
            string query =  "SELECT id, roleName " +
                            "FROM dbo.Roles";

            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using WebAPI.Helpers;
using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public RoleController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [Route("GetRoles")]
        [HttpGet]
        public JsonResult GetRoles()
        {
            ICollection<Role> roles = _context.Roles.ToList();
            return new JsonResult(roles);
        }

        [Route("AddNewRole")]
        [HttpPost]
        public JsonResult AddNewRole(Role role)
        {
            _context.Roles.Add(role);
            _context.SaveChanges();
            return new JsonResult("Successfully added role!");
        }

        [Route("AddNewRoles")]
        [HttpPost]
        public JsonResult AddNewRoles(ICollection<Role> roles)
        {
            foreach(Role role in roles)
            {
                AddNewRole(role);
            }
            return new JsonResult("Successfully added roles!");
        }
    }
}

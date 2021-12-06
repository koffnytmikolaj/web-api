using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using DataAccessLibrary.Models;
using WebAPI.Helpers;
using Microsoft.EntityFrameworkCore;
using DataAccessLibrary.DataAccess;
using System.Linq;
using System;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string sqlDataSource;
        private readonly AppDbContext _context;
        public UserController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            sqlDataSource = _configuration.GetConnectionString("CrmAppCon");
            _context = context;
        }


        public JsonResult GetQuery(string query)
        {
            DataTable table = SqlHelper.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(table);
        }

        public JsonResult ChangeDatabase(string query, string message)
        {
            SqlHelper.ExecuteSqlTable(sqlDataSource, query);
            return new JsonResult(message);
        }


        [Route("GetAllUsers")]
        [HttpGet]
        public JsonResult GetAllUsers()
        {
            //var users = _context.Users.ToList();
            var users = _context.Users.ToList();
            return new JsonResult(users);
        }

        [Route("GetOnlyAvailableUsers")]
        [HttpGet]
        public JsonResult GetOnlyAvailableUsers()
        {
            var users = _context.Users.Where(user => user.IsDeleted == false).ToList();
            return new JsonResult(users);
        }

        [Route("GetUserWithIdenticalLogin")]
        [HttpGet]
        public JsonResult GetUserWithIdenticalLogin(User newUser)
        {
            /*string query =  "SELECT id " +
                            "FROM dbo.Users " +
                            "WHERE login LIKE '" + user.Login + "'";

            return GetQuery(query);*/

            var user = _context.Users.Where(u => u.Login == newUser.Login).First();
            return new JsonResult(user);
        }

        [Route("AddNewUser")]
        [HttpPost]
        public JsonResult AddNewUser(User user)
        {
            /*
            string query =  "INSERT INTO dbo.Users VALUES " +
                            "('" + user.Name + "', '" + user.Surname + "', '" + DateHelper.TransformDateToString(user.DateOfBirth) + 
                                "', '" + user.Login + "', '" + user.Password + "', DEFAULT, DEFAULT)";*/

            _context.Users.Add(user);
            return new JsonResult("Successfully added user!");
            
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
                                "dateOfBirth = '" + DateHelper.TransformDateToString(user.DateOfBirth) + "', " +
                                "login = '" + user.Login + "', " +
                                "role = " + user.Role + " " +
                            "WHERE id = " + user.Id;

            return ChangeDatabase(query, "Successfully edited user!");
        }
    }
}

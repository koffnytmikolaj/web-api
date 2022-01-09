using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using DataAccessLibrary.Models.User;
using DataAccessLibrary.Models;
using WebAPI.Helpers;
using Microsoft.EntityFrameworkCore;
using DataAccessLibrary.DataAccess;
using System.Linq;
using System;
using Microsoft.AspNetCore.Http;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        private readonly int usersPerPage = 6;

        public UserController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }


        [Route("GetAllUsers")]
        [HttpGet]
        public JsonResult GetAllUsers(int page = 1)
        {
            ICollection<Role> roles = _context.Roles.ToList();
            var users = _context.Users.ToList().Join(
                roles,
                u => u.RoleId,
                r => r.RoleId,
                (user, role) => new 
                {
                    user.UserId, 
                    user.Name, 
                    user.Surname, 
                    DateOfBirth = DateHelper.TransformDateToString(user.DateOfBirth), 
                    user.Login,
                    user.RoleId, 
                    role.RoleName, 
                    user.IsDeleted
                }
            )
                .Skip((page - 1) * usersPerPage)
                .Take(usersPerPage);

            return new JsonResult(users);
        }

        [Route("GetAvailableUsers")]
        [HttpGet]
        public JsonResult GetOnlyAvailableUsers(int page = 1)
        {

            ICollection<Role> roles = _context.Roles.ToList();
            var users = _context.Users.ToList().Join(
                roles,
                u => u.RoleId,
                r => r.RoleId,
                (user, role) => new 
                {
                    user.UserId, 
                    user.Name, 
                    user.Surname, 
                    DateOfBirth = DateHelper.TransformDateToString(user.DateOfBirth), 
                    user.Login,
                    user.RoleId, 
                    role.RoleName, 
                    user.IsDeleted
                }
            )
                .Where(user => user.IsDeleted == false)
                .Skip((page - 1) * usersPerPage)
                .Take(usersPerPage);

            return new JsonResult(users);
        }

        [Route("GetNumberOfPages")]
        [HttpGet]
        public JsonResult GetNumberOfPages(bool all = false)
        {
            int numberOfUsers = all 
                ? _context.Users.Count() 
                : _context.Users.Where(u => u.IsDeleted == false).Count();
            int additionalPage =
                numberOfUsers % usersPerPage == 0
                ? 0
                : 1;

            return new JsonResult(numberOfUsers / usersPerPage + additionalPage);
        }

        [Route("ChangePassword")]
        [HttpPut]
        public JsonResult ChangePassword(UserPasswordChange user)
        {
            try
            {
                User editedUser = LoginHelper.TryLogIn(_context, user, false);
                string passwordVerification = UserVerificationHelper.IsNewPasswordCorrect(user.NewPassword);
                if (string.IsNullOrEmpty(passwordVerification))
                {
                    editedUser.Password = BCrypt.Net.BCrypt.HashPassword(user.NewPassword);
                    _context.SaveChanges();
                }
                return new JsonResult(passwordVerification);
            }
            catch(Exception)
            {
                return new JsonResult("Wrong password!");
            }
        }

        [Route("AddNewUser")]
        [HttpPost]
        public JsonResult AddNewUser(UserRegistration user)
        {
            Dictionary<string, string> registrationTable = UserVerificationHelper.VerifyNewUser(user, _context);
            if(!UserVerificationHelper.VerifyTable(registrationTable))
                return new JsonResult(registrationTable);

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.RoleId = 1;
            user.IsDeleted = false;
            _context.Users.Add(user);
            _context.SaveChanges();
            return new JsonResult(1);
        }

        [Route("DeleteUser")]
        [HttpPut]
        public JsonResult DeleteUser(User user)
        {
            try
            {
                int deletingUserRole = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId;
                User deletedUser = _context.Users.Where(u => u.UserId == user.UserId).First();
                switch (deletedUser.RoleId)
                {
                    case 1:
                        if (deletingUserRole == 1)
                            throw new Exception();
                        break;
                    case 2:
                        if (deletingUserRole == 1 || deletingUserRole == 3)
                            throw new Exception();
                        break;
                    case 3:
                        if (deletingUserRole == 1 || deletingUserRole == 3)
                            throw new Exception();
                        break;
                    default:
                        throw new Exception();
                }
                deletedUser.Name = null;
                deletedUser.Surname = null;
                deletedUser.Password = null;
                deletedUser.IsDeleted = true;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch(Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("EditUser")]
        [HttpPut]
        public JsonResult EditUser(User user)
        {
            Dictionary<string, string> editionTable = UserVerificationHelper.VerifyUser(user);
            if (!UserVerificationHelper.VerifyTable(editionTable))
                return new JsonResult(editionTable);
            
            User editedUser = _context.Users.Where(u => u.UserId == user.UserId).First();
            editedUser.Surname = user.Surname;
            editedUser.DateOfBirth = user.DateOfBirth;
            editedUser.Name = user.Name;
            _context.SaveChanges();
            return new JsonResult(1);
        }

        [Route("ChangeRole")]
        [HttpPut]
        public JsonResult EditUserRole(User user)
        {
            try {
                int editingUserRole = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId;
                if (editingUserRole != 2)
                    throw new Exception();

                User editedUser = _context.Users.Where(u => u.UserId == user.UserId).First();
                editedUser.RoleId = user.RoleId;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch(Exception)
            {
                return new JsonResult(false);
            }
        }
    }
}

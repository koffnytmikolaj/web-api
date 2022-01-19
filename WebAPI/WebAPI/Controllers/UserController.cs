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
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public UserController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }


        
        [Route("tr")]
        [HttpPut]
        public JsonResult Tr(User user)
        {
            User testUser = _context.Users.Where(u => u.UserId == user.UserId).First();
            Role role = _context.Roles.Where(r => r.RoleId == testUser.RoleId).First();
            testUser.Role = role;
            _context.SaveChanges();
            return new JsonResult(_context.Users.ToList());
        }


        [Route("GetAllUsers")]
        [HttpGet]
        public JsonResult GetAllUsers()
        {
            ICollection<User> users = _context.Users.ToList();
            return new JsonResult(users);
        }

        [Route("GetAvailableUsers")]
        [HttpGet]
        public JsonResult GetAvailableUsers(int page = 1, string order = "", bool desc = false, string search = "")
        {
            //Get all available users
            ICollection<Role> roles = _context.Roles.ToList();
            var users = _context.Users
                .ToList().Join(
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
                .Where(user => user.IsDeleted == false);

            //Include order by and descending
            Type typeOfData = users.GetType().GetGenericArguments().Last();
            var orderProperty = typeOfData.GetProperty(order);
            if (orderProperty != null)
            {
                try
                {
                    if (desc)
                        users = users.OrderByDescending(u => orderProperty.GetValue(u, null));
                    else
                        users = users.OrderBy(u => orderProperty.GetValue(u, null));
                }
                catch (Exception) { }
            }
            else
            {
                if (desc)
                    users = users.OrderByDescending(u => u.UserId);
                else
                    users = users.OrderBy(u => u.UserId);
            }

            //Include search
            if(!string.IsNullOrEmpty(search))
            {
                users = users.Where(u =>
                
                    u.Name.ToLower().Contains(search.ToLower())
                    || u.Surname.ToLower().Contains(search.ToLower())
                    || u.Login.ToLower().Contains(search.ToLower())
                    || u.DateOfBirth.ToLower().Contains(search.ToLower())
                    || u.RoleName.ToLower().Contains(search.ToLower())
                );
            } //Pagination
            else
            {
                users = users
                    .Skip((page - 1) * ShowItems.itemsPerPage)
                    .Take(ShowItems.itemsPerPage);
            }
            

            return new JsonResult(users);
        }

        [Route("GetNumberOfPages")]
        [HttpGet]
        public JsonResult GetNumberOfPages(bool all = false)
        {
            try
            {
                int role = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId;
                if(role != 1 & role != 2 & role != 3)
                    throw new Exception();
                int numberOfUsers = all
                ? _context.Users.Count()
                : _context.Users.Where(u => u.IsDeleted == false).Count();
                int additionalPage =
                    numberOfUsers % ShowItems.itemsPerPage == 0
                    ? 0
                    : 1;

                return new JsonResult(numberOfUsers / ShowItems.itemsPerPage + additionalPage);
            }
            catch(Exception e)
            {
                return new JsonResult(e);
            }
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
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).UserId != user.UserId)
                    throw new Exception();
                Dictionary<string, string> editionTable = UserVerificationHelper.VerifyUser(user);
                if (!UserVerificationHelper.VerifyTable(editionTable))
                    return new JsonResult(editionTable);

                User editedUser = _context.Users.Where(u => u.UserId == user.UserId).First();
                editedUser.Surname = user.Surname;
                editedUser.DateOfBirth = user.DateOfBirth;
                editedUser.Name = user.Name;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch(Exception)
            {
                return new JsonResult(false);
            }
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

using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Helpers;
using WebAPI.Controllers;
using DataAccessLibrary.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public LoginController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }


        private ICollection<Role> GetRoles()
        {
            try
            {
                return _context.Roles.ToList();
            }
            catch(Exception)
            {
                return null;
            }
        }

        [HttpGet]
        public JsonResult GetUser()
        {
            try
            {
                int userId = LoginHelper.GetUserIdFromToken(Request.Cookies["jwt"], _jwtService);
                ICollection<Role> roles = GetRoles();
                var user = _context.Users.Where(u => u.UserId == userId).ToList().Join(
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
                );
                return new JsonResult(user);
            }
            catch (ArgumentNullException)
            {
                return new JsonResult(0);
            }
            catch(Exception)
            {
                return new JsonResult(-1);
            }
        }

        [HttpPost]
        public IActionResult LogIn(UserLogin user)
        {
            try
            {
                User currentUser = LoginHelper.TryLogIn(_context, user);
                string jwt = _jwtService.Generate(currentUser.UserId);

                Response.Cookies.Append("jwt", jwt, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = true
                });

                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest(false);
            }
        }

        [Route("logout")]
        [HttpGet]
        public IActionResult LogOut()
        {
            Response.Cookies.Delete("jwt");
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });
            return Ok(true);
        }
    }
}

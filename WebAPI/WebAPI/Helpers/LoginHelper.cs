using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models.User;
using System;
using System.Linq;

namespace WebAPI.Helpers
{
    static public class LoginHelper
    {
        static public User TryLogIn(AppDbContext _context, User user, bool newUser = true)
        {
            User currentUser = _context.Users.Where(u => u.Login == user.Login).First();
            if (!BCrypt.Net.BCrypt.Verify(user.Password, currentUser.Password))
                throw new InvalidOperationException();
            if(!newUser) {
                if (!currentUser.IsDeleted)
                    throw new Exception();
            }
            
            return currentUser;
        }

        static public int GetUserIdFromToken(string jwt, JwtService jwtService)
        {
            var token = jwtService.Verify(jwt);
            return int.Parse(token.Issuer);
        }

        static public User GetUserById(int id, AppDbContext context)
        {
            try
            {
                return context.Users.Where(user => user.UserId == id).First();
            }
            catch(Exception)
            {
                return null;
            }
        }

        static public User GetUserByCookie(string jwt, JwtService jwtService, AppDbContext context)
        {
            int userId = GetUserIdFromToken(jwt, jwtService);
            return GetUserById(userId, context);
        }
    }
}

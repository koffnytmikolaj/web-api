using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;
using System.Data;

namespace WebAPI.Services
{
    static public class UserVerificationService
    {
        private static readonly int Login_PasswordMinLength = 8;
        private static readonly int UserMinAgeInDays = 1000;
        
        private static bool IsLoginUnique(string login, string sqlDataSource)
        {
            string query =  "SELECT id " +
                            "FROM dbo.Users " +
                            "WHERE login LIKE '" + login + "'";

            DataTable table = SqlService.ExecuteSqlTable(sqlDataSource, query);
            return table.Rows.Count == 0;
        }

        private static bool IsPasswordEqualsPasswordRepeat(string password, string passwordRepeat)
        {
            return password == passwordRepeat;
        }

        private static bool IsStringLengthLongerOrEqualMinLength(string login)
        {
            return login.Length >= Login_PasswordMinLength;
        }

        private static bool IsDateCorrect(DateTime date)
        {
            return DateTime.Now.Subtract(date).TotalDays > UserMinAgeInDays;
        }

        private static bool WhetherStringStartsWithCapitalLetter(string str)
        {
            return char.IsUpper(str[0]);
        }

        public static bool VerifyTable(Dictionary<string, bool> correctDataArray)
        {
            foreach(KeyValuePair<string, bool> correctDataSegment in correctDataArray)
            {
                if (!correctDataSegment.Value)
                    return false;
            }
            return true;
        }

        public static Dictionary<string, bool> VerifyUser(User user, string sqlDataSource)
        {
            Dictionary<string, bool> correctDataArray = new();

            //Name
            correctDataArray.Add("name",            WhetherStringStartsWithCapitalLetter(user.Name));
            //Surname
            correctDataArray.Add("surname",         WhetherStringStartsWithCapitalLetter(user.Surname));
            //Date of birth
            correctDataArray.Add("date",            IsDateCorrect(user.DateOfBirth));
            //Login
            correctDataArray.Add("loginUniqueness", IsLoginUnique(user.Login, sqlDataSource));
            correctDataArray.Add("loginLength",     IsStringLengthLongerOrEqualMinLength(user.Login));
            //Password
            correctDataArray.Add("password",        IsStringLengthLongerOrEqualMinLength(user.Password));
            //Password repeat
            correctDataArray.Add("passwordRepeat",  IsPasswordEqualsPasswordRepeat(user.Password, user.PasswordRepeat));
            return correctDataArray;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;
using System.Data;

namespace WebAPI.Helpers
{
    static public class UserVerificationHelper
    {
        private static readonly int Login_PasswordMinLength = 8;
        private static readonly int UserMinAgeInDays = 1000;
        
        private static bool IsLoginUnique(string login, string sqlDataSource)
        {
            string query =  "SELECT id " +
                            "FROM dbo.Users " +
                            "WHERE login LIKE '" + login + "'";

            DataTable table = SqlHelper.ExecuteSqlTable(sqlDataSource, query);
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

        private static void AddNameToList(List<RegistrationData> correctDataList, User user)
        {
            bool correct = WhetherStringStartsWithCapitalLetter(user.Name);
            string value;

            if (correct)
                value = "";
            else
                value = "Type correct name!";

            correctDataList.Add(new RegistrationData("name", value, correct));
        }

        private static void AddSurnameToList(List<RegistrationData> correctDataList, User user)
        {
            bool correct = WhetherStringStartsWithCapitalLetter(user.Surname);
            string value;

            if (correct)
                value = "";
            else
                value = "Type correct surname!";

            correctDataList.Add(new RegistrationData("surname", value, correct));
        }

        private static void AddDateToList(List<RegistrationData> correctDataList, User user)
        {
            bool correct = IsDateCorrect(user.DateOfBirth);
            string value;

            if (correct)
                value = "";
            else
                value = "Type correct date of birth!";

            correctDataList.Add(new RegistrationData("date", value, correct));
        }

        private static void AddLoginToList(List<RegistrationData> correctDataList , User user, string sqlDataSource)
        {
            bool correct = IsLoginUnique(user.Login, sqlDataSource);
            string value;

            if(correct)
            {
                correct = IsStringLengthLongerOrEqualMinLength(user.Login);
                if(correct)
                    value = "";
                else
                    value = "The login must have 8 marks or more!";
            }
            else
                value = "This login is already in use!";

            correctDataList.Add(new RegistrationData("login", value, correct));
        }

        private static void AddPasswordToList(List<RegistrationData> correctDataList, User user)
        {
            bool correct = IsStringLengthLongerOrEqualMinLength(user.Password);
            string value;

            if (correct)
                value = "";
            else
                value = "The password must have 8 marks or more!";

            correctDataList.Add(new RegistrationData("password", value, correct));
        }

        private static void AddPasswordRepeatToList(List<RegistrationData> correctDataList, User user)
        {
            bool correct = IsPasswordEqualsPasswordRepeat(user.Password, user.PasswordRepeat);
            string value;

            if (correct)
                value = "";
            else
                value = "Wrong password repeated!";

            correctDataList.Add(new RegistrationData("passwordRepeat", value, correct));
        }

        public static bool VerifyTable(List<RegistrationData> correctDataList)
        {
            foreach(RegistrationData correctDataSegment in correctDataList)
            {
                if (!correctDataSegment.Correct)
                    return false;
            }
            return true;
        }

        public static List<RegistrationData> VerifyUser(User user, string sqlDataSource)
        {
            List<RegistrationData> correctDataList = new();

            AddNameToList(correctDataList, user);
            AddSurnameToList(correctDataList, user);
            AddDateToList(correctDataList, user);
            AddLoginToList(correctDataList, user, sqlDataSource);
            AddPasswordToList(correctDataList, user);
            AddPasswordRepeatToList(correctDataList, user);

            return correctDataList;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccessLibrary.Models.User;
using WebAPI.Controllers;
using System.Data;
using DataAccessLibrary.DataAccess;

namespace WebAPI.Helpers
{
    static public class UserVerificationHelper
    {
        private static readonly int Login_PasswordMinLength = 8;
        private static readonly int UserMinAgeInDays = 1000;
        

        private static bool PasswordEqualsPasswordRepeat(string password, string passwordRepeat)
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

        private static bool WhetherStringEndsWithLowerLetters(string str)
        {
            foreach(char mark in str.Skip(1))
            {
                if (char.IsUpper(mark))
                    return false;
            }
            return true;
        }


        private static string VerifyName(string name)
        {
            string value;

            if (WhetherStringStartsWithCapitalLetter(name) && WhetherStringEndsWithLowerLetters(name))
                value = "";
            else
                value = "Type correct name!";

            return value;
        }

        private static string VerifySurname(string surname)
        {
            string value;

            if (WhetherStringStartsWithCapitalLetter(surname) && WhetherStringEndsWithLowerLetters(surname))
                value = "";
            else
                value = "Type correct surname!";

            return value;
        }

        private static string VerifyDate(DateTime date)
        {
            string value;

            if (IsDateCorrect(date))
                value = "";
            else
                value = "Type correct date of birth!";

            return value;
        }

        private static string VerifyLogin(string login, AppDbContext context)
        {
            string value;

            if (!context.Users.Where(u => u.Login == login).Any())
            {
                if (IsStringLengthLongerOrEqualMinLength(login))
                    value = "";
                else
                    value = "The login must have 8 marks or more!";
            }
            else
                value = "This login is already in use!";

            return value;
        }

        private static string VerifyPassword(string password)
        {
            string value;

            if (IsStringLengthLongerOrEqualMinLength(password))
                value = "";
            else
                value = "The password must have 8 marks or more!";

            return value;
        }

        private static string VerifyPasswordRepeat(string password, string passwordRepeat)
        {
            string value;

            if (PasswordEqualsPasswordRepeat(password, passwordRepeat))
                value = "";
            else
                value = "Wrong password repeated!";

            return value;
        }


        public static bool VerifyTable(Dictionary<string, string> correctDataList)
        {
            foreach(var correctDataSegment in correctDataList)
            {
                if (correctDataSegment.Value != "")
                    return false;
            }
            return true;
        }


        private static void RegistrationVerification(Dictionary<string, string> correctDataList, UserRegistration user, AppDbContext context)
        {
            correctDataList.Add("login",            VerifyLogin(user.Login, context));
            correctDataList.Add("password",         VerifyPassword(user.Password));
            correctDataList.Add("passwordRepeat",   VerifyPasswordRepeat(user.Password, user.PasswordRepeat));
        }

        private static void StandardVerification(Dictionary<string, string> correctDataList, User user)
        {
            correctDataList.Add("name",     VerifyName(user.Name));
            correctDataList.Add("surname",  VerifySurname(user.Surname));
            correctDataList.Add("date",     VerifyDate(user.DateOfBirth));
        }


        public static Dictionary<string, string> VerifyNewUser(UserRegistration user, AppDbContext context)
        {
            Dictionary<string, string> correctDataList = new();
            StandardVerification(correctDataList, user);
            RegistrationVerification(correctDataList, user, context);

            return correctDataList;
        }

        public static Dictionary<string, string> VerifyUser(User user)
        {
            Dictionary<string, string> correctDataList = new();
            StandardVerification(correctDataList, user);

            return correctDataList;
        }

        public static string IsNewPasswordCorrect(string password)
        {
            return VerifyPassword(password);
        }
    }
}

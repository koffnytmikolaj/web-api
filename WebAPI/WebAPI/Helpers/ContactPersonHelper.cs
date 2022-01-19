using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    public class ContactPersonHelper
    {
        static private bool WhetherStringStartsWithCapitalLetter(string str)
        {
            return char.IsUpper(str[0]);
        }

        private static bool WhetherStringEndsWithLowerLetters(string str)
        {
            foreach (char mark in str.Skip(1))
            {
                if (char.IsLower(mark))
                    continue;
                return false;
            }
            return true;
        }

        private static bool WhetherStringContainsOnlyDigits(string str)
        {
            foreach(char mark in str)
            {
                if (char.IsDigit(mark))
                    continue;
                return false;
            }
            return true;
        }

        private static bool IsEmailUnused(string email, AppDbContext context)
        {
            try
            {
                ContactPerson person = context.ContactPeople.Where(cp => cp.Email == email).First();
                return false;
            }
            catch(Exception)
            {
                return true;
            }
        }

        private static bool IsEmailPatternCorrect(string email)
        {
            int emailLength = email.Length;
            int atSignNumber = email.Count(mark => mark == '@');
            int atSignPosition = email.IndexOf('@');
            int lastDotPosition = email.LastIndexOf('.');

            if (emailLength <= 0)
                return false;
            if (atSignNumber != 1)
                return false;
            if (atSignPosition > lastDotPosition)
                return false;
            if (emailLength <= lastDotPosition + 1)
                return false;
            return true;
        }


        static private string VerifyName(string name)
        {
            if (WhetherStringStartsWithCapitalLetter(name) && WhetherStringEndsWithLowerLetters(name))
                return "";

            return "Type correct name";
        }

        static private string VerifySurname(string surname)
        {
            if (WhetherStringStartsWithCapitalLetter(surname) && WhetherStringEndsWithLowerLetters(surname))
                return "";

            return "Type correct surname";
        }

        static private string VerifyPhoneNumber(string phoneNumber)
        {
            if (phoneNumber.Length != 9)
                return "Wrong phone number length";
            if (!WhetherStringContainsOnlyDigits(phoneNumber))
                return "Wrong phone number";

            return "";
        }

        static private string VerifyEmail(string email, AppDbContext context)
        {
            if (!IsEmailUnused(email, context))
                return "This e-mail is already in use";
            if (!IsEmailPatternCorrect(email))
                return "Wrong e-mail";

            return "";
        }

        static private string VerifyJobTitle(string job)
        {
            if (job.Length <= 0)
                return "Wrong job title";

            return "";
        }

        static private string VerifyCompany(int companyId, AppDbContext context)
        {
            try
            {
                Company company = context.Companies.Where(c => c.CompanyId == companyId).First();
                return "";
            }
            catch (Exception)
            {
                return "Such company doesn't exist";
            }
        }


        static public bool VerifyTable(Dictionary<string, string> correctDataList)
        {
            foreach (var correctDataSegment in correctDataList)
            {
                if (correctDataSegment.Value != "")
                    return false;
            }
            return true;
        }


        static private void CreationVerification(Dictionary<string, string> correctDataTable, ContactPerson person, AppDbContext context)
        {
            correctDataTable.Add("email", VerifyEmail(person.Email, context));
        }
        
        static private void StandardVerification(Dictionary<string, string> correctDataTable, ContactPerson person, AppDbContext context)
        {
            correctDataTable.Add("name", VerifyName(person.Name));
            correctDataTable.Add("surname", VerifySurname(person.Surname));
            correctDataTable.Add("phone", VerifyPhoneNumber(person.PhoneNumber));
            correctDataTable.Add("job", VerifyJobTitle(person.JobTitle));
            correctDataTable.Add("company", VerifyCompany(person.CompanyId, context));
        }


        static public Dictionary<string, string> VerifyNewContactPerson(ContactPerson person, AppDbContext context)
        {
            Dictionary<string, string> correctDataTable = new();
            StandardVerification(correctDataTable, person, context);
            CreationVerification(correctDataTable, person, context);
            return correctDataTable;
        }

        static public Dictionary<string, string> VerifyContactPerson(ContactPerson person, AppDbContext context)
        {
            Dictionary<string, string> correctDataTable = new();
            StandardVerification(correctDataTable, person, context);
            return correctDataTable;
        }
    }
}

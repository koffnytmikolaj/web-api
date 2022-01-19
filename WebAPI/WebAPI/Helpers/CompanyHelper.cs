using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    static public class CompanyHelper
    {
        static private bool IsNipPatternCorrect(string nip)
        {
            for(int i = 0; i < 13; i++)
            {
                if(i == 3 || i == 7 || i == 10)
                {
                    if (nip[i] != '-')
                        return false;
                }
                else
                {
                    if (!char.IsNumber(nip[i]))
                        return false;
                }
            }
            return true;
        }

        static private bool IsNipUnused(string nip, AppDbContext context)
        {
            try
            {
                Company existingCompany = context.Companies.Where(c => c.Nip == nip).First();
            }
            catch (Exception)
            {
                return true;
            }
            return false;
        }

        static private bool IsNipLengthCorrect(string nip)
        {
            return nip.Length == 13;
        }

        static private bool IsNipControlDigitCorrect(string nip)
        {
            int[] nipDigits = new int[10];
            int j = 0;
            for (int i = 0; i < 13; i++)
            {
                if (i == 3 || i == 7 || i == 10)
                    continue;
                nipDigits[j] = nip[i] - 48;
                j++;
            }
                
            int sum = 0;
            sum += nipDigits[0] * 6;
            sum += nipDigits[1] * 5;
            sum += nipDigits[2] * 7;
            sum += nipDigits[3] * 2;
            sum += nipDigits[4] * 3;
            sum += nipDigits[5] * 4;
            sum += nipDigits[6] * 5;
            sum += nipDigits[7] * 6;
            sum += nipDigits[8] * 7;

            return sum % 11 == nipDigits[9];
        }

        static private bool WhetherStringStartsWithCapitalLetter(string str)
        {
            return char.IsUpper(str[0]);
        }

        static private bool WhetherStringEndsWithLowerLetters(string str)
        {
            foreach (char mark in str.Skip(1))
            {
                if (char.IsUpper(mark))
                    return false;
            }
            return true;
        }


        static private string VerifyName(string name)
        {
            if (name.Length < 1)
                return "Type a company name";
            return "";
        }

        static private string VerifyNip(string nip, AppDbContext context)
        {
            if (!IsNipPatternCorrect(nip))
                return "This NIP has got incorrect pattern";
            if (!IsNipUnused(nip, context))
                return "This NIP is already occupied";
            if (!IsNipLengthCorrect(nip))
                return "Wrong NIP length";
            if (!IsNipControlDigitCorrect(nip))
                return "Wrong NIP number";

            return "";
        }

        static private string VerifyIndustry(int industry, AppDbContext context)
        {
            try
            {
                Industry existingIndustry = context.Industries.Where(i => i.IndustryId == industry).First();
            }
            catch (Exception)
            {
                return "Type correct industry";
            }
            return "";
        }

        static private string VerifyAddress(string address)
        {
            if (address.Length < 1)
                return "Type a company address";
            return "";
        }

        static private string VerifyLocalization(string localization)
        {
            if(WhetherStringStartsWithCapitalLetter(localization) && WhetherStringEndsWithLowerLetters(localization))
            {
                return "";
            }
            return "Type correct localization";
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


        static private void CreationVerification(Dictionary<string, string> correctDataList, Company company, AppDbContext context)
        {
            correctDataList.Add("nip", VerifyNip(company.Nip, context));
        }

        static private void StandardVerification(Dictionary<string, string> correctDataList, Company company, AppDbContext context)
        {
            correctDataList.Add("name", VerifyName(company.Name));
            correctDataList.Add("industry", VerifyIndustry(company.IndustryId, context));
            correctDataList.Add("address", VerifyAddress(company.Address));
            correctDataList.Add("localization", VerifyLocalization(company.Localization));
        }


        static public Dictionary<string, string> VerifyNewCompany(Company company, AppDbContext context)
        {
            Dictionary<string, string> correctDataList = new();
            StandardVerification(correctDataList, company, context);
            CreationVerification(correctDataList, company, context);
            return correctDataList;
        }

        static public Dictionary<string, string> VerifyCompany(Company company, AppDbContext context)
        {
            Dictionary<string, string> correctDataList = new();
            StandardVerification(correctDataList, company, context);
            return correctDataList;
        }
    }
}

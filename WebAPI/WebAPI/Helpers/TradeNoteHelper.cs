using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    static public class TradeNoteHelper
    {
        static private string VerifyContent(string content)
        {
            if (content.Length <= 0)
                return "Fill the content";

            return "";
        }

        static private string VerifyCompany(int companyId, AppDbContext context)
        {
            try
            {
                Company company = context.Companies.Where(c => c.CompanyId == companyId).First();
                return "";
            }
            catch(Exception)
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


        static public Dictionary<string, string> VerifyTradeNote(TradeNote note, AppDbContext context)
        {
            Dictionary<string, string> correctDataTable = new();
            correctDataTable.Add("content", VerifyContent(note.NoteContent));
            correctDataTable.Add("company", VerifyCompany(note.CompanyId, context));
            return correctDataTable;
        }
    }
}

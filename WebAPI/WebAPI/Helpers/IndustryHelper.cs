using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    static public class IndustryHelper
    {
        static public IEnumerable<Industry> GetIndustryList(AppDbContext _context)
        {
            return _context.Industries
                .OrderBy(i => i.IndustryName)
                .ToList();
        }
    }
}

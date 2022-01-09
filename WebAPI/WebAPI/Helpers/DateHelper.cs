using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    static public class DateHelper
    {
        static public string TransformDateToString(DateTime date)
        {
            return date.ToString("yyyy-MM-dd");
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class Industry
    {
        [Key]
        public int IndustryId { get; set; }

        public string IndustryName { get; set; }
    }
}

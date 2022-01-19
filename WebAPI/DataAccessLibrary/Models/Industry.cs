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

        [MaxLength(64)]
        public string IndustryName { get; set; }
    }
}

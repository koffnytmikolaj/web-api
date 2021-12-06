using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppDataAccessLibrary.Models
{
    public class Industry
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        public string IndustryName { get; set; }
    }
}

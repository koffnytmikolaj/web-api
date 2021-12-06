using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class Role
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        public string RoleName { get; set; }
    }
}

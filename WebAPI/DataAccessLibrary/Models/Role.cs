using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [MaxLength(64)]
        public string RoleName { get; set; }
    }
}

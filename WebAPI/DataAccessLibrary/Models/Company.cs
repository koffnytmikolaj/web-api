using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }

        public string Name { get; set; }

        public string Nip { get; set; }

        public int IndustryId { get; set; }
        public virtual Industry Industry { get; set; }

        public string Address { get; set; }

        public string Localization { get; set; }

        public int UserId { get; set; }
        public virtual User.User User { get; set; }

        public DateTime DateOfAdd { get; set; }

        public bool IsDeleted { get; set; }
    }
}

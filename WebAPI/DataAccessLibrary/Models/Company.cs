using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    [Index(nameof(IndustryId))]
    [Index(nameof(DateOfAdd))]
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }

        [MaxLength(64)]
        public string Name { get; set; }

        [Column(TypeName = "char")]
        [StringLength(13)]
        public string Nip { get; set; }

        public int IndustryId { get; set; }
        public virtual Industry Industry { get; set; }

        [MaxLength(64)]
        public string Address { get; set; }

        [MaxLength(64)]
        public string Localization { get; set; }

        public int UserId { get; set; }
        public virtual User.User User { get; set; }

        public DateTime DateOfAdd { get; set; }

        public bool IsDeleted { get; set; }
    }
}

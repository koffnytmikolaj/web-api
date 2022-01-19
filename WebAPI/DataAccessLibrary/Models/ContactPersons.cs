using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    [Index(nameof(Surname))]
    public class ContactPerson
    {
        [Key]
        public int ContactPersonId { get; set; }

        [MaxLength(64)]
        public string Name { get; set; }

        [MaxLength(64)]
        public string Surname { get; set; }

        [Column(TypeName = "char")]
        [StringLength(9)]
        public string PhoneNumber { get; set; }

        [MaxLength(128)]
        public string Email { get; set; }

        [MaxLength(64)]
        public string JobTitle { get; set; }

        public int CompanyId { get; set; }
        public virtual Company Company { get; set; }

        public int UserId { get; set; }
        public virtual User.User User { get; set; }

        public bool IsDeleted { get; set; }
    }
}

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
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        public string Name { get; set; }

        [Required]
        [MaxLength(10)]
        [Column(TypeName = "char(10)")]
        public string Nip { get; set; }

        [Required]
        public int IndustryId { get; set; }

        public Industry Industry { get; set; }

        [Required]
        [MaxLength(32)]
        public string Address { get; set; }

        [Required]
        [MaxLength(32)]
        public string Localization { get; set; }

        [Required]
        public int AddingCompanyUserId { get; set; }

        public User AddingCompanyUser { get; set; }

        [Required]
        public DateTime DateOfAdd { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}

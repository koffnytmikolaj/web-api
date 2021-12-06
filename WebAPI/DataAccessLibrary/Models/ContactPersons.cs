using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class ContactPerson
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        public string Name { get; set; }

        [Required]
        [MaxLength(32)]
        public string Surname { get; set; }

        [Required]
        [Column(TypeName = "char(9)")]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(32)]
        public string Email { get; set; }

        [Required]
        [MaxLength(32)]
        public string JobTitle { get; set; }

        [Required]
        public Company RelatedCompany { get; set; }

        [Required]
        public User AddingPersonUser { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}

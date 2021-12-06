using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class User
    {
        public int Id { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(32)]
        public string Surname { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(32)]
        [Column(TypeName = "varchar(32)")]
        public string Login { get; set; }

        [MaxLength(256)]
        public string Password { get; set; }

        [Required]
        public Role Role { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}

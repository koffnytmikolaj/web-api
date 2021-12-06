using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppDataAccessLibrary.Models
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
        public string Login { get; set; }

        [MaxLength(256)]
        public string Password { get; set; }

        [Required]
        public int RoleId { get; set; }

        public Role Role { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models.User
{
    [Index(nameof(Login))]
    [Index(nameof(RoleId))]
    public class User
    {
        [Key]
        public virtual int UserId { get; set; }

        [MaxLength(64)]
        public virtual string Name { get; set; }

        [MaxLength(64)]
        public virtual string Surname { get; set; }

        public virtual DateTime DateOfBirth { get; set; }

        [MaxLength(64)]
        public virtual string Login { get; set; }

        [MaxLength(128)]
        public virtual string Password { get; set; }

        public virtual int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; }

        public virtual bool IsDeleted { get; set; }
    }
}

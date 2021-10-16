using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class User
    {
        public int id { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public int role { get; set; }
        public bool isDeleted { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nip { get; set; }
        public int Industry { get; set; }
        public string Address { get; set; }
        public string Localization { get; set; }
        public int AddingCompanyUser { get; set; }
        public DateTime DateOfAdd { get; set; }
        public bool IsDeleted { get; set; }
    }
}

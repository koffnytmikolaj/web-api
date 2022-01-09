using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models.User
{
    public class UserLogin : User
    {
        [JsonIgnore] 
        public override string Name { get; set; }

        [JsonIgnore] 
        public override string Surname { get; set; }

        [JsonIgnore] 
        public override DateTime DateOfBirth { get; set; }

        [JsonIgnore] 
        public override int RoleId { get; set; }

        [JsonIgnore] 
        public override Role Role { get; set; }

        [JsonIgnore] 
        public override bool IsDeleted { get; set; }
    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models.User
{
    public class UserAppView : User
    {
        [JsonIgnore]
        public override string Password { get; set; }
    }
}

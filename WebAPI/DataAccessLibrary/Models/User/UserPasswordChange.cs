using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models.User
{
    public class UserPasswordChange : User
    {
        public string NewPassword { get; set; }
    }
}

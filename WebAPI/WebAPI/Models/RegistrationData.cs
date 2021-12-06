using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RegistrationData
    {
        public string Key { get; }
        public string Value { get; }
        public bool Correct { get; }
        public RegistrationData(string key, string value, bool correct)
        {
            Key = key;
            Value = value;
            Correct = correct;
        }
    }
}

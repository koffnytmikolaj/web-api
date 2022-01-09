using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class TradeNote
    {
        [Key]
        public int TradeNoteId { get; set; }

        public string NoteContent { get; set; }

        public bool IsDeleted { get; set; }

        public int CompanyId { get; set; }
        public virtual Company Company { get; set; }

        public int UserId { get; set; }
        public virtual User.User User { get; set; }
    }
}

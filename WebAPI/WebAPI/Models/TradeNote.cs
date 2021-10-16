using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class TradeNote
    {
        public int Id { get; set; }
        public string NoteContent { get; set; }
        public bool IsDeleted { get; set; }
        public int RelatedCompany { get; set; }
        public int AddingNoteUser { get; set; }
    }
}

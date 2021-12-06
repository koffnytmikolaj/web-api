﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessLibrary.Models
{
    public class TradeNote
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(512)]
        public string NoteContent { get; set; }

        [Required]
        public bool IsDeleted { get; set; }

        [Required]
        public Company RelatedCompany { get; set; }

        [Required]
        public User AddingNoteUser { get; set; }
    }
}

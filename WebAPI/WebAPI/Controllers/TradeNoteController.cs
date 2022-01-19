using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using DataAccessLibrary.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Helpers;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradeNoteController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public TradeNoteController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        private IEnumerable<int> GetAllTradeNotes()
        {
            return _context.TradeNotes.Where(t => !t.IsDeleted).Select(t => t.TradeNoteId).ToList();
        }

        [Route("GetTradeNotes")]
        [HttpGet]
        public JsonResult GetTradeNotes(int page = 1, string order = "", bool desc = false, string search = "")
        {
            try
            {
                User user = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (user.RoleId != 1 && user.RoleId != 2 && user.RoleId != 3)
                    throw new Exception();
            }
            catch(Exception)
            {
                return new JsonResult(false);
            }

            ICollection<Company> companies = _context.Companies.Where(c => !c.IsDeleted).ToList();
            ICollection<User> users = _context.Users.Where(u => !u.IsDeleted).ToList();
            var tradeNotes = _context.TradeNotes.Where(t => !t.IsDeleted).ToList().Join(
                companies,
                t => t.CompanyId,
                c => c.CompanyId,
                (note, company) => new
                {
                    note,
                    company.Name,
                    company.Nip
                }
            )
            .Join(
                users,
                t => t.note.UserId,
                u => u.UserId,
                (note, user) => new
                {
                    note.note.TradeNoteId,
                    note.note.NoteContent,
                    note.note.IsDeleted,
                    note.note.CompanyId,
                    note.Nip,
                    CompanyName = note.Name,
                    note.note.UserId,
                    user.Login
                }
            );

            Type typeOfData = tradeNotes.GetType().GetGenericArguments().Last();
            var orderProperty = typeOfData.GetProperty(order);
            if (orderProperty != null)
            {
                if (desc)
                    tradeNotes = tradeNotes.OrderByDescending(t => orderProperty.GetValue(t, null));
                else
                    tradeNotes = tradeNotes.OrderBy(t => orderProperty.GetValue(t, null));
            }
            else
            {
                if (desc)
                    tradeNotes = tradeNotes.OrderByDescending(t => t.TradeNoteId);
                else
                    tradeNotes = tradeNotes.OrderBy(t => t.TradeNoteId);
            }
            if (!string.IsNullOrEmpty(search))
            {
                tradeNotes = tradeNotes.Where(t =>
                    t.NoteContent.ToLower().Contains(search.ToLower())
                    || t.Nip.ToLower().Contains(search.ToLower())
                    || t.Login.ToLower().Contains(search.ToLower())
                    || t.CompanyName.ToLower().Contains(search.ToLower())
                    || t.Login.ToLower().Contains(search.ToLower())
                );
            } //Pagination
            else
            {
                tradeNotes = tradeNotes
                    .Skip((page - 1) * ShowItems.itemsPerPage)
                    .Take(ShowItems.itemsPerPage);
            }

            return new JsonResult(tradeNotes);
        }

        [Route("GetNumberOfPages")]
        [HttpGet]
        public JsonResult GetNumberOfPages()
        {
            try
            {
                User user = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (user.RoleId != 1 && user.RoleId != 2 && user.RoleId != 3)
                    throw new Exception();
                int numberOfNotes = GetAllTradeNotes().Count();
                int additionalPage = numberOfNotes % ShowItems.itemsPerPage == 0 ? 0 : 1;

                return new JsonResult(numberOfNotes / ShowItems.itemsPerPage + additionalPage);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("AddTradeNote")]
        [HttpPost]
        public JsonResult AddTradeNote(TradeNote note)
        {
            try
            {
                User addingUser = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (addingUser.RoleId != 2)
                    throw new Exception();
                Dictionary<string, string> registrationTable = TradeNoteHelper.VerifyTradeNote(note, _context);
                if (!TradeNoteHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);
                note.IsDeleted = false;
                note.UserId = addingUser.UserId;
                _context.TradeNotes.Add(note);
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("EditTradeNote")]
        [HttpPut]
        public JsonResult EditTradeNote(TradeNote editedNote)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();
                Dictionary<string, string> registrationTable = TradeNoteHelper.VerifyTradeNote(editedNote, _context);
                if (!CompanyHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);

                TradeNote note = _context.TradeNotes.Where(t => t.TradeNoteId == editedNote.TradeNoteId).First();
                note.NoteContent = editedNote.NoteContent;
                note.CompanyId = editedNote.CompanyId;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("DeleteTradeNote")]
        [HttpPut]
        public JsonResult DeleteTradeNote(TradeNote note)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();

                TradeNote deletedNote = _context.TradeNotes.Where(t => t.TradeNoteId == note.TradeNoteId).First();
                deletedNote.NoteContent = null;
                deletedNote.IsDeleted = true;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }
    }
}

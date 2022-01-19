using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
using DataAccessLibrary.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Helpers;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactPeopleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public ContactPeopleController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        private IEnumerable<int> GetAllContactPeople()
        {
            return _context.ContactPeople.Where(t => !t.IsDeleted).Select(t => t.ContactPersonId).ToList();
        }

        [Route("GetContactPeople")]
        [HttpGet]
        public JsonResult GetContactPeople(int page = 1, string order = "", bool desc = false, string search = "")
        {
            try
            {
                User user = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (user.RoleId != 1 && user.RoleId != 2 && user.RoleId != 3)
                    throw new Exception();
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }

            ICollection<Company> companies = _context.Companies.Where(c => !c.IsDeleted).ToList();
            ICollection<User> users = _context.Users.Where(u => !u.IsDeleted).ToList();
            var contactPeople = _context.ContactPeople.Where(cp => !cp.IsDeleted).ToList().Join(
                companies,
                cp => cp.CompanyId,
                c => c.CompanyId,
                (person, company) => new
                {
                    person,
                    company.Name,
                    company.Nip
                }
            )
            .Join(
                users,
                cp => cp.person.UserId,
                u => u.UserId,
                (person, user) => new
                {
                    person.person.ContactPersonId,
                    person.person.Name,
                    person.person.Surname,
                    person.person.PhoneNumber,
                    person.person.Email,
                    person.person.JobTitle,
                    person.person.CompanyId,
                    CompanyName = person.Name,
                    person.Nip,
                    person.person.IsDeleted,
                    user.Login
                }
            );

            Type typeOfData = contactPeople.GetType().GetGenericArguments().Last();
            var orderProperty = typeOfData.GetProperty(order);
            if (orderProperty != null)
            {
                if (desc)
                    contactPeople = contactPeople.OrderByDescending(cp => orderProperty.GetValue(cp, null));
                else
                    contactPeople = contactPeople.OrderBy(cp => orderProperty.GetValue(cp, null));
            }
            else
            {
                if (desc)
                    contactPeople = contactPeople.OrderByDescending(t => t.Surname);
                else
                    contactPeople = contactPeople.OrderBy(t => t.Surname);
            }
            if (!string.IsNullOrEmpty(search))
            {
                contactPeople = contactPeople.Where(cp =>
                    cp.Name.ToLower().Contains(search.ToLower())
                    || cp.Surname.ToLower().Contains(search.ToLower())
                    || cp.PhoneNumber.ToLower().Contains(search.ToLower())
                    || cp.Email.ToLower().Contains(search.ToLower())
                    || cp.JobTitle.ToLower().Contains(search.ToLower())
                    || cp.CompanyName.ToLower().Contains(search.ToLower())
                    || cp.Nip.ToLower().Contains(search.ToLower())
                    || cp.Login.ToLower().Contains(search.ToLower())
                );
            } //Pagination
            else
            {
                contactPeople = contactPeople
                    .Skip((page - 1) * ShowItems.itemsPerPage)
                    .Take(ShowItems.itemsPerPage);
            }

            return new JsonResult(contactPeople);
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
                int numberOfNotes = GetAllContactPeople().Count();
                int additionalPage = numberOfNotes % ShowItems.itemsPerPage == 0 ? 0 : 1;

                return new JsonResult(numberOfNotes / ShowItems.itemsPerPage + additionalPage);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("AddContactPerson")]
        [HttpPost]
        public JsonResult AddContactPerson(ContactPerson person)
        {
            try
            {
                User addingUser = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (addingUser.RoleId != 2)
                    throw new Exception();

                Dictionary<string, string> registrationTable = ContactPersonHelper.VerifyNewContactPerson(person, _context);
                if (!ContactPersonHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);
                person.IsDeleted = false;
                person.UserId = addingUser.UserId;
                _context.ContactPeople.Add(person);
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("EditContactPerson")]
        [HttpPut]
        public JsonResult EditContactPerson(ContactPerson editedPerson)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();
                Dictionary<string, string> registrationTable = ContactPersonHelper.VerifyContactPerson(editedPerson, _context);
                if (!CompanyHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);

                ContactPerson person = _context.ContactPeople.Where(cp => cp.ContactPersonId == editedPerson.ContactPersonId).First();
                person.CompanyId = editedPerson.CompanyId;
                person.JobTitle = editedPerson.JobTitle;
                person.Name = editedPerson.Name;
                person.PhoneNumber = editedPerson.PhoneNumber;
                person.Surname = editedPerson.Surname;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("DeleteContactPerson")]
        [HttpPut]
        public JsonResult DeleteContactPerson(ContactPerson person)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();

                ContactPerson deletedPerson = _context.ContactPeople.Where(cp => cp.ContactPersonId == person.ContactPersonId).First();
                deletedPerson.Name = null;
                deletedPerson.Surname = null;
                deletedPerson.PhoneNumber = null;
                deletedPerson.IsDeleted = true;
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

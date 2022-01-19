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
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public CompanyController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [Route("GetAllCompanies")]
        [HttpGet]
        public JsonResult GetAllCompanies()
        {
            IEnumerable<Company> companies = _context.Companies.Where(c => !c.IsDeleted).ToList();

            return new JsonResult(companies);
        }

        [Route("GetCompanies")]
        [HttpGet]
        public JsonResult GetCompanies(int page = 1, string order = "", bool desc = false, string search = "")
        {
            try
            {
                User user = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (user.RoleId != 1 && user.RoleId != 2 && user.RoleId != 3)
                    throw new Exception();

                ICollection<Industry> industries = _context.Industries.ToList();
                ICollection<User> users = _context.Users.Where(u => !u.IsDeleted).ToList();
                var companies = _context.Companies.Where(c => !c.IsDeleted).ToList().Join(
                    industries,
                    c => c.IndustryId,
                    i => i.IndustryId,
                    (company, industry) => new
                    {
                        company,
                        industry.IndustryName
                    }
                )
                .Join(
                    users,
                    c => c.company.UserId,
                    u => u.UserId,
                    (company, user) => new
                    {
                        company.company.CompanyId,
                        company.company.Name,
                        company.company.Nip,
                        company.company.IndustryId,
                        company.IndustryName,
                        company.company.Address,
                        company.company.Localization,
                        company.company.UserId,
                        user.Login,
                        company.company.DateOfAdd,
                        company.company.IsDeleted
                    }
                );
                
                Type typeOfData = companies.GetType().GetGenericArguments().Last();
                var orderProperty = typeOfData.GetProperty(order);
                if (orderProperty != null)
                {
                    if (desc)
                        companies = companies.OrderByDescending(c => orderProperty.GetValue(c, null));
                    else
                        companies = companies.OrderBy(c => orderProperty.GetValue(c, null));
                }
                else
                {
                    if (desc)
                        companies = companies.OrderByDescending(c => c.IndustryName).ThenBy(c => c.DateOfAdd);
                    else
                        companies = companies.OrderBy(c => c.IndustryName).ThenBy(c => c.DateOfAdd);
                }
                if (!string.IsNullOrEmpty(search))
                {
                    companies = companies.Where(c =>
                        c.IndustryName.ToLower().Contains(search.ToLower())
                        || c.Localization.ToLower().Contains(search.ToLower())
                        || c.Login.ToLower().Contains(search.ToLower())
                        || c.Name.ToLower().Contains(search.ToLower())
                        || c.Nip.ToLower().Contains(search.ToLower())
                    );
                } //Pagination
                else
                {
                    companies = companies
                        .Skip((page - 1) * ShowItems.itemsPerPage)
                        .Take(ShowItems.itemsPerPage);
                }
                
                return new JsonResult(companies);
            }
            catch(Exception e)
            {
                return new JsonResult(e);
            }
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
                int numberOfCompanies = _context.Companies.Where(c => !c.IsDeleted).Count();
                int additionalPage = numberOfCompanies % ShowItems.itemsPerPage == 0 ? 0 : 1;

                return new JsonResult(numberOfCompanies / ShowItems.itemsPerPage + additionalPage);
            }
            catch(Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("AddCompany")]
        [HttpPost]
        public JsonResult AddCompany(Company company)
        {
            try
            {
                User addingUser = LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context);
                if (addingUser.RoleId != 2)
                    throw new Exception();
                Dictionary<string, string> registrationTable = CompanyHelper.VerifyNewCompany(company, _context);
                if (!CompanyHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);
                company.DateOfAdd = DateTime.Now;
                company.IsDeleted = false;
                company.UserId = addingUser.UserId;
                _context.Companies.Add(company);
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("EditCompany")]
        [HttpPut]
        public JsonResult EditCompany(Company editedCompany)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();
                Dictionary<string, string> registrationTable = CompanyHelper.VerifyCompany(editedCompany, _context);
                if (!CompanyHelper.VerifyTable(registrationTable))
                    return new JsonResult(registrationTable);

                Company company = _context.Companies.Where(c => c.CompanyId == editedCompany.CompanyId).First();
                company.Address = editedCompany.Address;
                company.IndustryId = editedCompany.IndustryId;
                company.Localization = editedCompany.Localization;
                company.Name = editedCompany.Name;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("DeleteCompany")]
        [HttpPut]
        public JsonResult DeleteCompany(Company company)
        {
            try
            {
                if (LoginHelper.GetUserByCookie(Request.Cookies["jwt"], _jwtService, _context).RoleId != 2)
                    throw new Exception();

                Company deletedCompany = _context.Companies.Where(c => c.CompanyId == company.CompanyId).First();
                deletedCompany.Address = null;
                deletedCompany.Name = null;
                deletedCompany.IsDeleted = true;
                _context.SaveChanges();
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        [Route("RandNip")]
        [HttpGet]
        public string RandNip()
        {
            while(true)
            {
                int randNumber;
                int[] nip = new int[10];
                string result = "";
                Random r = new();
                for (int i = 0; i < 9; i++)
                {
                    if (i == 3 || i == 6 || i == 8)
                        result += '-';
                    randNumber = r.Next(0, 9);
                    nip[i] = randNumber;
                    result += randNumber;
                }
                int sum = 0;
                sum += nip[0] * 6;
                sum += nip[1] * 5;
                sum += nip[2] * 7;
                sum += nip[3] * 2;
                sum += nip[4] * 3;
                sum += nip[5] * 4;
                sum += nip[6] * 5;
                sum += nip[7] * 6;
                sum += nip[8] * 7;

                if (sum % 11 == 10)
                    continue;
                result += sum % 11;
                return result;
            }
            
        }
    }
}

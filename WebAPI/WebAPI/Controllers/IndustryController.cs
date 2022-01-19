using DataAccessLibrary.DataAccess;
using DataAccessLibrary.Models;
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
    public class IndustryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public IndustryController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [Route("GetAllIndustries")]
        [HttpGet]
        public JsonResult GetAllIndustries()
        {
            IEnumerable<Industry> industries =
                IndustryHelper.GetIndustryList(_context);

            return new JsonResult(industries);
        }

        [Route("GetIndustries")]
        [HttpGet]
        public JsonResult GetIndustries(int page = 1, string order = "", bool desc = false, string search = "")
        {
            IEnumerable<Industry> industries = IndustryHelper.GetIndustryList(_context);
            Type typeOfData = industries.GetType().GetGenericArguments().Last();
            var orderProperty = typeOfData.GetProperty(order);
            if (orderProperty != null)
            {
                try
                {
                    if (desc)
                        industries = industries.OrderByDescending(u => orderProperty.GetValue(u, null));
                    else
                        industries = industries.OrderBy(u => orderProperty.GetValue(u, null));
                }
                catch (Exception) { }
            }
            else
            {
                if (desc)
                    industries = industries.OrderByDescending(i => i.IndustryName);
                else
                    industries = industries.OrderBy(i => i.IndustryName);
            }
            if (!string.IsNullOrEmpty(search))
            {
                industries = industries.Where(i => i.IndustryName.ToLower().Contains(search.ToLower()));
            } //Pagination
            else
            {
                industries = industries
                    .Skip((page - 1) * ShowItems.itemsPerPage)
                    .Take(ShowItems.itemsPerPage);
            }

            return new JsonResult(industries);
        }

        [Route("GetNumberOfPages")]
        [HttpGet]
        public JsonResult GetNumberOfPages()
        {
            int numberOfIndustries = _context.Industries.Count();
            int additionalPage = numberOfIndustries % ShowItems.itemsPerPage == 0 ? 0 : 1;

            return new JsonResult(numberOfIndustries / ShowItems.itemsPerPage + additionalPage);
        }

        [Route("AddIndustry")]
        [HttpPost]
        public JsonResult AddIndustry(Industry newIndustry)
        {
            try
            {
                Industry industry = _context.Industries.Where(i => i.IndustryName == newIndustry.IndustryName).First();
                return new JsonResult(false);
            }
            catch(Exception)
            {
                _context.Industries.Add(newIndustry);
                _context.SaveChanges();
                return new JsonResult(true);
            }
        }

        [Route("EditIndustry")]
        [HttpPut]
        public JsonResult EditIndustry(Industry editedIndustry)
        {
            try
            {
                Industry industry = _context.Industries.Where(i => i.IndustryName == editedIndustry.IndustryName).First();
                return new JsonResult(false);
            }
            catch (Exception)
            {
                _context.Industries.Where(i => i.IndustryId == editedIndustry.IndustryId).First().IndustryName = editedIndustry.IndustryName;
                _context.SaveChanges();
                return new JsonResult(true);
            }
        }
    }
}

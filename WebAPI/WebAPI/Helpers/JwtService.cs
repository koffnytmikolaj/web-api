using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    public class JwtService
    {
        private readonly string securityKey = "FDmsdjfoaAdW92MSQW,D2EWMF932  mdj,weldwllw84-232j1nf`xh3ggccg2aknjajnajn91z17g vg";

        public string Generate(int id)
        {
            SymmetricSecurityKey symmetricSecurityKey = new(Encoding.UTF8.GetBytes(securityKey));
            SigningCredentials credentials = new(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            JwtHeader header = new(credentials);

            JwtPayload payload = new(id.ToString(), null, null, null, DateTime.Today.AddDays(1));
            JwtSecurityToken token = new(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public JwtSecurityToken Verify(string jwt)
        {
            JwtSecurityTokenHandler tokenHandler = new();
            byte[] key = Encoding.ASCII.GetBytes(securityKey);

            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
    }
}

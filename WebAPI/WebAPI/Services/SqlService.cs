using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Services
{
    static public class SqlService
    {
        static private void LoadQuery(SqlConnection myCon, DataTable table, string query)
        {
            SqlCommand myCommand = new(query, myCon);
            SqlDataReader myReader = myCommand.ExecuteReader();
            table.Load(myReader);
            myReader.Close();
        }

        static public DataTable ExecuteSqlTable(string sqlDataSource, string query)
        {
            DataTable table = new();
            SqlConnection myCon = new(sqlDataSource);
            myCon.Open();
            LoadQuery(myCon, table, query);
            myCon.Close();

            return table;
        }
    }
}

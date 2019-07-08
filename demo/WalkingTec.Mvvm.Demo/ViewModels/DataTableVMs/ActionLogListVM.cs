﻿using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using WalkingTec.Mvvm.Core;

namespace WalkingTec.Mvvm.Demo.ViewModels.DataTableVMs
{
    public class ActionLogListVM : BasePagedListVM<CustomView, BaseSearcher>
    {
        protected override List<GridAction> InitGridAction()
        {
            var actions = new List<GridAction>
            {
                this.MakeAction(null,null,"test",null, GridActionParameterTypesEnum.NoId).SetOnClickScript("test").SetShowInRow(true),
                this.MakeStandardExportAction(null,false,ExportEnum.Excel)
            };
            return actions;
        }

        protected override IEnumerable<IGridColumn<CustomView>> InitGridHeader()
        {
            var header = new List<GridColumn<CustomView>>();

            header.Add(this.MakeGridHeader(x => x.test1, 120));
            header.Add(this.MakeGridHeader(x => x.test2, 120));
            header.Add(this.MakeGridHeaderAction(width: 120));

            return header;
        }

        public override DbCommand GetSearchCommand()
        {
            var sql = string.Format("SELECT top 10 itcode as test1, modulename as test2 from actionlogs");

            var cmd = DC.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = sql;
            cmd.CommandType = CommandType.Text;

            //var cmd = ((DbContext)DC).Database.GetDbConnection().CreateCommand();
            //cmd.CommandText = "SP_StudentInformationSummarySearch";
            //cmd.CommandType = System.Data.CommandType.StoredProcedure;
            return cmd;
        }
    }

    public class CustomView: TopBasePoco
    {
        public string test1 { get; set; }
        public string test2 { get; set; }
    }
}

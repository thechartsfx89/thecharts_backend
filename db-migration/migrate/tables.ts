export const TABLES = [
  // { schema: "dbo", source: "LoginLogs", target: "login_logs", pk: "LoginId" },
  { schema: "dbo", source: "member_Cycle_Master", target: "member_cycle_master", pk: "Loginid" },
  // { schema: "dbo", source: "Member_login", target: "member_login", pk: "loginid" },
  { schema: "dbo", source: "member_Master", target: "member_master", pk: "LoginID" },
  { schema: "dbo", source: "member_Master_temp", target: "member_master_temp", pk: "LoginID" },
  { schema: "dbo", source: "Tbl_PanApplication", target: "tbl_panapplication", pk: "LoginID" },
  { schema: "dbo", source: "tbljoin", target: "tbljoin", pk: "LoginID" },
  { schema: "dbo", source: "tblnoupline", target: "tblnoupline", pk: "loginid" },
  { schema: "EducandleL", source: "tblWrongIncome", target: "tblwrongincome", pk: "loginid" },
  { schema: "dbo", source: "tblZeroupline", target: "tblzeroupline", pk: "loginid" },

  // views → snapshot tables
  { schema: "dbo", source: "vwKYCcomplete", target: "vwkyccomplete", pk: "loginid" },
  { schema: "dbo", source: "vwMemberKycStatus", target: "vwmemberkycstatus", pk: "loginid" },
];
